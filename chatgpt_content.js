(function () {
  if (window.__EXT_GPT_HOTKEYS_INSTALLED__) return;
  window.__EXT_GPT_HOTKEYS_INSTALLED__ = true;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const until = async (check, timeout = 15000, interval = 150) => {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeout) {
      const result = check();
      if (result) return result;
      await sleep(interval);
    }
    return null;
  };

  let batchRunning = false;
  let currentBatchId = "";
  let batchStopRequested = false;
  let currentBatchStuckRefresh = null;
  const BATCH_STOPPED_ERROR = "__BATCH_STOPPED__";
  const BATCH_RETRY_STORAGE_KEY = "__GPT_QUICK_SEARCH_BATCH_RETRY__";
  const BATCH_MAX_REFRESH_RETRIES = 5;
  const BATCH_NEW_TAB_RETRY_AFTER = 2;
  const BATCH_REPLY_TIMEOUT_MS = 600000;
  const BATCH_REPLY_STABLE_MS = 5000;
  const BATCH_REPLY_CONFIRM_MS = 1500;
  const BATCH_REPLY_FINAL_CONFIRM_MS = 10000;
  const BATCH_RETRY_WATCHDOG_MS = 300000;
  const BATCH_CONVERSATION_ITEM_LIMIT = 30;
  const BATCH_HEARTBEAT_INTERVAL_MS = 15000;
  let lastBatchHeartbeatAt = 0;
  let exportRunning = false;
  let currentExportId = "";
  let exportStopRequested = false;
  let currentExportAbortController = null;
  const CHAT_EXPORT_STOPPED_ERROR = "__CHAT_EXPORT_STOPPED__";
  const DEEP_RESEARCH_IFRAME_SELECTOR = 'iframe[title="internal://deep-research"]';
  const DEEP_RESEARCH_EXPORT_REQUEST = "__EXT_DEEP_RESEARCH_EXPORT_REQUEST__";
  const DEEP_RESEARCH_EXPORT_RESPONSE = "__EXT_DEEP_RESEARCH_EXPORT_RESPONSE__";

  function saveBatchRetryState(state) {
    try {
      sessionStorage.setItem(BATCH_RETRY_STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {}
    return false;
  }

  function readBatchRetryState() {
    try {
      const raw = sessionStorage.getItem(BATCH_RETRY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      clearBatchRetryState();
      return null;
    }
  }

  function clearBatchRetryState() {
    try {
      sessionStorage.removeItem(BATCH_RETRY_STORAGE_KEY);
    } catch {}
  }

  function isElementVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle ? window.getComputedStyle(element) : null;
    if (style && (style.display === "none" || style.visibility === "hidden")) return false;
    return element.offsetParent !== null || element.getClientRects().length > 0;
  }

  function composeFullText(text, prefix) {
    const cleanPrefix = typeof prefix === "string" ? prefix.trimEnd() : "";
    const cleanText = extractContentBatchText(text);
    if (!cleanPrefix) return cleanText;
    if (!cleanText) return cleanPrefix;
    return `${cleanPrefix}\n${cleanText}`;
  }

  function extractContentBatchText(value) {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value);
    if (!value || typeof value !== "object") return "";

    for (const key of ["text", "title", "name", "value", "label"]) {
      const text = extractContentBatchText(value[key]);
      if (text) return text;
    }

    return "";
  }

  function normalizeContentBatchItemNumber(value) {
    const match = String(value || "").trim().match(/^(\d+(?:[._]\d+)*)$/u);
    return match ? match[1].replace(/\./g, "_") : "";
  }

  function normalizeContentBatchItem(item) {
    if (item && typeof item === "object") {
      const text = extractContentBatchText(item);
      if (!text) return null;
      return {
        text,
        itemNumber: normalizeContentBatchItemNumber(item.itemNumber),
        directoryPath: Array.isArray(item.directoryPath)
          ? item.directoryPath.map((part) => String(part || "").trim()).filter(Boolean)
          : []
      };
    }

    const text = String(item || "").trim();
    if (!text) return null;
    return { text, itemNumber: "", directoryPath: [] };
  }

  function getTextFromNode(node) {
    if (!node) return "";
    const clone = node.cloneNode(true);
    clone.querySelectorAll("button, svg, textarea, input").forEach((element) => element.remove());
    return (clone.innerText || clone.textContent || "")
      .replace(/\u200b/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function normalizeChatGptPageErrorText(text) {
    return String(text || "")
      .replace(/\u200b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getElementTextWithControls(element) {
    if (!element) return "";
    return normalizeChatGptPageErrorText([
      getTextFromNode(element),
      element.innerText || "",
      element.textContent || "",
      element.getAttribute("aria-label") || "",
      element.getAttribute("title") || ""
    ].join(" "));
  }

  function isChatGptTransientPageErrorText(text) {
    const normalized = normalizeChatGptPageErrorText(text);
    if (!normalized) return false;

    const chineseTransientError = (
      /消息发送超时/u.test(normalized) ||
      /发送超时/u.test(normalized) ||
      /请求超时/u.test(normalized) ||
      /网络错误/u.test(normalized) ||
      /出错了/u.test(normalized) ||
      /请再试一次/u.test(normalized) ||
      (/请重试/u.test(normalized) && /消息|发送|请求|回答|响应|生成|错误|超时/u.test(normalized)) ||
      (/重试/u.test(normalized) && /已停止思考|发送失败|生成失败/u.test(normalized))
    );
    if (chineseTransientError) return true;

    return /message (?:send|sending) timed out/i.test(normalized) ||
      /timed out[^\n.。]*try again/i.test(normalized) ||
      /request timed out/i.test(normalized) ||
      /network error/i.test(normalized) ||
      /something went wrong/i.test(normalized) ||
      /there was an error generating (?:a )?response/i.test(normalized) ||
      (/please retry/i.test(normalized) && /message|send|sending|request|response|generation|error|timeout/i.test(normalized)) ||
      (/please try again/i.test(normalized) && /message|send|sending|request|response|generation|error|timeout/i.test(normalized)) ||
      (/retry/i.test(normalized) && /stopped thinking|failed to send|failed to generate|timed out/i.test(normalized));
  }

  function isElementForLatestChatGptResponse(element) {
    if (!element) return false;

    const assistantMessages = getAssistantMessages();
    const latestAssistant = assistantMessages[assistantMessages.length - 1] || null;
    if (latestAssistant && (
      latestAssistant === element ||
      latestAssistant.contains(element) ||
      element.contains(latestAssistant)
    )) {
      return true;
    }

    const userMessages = getUserMessages();
    const latestUser = userMessages[userMessages.length - 1] || null;
    if (!latestUser) return !latestAssistant;

    return Boolean(latestUser.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  function getVisibleChatGptTransientPageErrorText() {
    const roots = Array.from(document.querySelectorAll([
      "[role='alert']",
      "[aria-live]",
      "[data-testid*='error' i]",
      "[data-testid*='toast' i]",
      "[data-testid*='retry' i]",
      "main [class*='error' i]",
      "main [class*='danger' i]",
      "main [class*='destructive' i]",
      "main [class*='red' i]"
    ].join(",")));

    for (const element of roots) {
      if (!isElementVisible(element)) continue;
      if (!isElementForLatestChatGptResponse(element)) continue;
      const text = getElementTextWithControls(element);
      if (isChatGptTransientPageErrorText(text)) {
        return text.slice(0, 240);
      }
    }

    const retryButtons = Array.from(document.querySelectorAll("main button")).filter((button) => {
      if (!isElementVisible(button) || button.disabled) return false;
      if (!isElementForLatestChatGptResponse(button)) return false;
      const label = getElementTextWithControls(button).toLowerCase();
      return /\b(retry|try again)\b/i.test(label) || /重试/u.test(label);
    });

    for (const button of retryButtons) {
      let current = button;
      for (let depth = 0; current && depth < 6; depth += 1) {
        const text = getElementTextWithControls(current);
        if (isChatGptTransientPageErrorText(text)) {
          return text.slice(0, 240);
        }
        current = current.parentElement;
      }
    }

    return "";
  }

  function throwIfChatGptTransientPageError() {
    const errorText = getVisibleChatGptTransientPageErrorText();
    if (errorText) {
      throw new Error(`ChatGPT 页面临时错误：${errorText}`);
    }
  }

  function splitIntoParagraphs(text) {
    return String(text || "")
      .replace(/\r\n?/g, "\n")
      .split(/\n\s*\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  function normalizeParagraphKey(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeExternalUrl(url) {
    const raw = typeof url === "string" ? url.trim() : "";
    if (!raw) return "";

    try {
      const parsed = new URL(raw, window.location.href);
      if (!/^https?:$/i.test(parsed.protocol)) {
        return "";
      }
      return parsed.href;
    } catch {
      return "";
    }
  }

  function normalizeReferenceLabel(label, url) {
    const normalized = typeof label === "string"
      ? label.replace(/\s+/g, " ").trim()
      : "";

    if (normalized && normalized.length <= 120 && !/^https?:\/\//i.test(normalized)) {
      return normalized;
    }

    try {
      return new URL(url).hostname.replace(/^www\./i, "") || "外部链接";
    } catch {
      return "外部链接";
    }
  }

  function escapeMarkdownLinkLabel(label) {
    return String(label || "")
      .replace(/\\/g, "\\\\")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]");
  }

  function appendExternalReferences(text, references) {
    const normalizedText = String(text || "").trim();
    const existingUrls = new Set(
      (normalizedText.match(/https?:\/\/[^\s)]+/g) || [])
        .map((item) => item.replace(/[)>.,;:!?]+$/g, ""))
    );
    const seenUrls = new Set();
    const lines = [];

    for (const reference of Array.isArray(references) ? references : []) {
      const url = normalizeExternalUrl(reference?.url);
      if (!url || existingUrls.has(url) || seenUrls.has(url)) {
        continue;
      }

      seenUrls.add(url);
      const label = escapeMarkdownLinkLabel(normalizeReferenceLabel(reference?.label, url));
      lines.push(`- [${label}](${url})`);
    }

    if (!lines.length) {
      return normalizedText;
    }

    return normalizedText
      ? `${normalizedText}\n\n参考链接\n${lines.join("\n")}`
      : `参考链接\n${lines.join("\n")}`;
  }

  function collectExternalReferencesFromElement(element) {
    if (!element) {
      return [];
    }

    const references = [];
    const seenUrls = new Set();
    for (const anchor of element.querySelectorAll("a[href]")) {
      const url = normalizeExternalUrl(anchor.getAttribute("href") || anchor.href);
      if (!url || seenUrls.has(url)) {
        continue;
      }

      seenUrls.add(url);
      references.push({
        url,
        label: anchor.getAttribute("title") || anchor.innerText || anchor.textContent || ""
      });
    }

    return references;
  }

  function pickReferenceLabel(candidate, url) {
    const values = [
      candidate?.title,
      candidate?.display_text,
      candidate?.displayText,
      candidate?.label,
      candidate?.name,
      candidate?.site_name,
      candidate?.siteName,
      candidate?.source,
      candidate?.text
    ];

    for (const value of values) {
      const normalized = typeof value === "string"
        ? value.replace(/\s+/g, " ").trim()
        : "";
      if (normalized && normalized.length <= 120 && normalizeExternalUrl(normalized) !== url) {
        return normalized;
      }
    }

    return normalizeReferenceLabel("", url);
  }

  function collectExternalReferencesFromValue(value, target, seenUrls, visited = new WeakSet()) {
    if (!value) return;

    if (Array.isArray(value)) {
      for (const item of value) {
        collectExternalReferencesFromValue(item, target, seenUrls, visited);
      }
      return;
    }

    if (typeof value !== "object") {
      return;
    }

    if (visited.has(value)) {
      return;
    }
    visited.add(value);

    const urlCandidates = [
      value.url,
      value.uri,
      value.href,
      value.link,
      value.source_url,
      value.sourceUrl,
      value.canonical_url,
      value.canonicalUrl
    ];

    for (const candidate of urlCandidates) {
      const url = normalizeExternalUrl(candidate);
      if (!url || seenUrls.has(url)) {
        continue;
      }

      seenUrls.add(url);
      target.push({
        url,
        label: pickReferenceLabel(value, url)
      });
    }

    for (const item of Object.values(value)) {
      if (item && typeof item === "object") {
        collectExternalReferencesFromValue(item, target, seenUrls, visited);
      }
    }
  }

  function getMessageExternalReferencesFromApi(message) {
    const references = [];
    const seenUrls = new Set();
    const visited = new WeakSet();

    collectExternalReferencesFromValue(message?.metadata, references, seenUrls, visited);
    collectExternalReferencesFromValue(message?.content, references, seenUrls, visited);

    return references;
  }

  function getDeepResearchRoot(doc = document) {
    if (!doc || typeof doc.querySelector !== "function") {
      return null;
    }

    return doc.querySelector(".deep-research-result");
  }

  function prefixMarkdownLines(text, prefix) {
    return String(text || "")
      .split("\n")
      .map((line) => line.trim() ? `${prefix}${line}` : prefix.trimEnd())
      .join("\n");
  }

  function normalizeMarkdownOutput(text) {
    return String(text || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function renderDeepResearchInline(node) {
    if (!node) {
      return "";
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return String(node.textContent || "").replace(/\s+/g, " ");
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node;
    const tagName = element.tagName.toLowerCase();
    if (element.matches("script, style, button, svg, textarea, input, noscript, template")) {
      return "";
    }
    if (element.getAttribute("aria-hidden") === "true") {
      return "";
    }

    if (tagName === "br") {
      return "\n";
    }

    if (tagName === "code" && element.parentElement?.tagName.toLowerCase() !== "pre") {
      const text = String(element.textContent || "").trim();
      return text ? `\`${text.replace(/`/g, "\\`")}\`` : "";
    }

    if (tagName === "strong" || tagName === "b") {
      const text = renderDeepResearchChildrenInline(element).trim();
      return text ? `**${text}**` : "";
    }

    if (tagName === "em" || tagName === "i") {
      const text = renderDeepResearchChildrenInline(element).trim();
      return text ? `*${text}*` : "";
    }

    if (tagName === "a") {
      const href = normalizeExternalUrl(element.getAttribute("href") || element.href);
      const label = renderDeepResearchChildrenInline(element).replace(/\s+/g, " ").trim();
      if (href) {
        return `[${escapeMarkdownLinkLabel(label || normalizeReferenceLabel("", href))}](${href})`;
      }
      return label;
    }

    if (tagName === "img") {
      const src = normalizeExternalUrl(element.getAttribute("src") || element.src);
      const alt = String(element.getAttribute("alt") || "").trim();
      return src ? `![${escapeMarkdownLinkLabel(alt)}](${src})` : "";
    }

    return renderDeepResearchChildrenInline(element);
  }

  function renderDeepResearchChildrenInline(element) {
    return Array.from(element.childNodes || [])
      .map((child) => renderDeepResearchInline(child))
      .join("")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ");
  }

  function renderDeepResearchListItem(element, prefix, depth = 0) {
    const nestedBlocks = [];
    const inlineNodes = [];

    for (const child of Array.from(element.childNodes || [])) {
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        ["ul", "ol"].includes(child.tagName.toLowerCase())
      ) {
        nestedBlocks.push(renderDeepResearchBlock(child, depth + 1).trim());
        continue;
      }
      inlineNodes.push(child);
    }

    const inlineText = inlineNodes
      .map((child) => renderDeepResearchInline(child))
      .join("")
      .replace(/\s+/g, " ")
      .trim();

    const indent = "  ".repeat(depth);
    const lines = inlineText ? [`${indent}${prefix} ${inlineText}`] : [];
    for (const block of nestedBlocks.filter(Boolean)) {
      lines.push(block);
    }
    return lines.join("\n");
  }

  function renderDeepResearchTable(element) {
    const rows = Array.from(element.querySelectorAll("tr"))
      .map((row) => Array.from(row.children || []).map((cell) => renderDeepResearchChildrenInline(cell).replace(/\s+/g, " ").trim()))
      .filter((row) => row.some(Boolean));

    if (!rows.length) {
      return "";
    }

    const header = rows[0];
    const separator = header.map(() => "---");
    const body = rows.slice(1);
    const lines = [
      `| ${header.join(" | ")} |`,
      `| ${separator.join(" | ")} |`
    ];

    for (const row of body) {
      const normalizedRow = [...row];
      while (normalizedRow.length < header.length) {
        normalizedRow.push("");
      }
      lines.push(`| ${normalizedRow.join(" | ")} |`);
    }

    return lines.join("\n");
  }

  function renderDeepResearchBlock(node, depth = 0) {
    if (!node) {
      return "";
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
      return text;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node;
    const tagName = element.tagName.toLowerCase();
    if (element.matches("script, style, button, svg, textarea, input, noscript, template")) {
      return "";
    }
    if (element.getAttribute("aria-hidden") === "true") {
      return "";
    }

    if (tagName === "pre") {
      const code = String(element.textContent || "").replace(/\n+$/g, "");
      return code ? `\`\`\`\n${code}\n\`\`\`` : "";
    }

    if (tagName === "blockquote") {
      const content = normalizeMarkdownOutput(renderDeepResearchChildrenBlock(element, depth));
      return content ? prefixMarkdownLines(content, "> ") : "";
    }

    if (tagName === "ul") {
      return Array.from(element.children || [])
        .filter((child) => child.tagName?.toLowerCase() === "li")
        .map((child) => renderDeepResearchListItem(child, "-", depth))
        .filter(Boolean)
        .join("\n");
    }

    if (tagName === "ol") {
      return Array.from(element.children || [])
        .filter((child) => child.tagName?.toLowerCase() === "li")
        .map((child, index) => renderDeepResearchListItem(child, `${index + 1}.`, depth))
        .filter(Boolean)
        .join("\n");
    }

    if (tagName === "table") {
      return renderDeepResearchTable(element);
    }

    if (/^h[1-6]$/.test(tagName)) {
      const level = Number(tagName.slice(1));
      const text = renderDeepResearchChildrenInline(element).replace(/\s+/g, " ").trim();
      return text ? `${"#".repeat(level)} ${text}` : "";
    }

    if (tagName === "p") {
      return renderDeepResearchChildrenInline(element)
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
    }

    if (tagName === "hr") {
      return "---";
    }

    if (tagName === "li") {
      return renderDeepResearchListItem(element, "-", depth);
    }

    if (["main", "article", "section", "header", "footer", "div"].includes(tagName)) {
      return renderDeepResearchChildrenBlock(element, depth);
    }

    const inlineText = renderDeepResearchChildrenInline(element).replace(/\s+/g, " ").trim();
    return inlineText;
  }

  function renderDeepResearchChildrenBlock(element, depth = 0) {
    return Array.from(element.childNodes || [])
      .map((child) => renderDeepResearchBlock(child, depth))
      .filter(Boolean)
      .join("\n\n");
  }

  function convertDeepResearchRootToMarkdown(root) {
    return normalizeMarkdownOutput(renderDeepResearchChildrenBlock(root));
  }

  function extractFirstMarkdownHeading(markdown) {
    const match = String(markdown || "").match(/^\s*#\s+(.+?)\s*$/m);
    return match ? match[1].trim() : "";
  }

  function stripLeadingMarkdownHeading(markdown) {
    return normalizeMarkdownOutput(String(markdown || "").replace(/^\s*#\s+.+?\n+/u, ""));
  }

  function isThoughtMarkerParagraph(text) {
    const normalized = normalizeParagraphKey(text);
    return /^Thought for\b/i.test(normalized) || /^思考/.test(normalized);
  }

  function isSourceHeadingParagraph(text) {
    const normalized = normalizeParagraphKey(text);
    return normalized.length <= 40 && /\bSources\b/i.test(normalized);
  }

  function isSourceChipParagraph(text) {
    const normalized = normalizeParagraphKey(text);
    return normalized.length <= 40 && /^[A-Za-z0-9\u00C0-\u024F\u4e00-\u9fff .&'’_-]+\s\+\d+$/.test(normalized);
  }

  function isSourceArtifactParagraph(text) {
    const normalized = normalizeParagraphKey(text);
    if (!normalized) return false;
    if (/^参考链接$/u.test(normalized)) return true;
    if (/^[-*]\s*\[[^\]]+]\(https?:\/\/[^)]+\)\s*$/i.test(normalized)) return true;

    const sourceLikeWords = normalized.match(/\b(?:Stanford Encyclopedia of Philosophy|Encyclopedia Britannica|Britannica|Wikipedia|Internet Archive|Sources?|History of Economic Thought|dokumen\.pub|JSTOR|Project Gutenberg|Gutenberg)\b/gi) || [];
    const plusCount = (normalized.match(/\+\d+/g) || []).length;
    const urlCount = (normalized.match(/https?:\/\//gi) || []).length;
    return plusCount >= 2 || urlCount >= 2 || (sourceLikeWords.length >= 2 && plusCount >= 1);
  }

  function isStructuredMarkdownLine(text) {
    const normalized = String(text || "").trimStart();
    if (!normalized) {
      return false;
    }

    return /^#{1,6}\s/.test(normalized) ||
      /^>\s?/.test(normalized) ||
      /^[-*+]\s/.test(normalized) ||
      /^\d+\.\s/.test(normalized) ||
      /^\|/.test(normalized) ||
      /^```/.test(normalized);
  }

  function cleanAssistantText(text) {
    const lines = String(text || "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(/[ \t]+$/g, ""));

    let startIndex = 0;
    for (let index = 0; index < lines.length; index += 1) {
      if (isThoughtMarkerParagraph(lines[index])) {
        startIndex = index + 1;
      }
    }

    const cleaned = [];
    let lastLineKey = "";
    let previousBlank = true;

    for (const line of lines.slice(startIndex)) {
      const normalized = normalizeParagraphKey(line);
      if (!normalized) {
        if (!previousBlank && cleaned.length) {
          cleaned.push("");
        }
        previousBlank = true;
        continue;
      }

      if (isThoughtMarkerParagraph(normalized)) continue;
      if (isSourceHeadingParagraph(normalized)) continue;
      if (isSourceChipParagraph(normalized)) continue;
      if (isSourceArtifactParagraph(normalized)) continue;

      const structuredLine = isStructuredMarkdownLine(line);
      if (!structuredLine && normalized === lastLineKey) {
        continue;
      }

      cleaned.push(line);
      lastLineKey = normalized;
      previousBlank = false;
    }

    while (cleaned.length && !cleaned[0].trim()) {
      cleaned.shift();
    }
    while (cleaned.length && !cleaned[cleaned.length - 1].trim()) {
      cleaned.pop();
    }

    return cleaned.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function stripMarkdownCodeBlocks(text) {
    return String(text || "")
      .replace(/\r\n?/g, "\n")
      .replace(/```[\s\S]*?```/g, "\n\n");
  }

  function stripInlineCodeMarkers(text) {
    return String(text || "").replace(/`([^`\n]+)`/g, "$1");
  }

  function isNonBodyArtifactParagraph(text) {
    const normalized = normalizeParagraphKey(text);
    if (!normalized) {
      return false;
    }

    return isThoughtMarkerParagraph(normalized) ||
      isSourceHeadingParagraph(normalized) ||
      isSourceChipParagraph(normalized) ||
      isSourceArtifactParagraph(normalized) ||
      /^参考链接$/u.test(normalized) ||
      /^Show\s*more(?:\s*Show\s*less)?$/i.test(normalized) ||
      /^Show\s*less$/i.test(normalized);
  }

  function stripMarkdownLinksForSignal(text) {
    return String(text || "")
      .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
      .replace(/\[[^\]]*]\(https?:\/\/[^)]+\)/gi, " ")
      .replace(/https?:\/\/[^\s)]+/gi, " ");
  }

  function isReferenceOnlyMarkdownLine(line) {
    const normalized = normalizeParagraphKey(line);
    if (!normalized) {
      return false;
    }
    if (/^参考链接$/u.test(normalized)) {
      return true;
    }

    const withoutLinks = stripMarkdownLinksForSignal(normalized)
      .replace(/^[-*]\s*/, "")
      .replace(/[()[\]\s,.;:，。；：、]+/g, "")
      .trim();
    return !withoutLinks;
  }

  function hasAssistantBodyText(text) {
    const bodyCandidate = String(text || "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .filter((line) => {
        const normalized = normalizeParagraphKey(line);
        return normalized &&
          !isNonBodyArtifactParagraph(normalized) &&
          !isReferenceOnlyMarkdownLine(normalized);
      })
      .join("\n");

    const signal = stripMarkdownLinksForSignal(bodyCandidate)
      .replace(/[`*_#>\-|()[\]{}.,;:!?，。！？、；：（）【】《》“”‘’·]/g, " ")
      .replace(/\s+/g, "");
    return signal.length >= 5 && /[\p{L}\p{N}]/u.test(signal);
  }

  function getShortAssistantReplyText(text, minSignalLength = 1) {
    const cleaned = cleanAssistantText(text);
    const signal = stripMarkdownLinksForSignal(cleaned)
      .replace(/[`*_#>\-|()[\]{}.,;:!?，。！？、；：（）【】《》“”‘’·]/g, " ")
      .replace(/\s+/g, "");
    if (signal.length < minSignalLength || !/[\p{L}\p{N}]/u.test(signal)) {
      return "";
    }
    return cleaned;
  }

  function formatExportReferenceLines(text, references) {
    const normalizedText = String(text || "").trim();
    const existingUrls = new Set(
      (normalizedText.match(/https?:\/\/[^\s)]+/g) || [])
        .map((item) => item.replace(/[)>.,;:!?]+$/g, ""))
    );
    const lines = [];
    const seenUrls = new Set();

    for (const reference of Array.isArray(references) ? references : []) {
      const url = normalizeExternalUrl(reference?.url);
      if (!url || existingUrls.has(url) || seenUrls.has(url)) {
        continue;
      }

      seenUrls.add(url);
      const label = escapeMarkdownLinkLabel(normalizeReferenceLabel(reference?.label, url));
      lines.push(`- [${label}](${url})`);
    }

    return lines;
  }

  function finalizeExportAssistantText(text, references = []) {
    const cleanedText = stripInlineCodeMarkers(cleanAssistantText(stripMarkdownCodeBlocks(text)));
    const lines = String(cleanedText || "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(/[ \t]+$/g, ""));
    const paragraphs = [];
    let currentParagraph = [];

    const flushParagraph = () => {
      if (!currentParagraph.length) {
        return;
      }

      const paragraphText = currentParagraph
        .join("\n")
        .replace(/Show\s*more/gi, "")
        .replace(/Show\s*less/gi, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      if (paragraphText && !isNonBodyArtifactParagraph(paragraphText)) {
        paragraphs.push(paragraphText);
      }
      currentParagraph = [];
    };

    for (const line of lines) {
      const normalizedLine = normalizeParagraphKey(
        String(line || "")
          .replace(/Show\s*more/gi, "")
          .replace(/Show\s*less/gi, "")
      );

      if (!normalizedLine) {
        flushParagraph();
        continue;
      }

      if (isNonBodyArtifactParagraph(normalizedLine)) {
        flushParagraph();
        continue;
      }

      currentParagraph.push(line);
    }

    flushParagraph();

    const cleanedParagraphs = [];
    let lastParagraphKey = "";
    for (const paragraph of paragraphs) {
      const paragraphKey = normalizeParagraphKey(paragraph);
      if (!paragraphKey || paragraphKey === lastParagraphKey) {
        continue;
      }

      cleanedParagraphs.push(paragraph);
      lastParagraphKey = paragraphKey;
    }

    const body = cleanedParagraphs.join("\n\n").trim();
    if (!hasAssistantBodyText(body)) {
      return "";
    }

    const referenceLines = formatExportReferenceLines(body, references);
    if (!referenceLines.length) {
      return body;
    }

    return body
      ? `${body}\n\n${referenceLines.join("\n")}`
      : referenceLines.join("\n");
  }

  function finalizeAssistantText(text, references = []) {
    const cleanedText = cleanAssistantText(text);
    if (!hasAssistantBodyText(cleanedText)) {
      return "";
    }
    return appendExternalReferences(cleanedText, references);
  }

  function formatCitationLinks(urls) {
    const normalizedUrls = Array.from(new Set(
      (Array.isArray(urls) ? urls : [])
        .map((url) => normalizeExternalUrl(url))
        .filter(Boolean)
    ));

    return normalizedUrls
      .map((url) => `([${escapeMarkdownLinkLabel(normalizeReferenceLabel("", url))}](${url}))`)
      .join("");
  }

  function renderVisibleMarkdownChildren(node) {
    return Array.from(node.childNodes || [])
      .map((child) => renderVisibleMarkdownNode(child))
      .join("");
  }

  function renderVisibleMarkdownList(node, ordered = false, depth = 0) {
    const items = Array.from(node.children || []).filter((child) => child.tagName?.toLowerCase() === "li");
    return items.map((child, index) => renderVisibleMarkdownListItem(child, ordered ? `${index + 1}.` : "-", depth)).join("\n");
  }

  function renderVisibleMarkdownListItem(node, marker, depth = 0) {
    const inlineNodes = [];
    const nestedBlocks = [];
    for (const child of Array.from(node.childNodes || [])) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        if (tagName === "ul" || tagName === "ol") {
          nestedBlocks.push(renderVisibleMarkdownNode(child, depth + 1).trim());
          continue;
        }
      }
      inlineNodes.push(child);
    }

    const indent = "  ".repeat(depth);
    const inlineText = inlineNodes
      .map((child) => renderVisibleMarkdownNode(child, depth))
      .join("")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    const lines = inlineText ? [`${indent}${marker} ${inlineText}`] : [];
    for (const block of nestedBlocks.filter(Boolean)) {
      lines.push(block);
    }
    return lines.join("\n");
  }

  function renderVisibleMarkdownTable(node) {
    const rows = Array.from(node.querySelectorAll("tr"))
      .map((row) => Array.from(row.children || []).map((cell) => renderVisibleMarkdownChildren(cell).replace(/\s+/g, " ").trim()))
      .filter((row) => row.some(Boolean));

    if (!rows.length) {
      return "";
    }

    const header = rows[0];
    const separator = header.map(() => "---");
    const lines = [
      `| ${header.join(" | ")} |`,
      `| ${separator.join(" | ")} |`
    ];

    for (const row of rows.slice(1)) {
      const normalizedRow = [...row];
      while (normalizedRow.length < header.length) {
        normalizedRow.push("");
      }
      lines.push(`| ${normalizedRow.join(" | ")} |`);
    }

    return lines.join("\n");
  }

  function renderVisibleMarkdownNode(node, depth = 0) {
    if (!node) {
      return "";
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return String(node.textContent || "");
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node;
    const tagName = element.tagName.toLowerCase();
    if (element.matches("script, style, button, svg, textarea, input, noscript, template")) {
      return "";
    }
    if (element.getAttribute("aria-hidden") === "true") {
      return "";
    }

    if (tagName === "span" && element.getAttribute("data-state") === "closed") {
      const urls = Array.from(element.querySelectorAll("a[href]"))
        .map((anchor) => anchor.getAttribute("href") || anchor.href);
      return formatCitationLinks(urls);
    }

    if (tagName === "a") {
      if (element.closest('span[data-state="closed"]')) {
        return "";
      }

      const href = normalizeExternalUrl(element.getAttribute("href") || element.href);
      const label = renderVisibleMarkdownChildren(element).replace(/\s+/g, " ").trim();
      if (!href) {
        return label;
      }

      const isCitationAnchor = element.parentElement?.tagName.toLowerCase() === "sup" && /^\d+$/.test(label);
      if (isCitationAnchor) {
        return formatCitationLinks([href]);
      }

      return `[${escapeMarkdownLinkLabel(label || normalizeReferenceLabel("", href))}](${href})`;
    }

    if (tagName === "br") {
      return "\n";
    }

    if (tagName === "strong" || tagName === "b") {
      const text = renderVisibleMarkdownChildren(element).trim();
      return text ? `**${text}**` : "";
    }

    if (tagName === "em" || tagName === "i") {
      const text = renderVisibleMarkdownChildren(element).trim();
      return text ? `*${text}*` : "";
    }

    if (tagName === "code" && element.parentElement?.tagName.toLowerCase() !== "pre") {
      const text = String(element.textContent || "").trim();
      return text ? `\`${text.replace(/`/g, "\\`")}\`` : "";
    }

    if (tagName === "pre") {
      const code = String(element.textContent || "").replace(/\n+$/g, "");
      return code ? `\`\`\`\n${code}\n\`\`\`` : "";
    }

    if (/^h[1-6]$/.test(tagName)) {
      const level = Number(tagName.slice(1));
      const text = renderVisibleMarkdownChildren(element).replace(/\s+/g, " ").trim();
      return text ? `${"#".repeat(level)} ${text}\n\n` : "";
    }

    if (tagName === "p") {
      const text = renderVisibleMarkdownChildren(element)
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
      return text ? `${text}\n\n` : "";
    }

    if (tagName === "blockquote") {
      const content = normalizeMarkdownOutput(renderVisibleMarkdownChildren(element));
      return content ? `${prefixMarkdownLines(content, "> ")}\n\n` : "";
    }

    if (tagName === "ul") {
      const text = renderVisibleMarkdownList(element, false, depth);
      return text ? `${text}\n\n` : "";
    }

    if (tagName === "ol") {
      const text = renderVisibleMarkdownList(element, true, depth);
      return text ? `${text}\n\n` : "";
    }

    if (tagName === "table") {
      const text = renderVisibleMarkdownTable(element);
      return text ? `${text}\n\n` : "";
    }

    if (tagName === "hr") {
      return "\n---\n\n";
    }

    if (tagName === "img") {
      const src = normalizeExternalUrl(element.getAttribute("src") || element.src);
      const alt = String(element.getAttribute("alt") || "").trim();
      return src ? `![${escapeMarkdownLinkLabel(alt)}](${src})` : "";
    }

    if (tagName === "li") {
      return renderVisibleMarkdownListItem(element, "-", depth);
    }

    return renderVisibleMarkdownChildren(element);
  }

  function convertVisibleMarkdownElementToMarkdown(element) {
    return normalizeMarkdownOutput(renderVisibleMarkdownNode(element));
  }

  function getPreferredNodeText(element, selector, transform) {
    if (!element) {
      return "";
    }

    const blocks = [];
    const seen = new Set();
    for (const node of Array.from(element.querySelectorAll(selector))) {
      const text = typeof transform === "function" ? transform(node) : getTextFromNode(node);
      const normalized = String(text || "").trim();
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      blocks.push(normalized);
    }

    return blocks.join("\n\n").trim();
  }

  function getPreferredAssistantMarkdownText(element) {
    if (!element) {
      return "";
    }

    const blocks = [];
    const seen = new Set();
    for (const node of Array.from(element.querySelectorAll("div.markdown"))) {
      const text = convertVisibleMarkdownElementToMarkdown(node);
      const normalized = String(text || "").trim();
      if (!normalized || seen.has(normalized) || !hasAssistantBodyText(normalized)) {
        continue;
      }
      seen.add(normalized);
      blocks.push(normalized);
    }

    return blocks.join("\n\n").trim();
  }

  function getAssistantText(element) {
    if (!element) return "";
    const markdownText = getPreferredAssistantMarkdownText(element);
    const fallbackText = getTextFromNode(element);
    const references = collectExternalReferencesFromElement(element);
    return finalizeAssistantText(markdownText || fallbackText, references);
  }

  function getUserText(element) {
    const text = getPreferredNodeText(element, ".whitespace-pre-wrap", (node) => getTextFromNode(node)) ||
      getTextFromNode(element);
    return String(text || "")
      .replace(/Show\s*more/gi, "")
      .replace(/Show\s*less/gi, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function normalizeMessageKey(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getAssistantMessages() {
    const byRole = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
    if (byRole.length) {
      return byRole.filter((element) => getTextFromNode(element));
    }

    const articles = Array.from(document.querySelectorAll("article"));
    return articles.filter((element) => {
      const label = [
        element.getAttribute("aria-label") || "",
        element.getAttribute("data-testid") || ""
      ].join(" ");
      if (/assistant|chatgpt/i.test(label)) return true;

      const hasCopyButton = Array.from(element.querySelectorAll("button")).some((button) => {
        const text = [
          button.getAttribute("aria-label") || "",
          button.textContent || ""
        ].join(" ");
        return /copy|复制/i.test(text);
      });

      return hasCopyButton && Boolean(getTextFromNode(element));
    });
  }

  function getAssistantSnapshot() {
    const messages = getAssistantMessages();
    const latestMessage = messages[messages.length - 1] || null;
    const key = latestMessage
      ? (
        latestMessage.getAttribute("data-message-id") ||
        latestMessage.getAttribute("data-testid") ||
        latestMessage.getAttribute("aria-label") ||
        latestMessage.id ||
        ""
      )
      : "";
    return {
      count: messages.length,
      key,
      text: getAssistantText(latestMessage),
      rawText: getTextFromNode(latestMessage)
    };
  }

  function getUserMessages() {
    const byRole = Array.from(document.querySelectorAll('[data-message-author-role="user"]'));
    if (byRole.length) {
      return byRole.filter((element) => getUserText(element));
    }

    const articles = Array.from(document.querySelectorAll("article"));
    return articles.filter((element) => {
      const label = [
        element.getAttribute("aria-label") || "",
        element.getAttribute("data-testid") || ""
      ].join(" ");
      return /user/i.test(label) && Boolean(getUserText(element));
    });
  }

  function getConversationMessages() {
    const turnArticles = Array.from(document.querySelectorAll('article[data-testid^="conversation-turn"]'));
    if (turnArticles.length) {
      return turnArticles
        .map((element, index) => {
          const roleElement = element.querySelector("[data-message-author-role]");
          const label = [
            roleElement?.getAttribute("data-message-author-role") || "",
            element.getAttribute("aria-label") || "",
            element.getAttribute("data-testid") || ""
          ].join(" ");
          const role = /user/i.test(label)
            ? "user"
            : /assistant|chatgpt/i.test(label)
              ? "assistant"
              : "";
          if (!role) return null;
          const targetElement = roleElement || element;
          const text = role === "assistant" ? getAssistantText(targetElement) : getUserText(targetElement);
          if (!text) return null;
          const key = (
            targetElement.getAttribute("data-message-id") ||
            element.getAttribute("data-testid") ||
            `${role}:${index}:${normalizeMessageKey(text)}`
          );
          return { role, text, key };
        })
        .filter(Boolean);
    }

    const roleElements = Array.from(document.querySelectorAll('[data-message-author-role]'));
    if (roleElements.length) {
      return roleElements
        .map((element) => {
          const role = element.getAttribute("data-message-author-role");
          if (role !== "user" && role !== "assistant") return null;
          const text = role === "assistant" ? getAssistantText(element) : getUserText(element);
          if (!text) return null;
          const key = (
            element.getAttribute("data-message-id") ||
            element.id ||
            element.getAttribute("data-testid") ||
            `${role}:${normalizeMessageKey(text)}`
          );
          return { role, text, key };
        })
        .filter(Boolean);
    }

    const articles = Array.from(document.querySelectorAll("article"));
    return articles
      .map((element) => {
        const label = [
          element.getAttribute("aria-label") || "",
          element.getAttribute("data-testid") || ""
        ].join(" ");
        const text = getUserText(element);
        if (!text) return null;
        if (/user/i.test(label)) {
          return { role: "user", text, key: `user:${normalizeMessageKey(text)}` };
        }
        if (/assistant|chatgpt/i.test(label)) {
          const assistantText = getAssistantText(element) || text;
          return {
            role: "assistant",
            text: assistantText,
            key: `assistant:${normalizeMessageKey(assistantText)}`
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  function getConversationScrollContainer() {
    const anchors = Array.from(document.querySelectorAll('[data-message-author-role], article'));
    for (const anchor of anchors) {
      let current = anchor.parentElement;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const overflowY = style ? style.overflowY : "";
        const canScroll = /(auto|scroll)/i.test(overflowY) && current.scrollHeight > current.clientHeight + 120;
        if (canScroll) {
          return current;
        }
        current = current.parentElement;
      }
    }

    const scrollingElement = document.scrollingElement || document.documentElement;
    if (scrollingElement && scrollingElement.scrollHeight > scrollingElement.clientHeight + 120) {
      return scrollingElement;
    }

    return null;
  }

  async function waitForConversationDomStable(previousCount = 0, exportId = "") {
    let stableRounds = 0;
    let lastCount = previousCount;
    let lastHeight = -1;

    for (let round = 0; round < 18; round += 1) {
      throwIfChatExportStopped(exportId);
      await sleep(180);
      const count = getConversationMessages().length;
      const scrollContainer = getConversationScrollContainer();
      const height = scrollContainer ? scrollContainer.scrollHeight : 0;

      if (count === lastCount && height === lastHeight) {
        stableRounds += 1;
        if (stableRounds >= 2) return count;
      } else {
        stableRounds = 0;
        lastCount = count;
        lastHeight = height;
      }
    }

    return getConversationMessages().length;
  }

  async function scrollConversationToTop(container, exportId = "") {
    if (!container) return;
    let lastHeight = -1;
    let stableRounds = 0;

    for (let round = 0; round < 18; round += 1) {
      throwIfChatExportStopped(exportId);
      scrollContainerTo(container, 0);
      await waitForConversationDomStable(0, exportId);

      const currentHeight = container.scrollHeight;
      if (Math.abs(currentHeight - lastHeight) < 4) {
        stableRounds += 1;
        if (stableRounds >= 2) return;
      } else {
        stableRounds = 0;
      }

      lastHeight = currentHeight;
    }

    scrollContainerTo(container, 0);
    await waitForConversationDomStable(0, exportId);
  }

  function collectConversationMessages(targetMap) {
    for (const message of getConversationMessages()) {
      if (!message.key || targetMap.has(message.key)) continue;
      targetMap.set(message.key, {
        role: message.role,
        text: message.text
      });
    }
  }

  async function reportChatExportProgress(exportId, patch) {
    if (!exportId) return;
    if (shouldStopChatExport(exportId)) return;
    await sendRuntimeMessage("CHAT_EXPORT_PROGRESS", {
      exportId,
      ...(patch || {})
    });
  }

  function setScrollBehaviorInstant(container) {
    if (!container) {
      return () => {};
    }

    const previousContainerBehavior = container.style.scrollBehavior;
    const documentElement = document.documentElement;
    const bodyElement = document.body;
    const previousDocumentBehavior = documentElement ? documentElement.style.scrollBehavior : "";
    const previousBodyBehavior = bodyElement ? bodyElement.style.scrollBehavior : "";

    container.style.scrollBehavior = "auto";
    if (documentElement) {
      documentElement.style.scrollBehavior = "auto";
    }
    if (bodyElement) {
      bodyElement.style.scrollBehavior = "auto";
    }

    return () => {
      container.style.scrollBehavior = previousContainerBehavior;
      if (documentElement) {
        documentElement.style.scrollBehavior = previousDocumentBehavior;
      }
      if (bodyElement) {
        bodyElement.style.scrollBehavior = previousBodyBehavior;
      }
    };
  }

  function scrollContainerTo(container, top) {
    if (!container) return;

    const targetTop = Math.max(0, Number(top) || 0);
    if (container === document.scrollingElement || container === document.documentElement || container === document.body) {
      window.scrollTo(0, targetTop);
      if (document.documentElement) {
        document.documentElement.scrollTop = targetTop;
      }
      if (document.body) {
        document.body.scrollTop = targetTop;
      }
    } else if (typeof container.scrollTo === "function") {
      container.scrollTo(0, targetTop);
    } else {
      container.scrollTop = targetTop;
    }

    container.dispatchEvent(new Event("scroll"));
  }

  function getConversationIdFromLocation() {
    const match = String(window.location.pathname || "").match(/^\/(?:share|c|g\/[a-z0-9-]+\/c)\/([a-z0-9-]+)/i);
    return match ? match[1] : "";
  }

  function isShareConversationPage() {
    return /^\/share\//i.test(String(window.location.pathname || "")) &&
      !/\/continue$/i.test(String(window.location.pathname || ""));
  }

  function getSharedConversationData() {
    try {
      if (window.__NEXT_DATA__?.props?.pageProps?.serverResponse?.data) {
        return JSON.parse(JSON.stringify(window.__NEXT_DATA__.props.pageProps.serverResponse.data));
      }
      const remixData = window.__remixContext?.state?.loaderData?.["routes/share.$shareId.($action)"]?.serverResponse?.data;
      if (remixData) {
        return JSON.parse(JSON.stringify(remixData));
      }
    } catch {}
    return null;
  }

  function getApiBaseUrl() {
    return `${window.location.origin.replace(/\/$/, "")}/backend-api`;
  }

  function getSessionApiUrl() {
    return `${window.location.origin.replace(/\/$/, "")}/api/auth/session`;
  }

  function getAccountsCheckApiUrl() {
    return `${getApiBaseUrl()}/accounts/check/v4-2023-04-27`;
  }

  function getPageAccessToken() {
    return window.__remixContext?.state?.loaderData?.root?.clientBootstrap?.session?.accessToken || null;
  }

  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : "";
  }

  let cachedAccessTokenPromise = null;
  let cachedAccountIdPromise = null;

  async function getAccessToken() {
    const pageAccessToken = getPageAccessToken();
    if (pageAccessToken) {
      return pageAccessToken;
    }

    if (!cachedAccessTokenPromise) {
      cachedAccessTokenPromise = fetch(getSessionApiUrl(), { credentials: "include" })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`读取会话令牌失败：${response.status}`);
          }
          const session = await response.json();
          return session?.accessToken || "";
        })
        .finally(() => {
          cachedAccessTokenPromise = null;
        });
    }

    return cachedAccessTokenPromise;
  }

  async function getWorkspaceAccountId() {
    const workspaceId = getCookieValue("_account");
    if (!workspaceId) {
      return null;
    }

    if (!cachedAccountIdPromise) {
      cachedAccountIdPromise = (async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return null;
        }

        const response = await fetch(getAccountsCheckApiUrl(), {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Authorization": `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error(`读取工作区信息失败：${response.status}`);
        }

        const data = await response.json();
        return data?.accounts?.[workspaceId]?.account?.account_id || null;
      })().finally(() => {
        cachedAccountIdPromise = null;
      });
    }

    return cachedAccountIdPromise;
  }

  function extractTextSegments(value, target) {
    if (!value) return;

    if (typeof value === "string") {
      const text = value.trim();
      if (text) target.push(text);
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        extractTextSegments(item, target);
      }
      return;
    }

    if (typeof value !== "object") return;

    if (typeof value.text === "string") {
      extractTextSegments(value.text, target);
    }
    if (Array.isArray(value.parts)) {
      extractTextSegments(value.parts, target);
    }
    if (Array.isArray(value.text_segments)) {
      extractTextSegments(value.text_segments, target);
    }
    if (value.result) {
      extractTextSegments(value.result, target);
    }
    if (value.content) {
      extractTextSegments(value.content, target);
    }
  }

  function getMessageTextFromApi(message) {
    const parts = [];
    extractTextSegments(message?.content, parts);
    const text = parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
    return message?.author?.role === "assistant"
      ? text
      : text.replace(/Show\s*more/gi, "").replace(/Show\s*less/gi, "").trim();
  }

  function buildConversationPath(mapping, startNodeId) {
    const path = [];
    const visited = new Set();
    let nodeId = startNodeId;

    while (nodeId && mapping[nodeId] && !visited.has(nodeId)) {
      const node = mapping[nodeId];
      visited.add(nodeId);
      if (node.parent === undefined) {
        break;
      }
      path.unshift(node);
      nodeId = node.parent || "";
    }

    return path;
  }

  function isExportableConversationNode(node) {
    const role = node?.message?.author?.role;
    if (role !== "user" && role !== "assistant") {
      return false;
    }

    const contentType = node?.message?.content?.content_type || "";
    if (contentType === "model_editable_context" || contentType === "user_editable_context") {
      return false;
    }

    return true;
  }

  function buildMessagesFromApiPath(path, exportId) {
    const messages = [];

    for (const node of path) {
      throwIfChatExportStopped(exportId);
      if (!isExportableConversationNode(node)) {
        continue;
      }

      const message = node.message;
      const role = message.author.role;
      const text = role === "assistant"
        ? finalizeExportAssistantText(getMessageTextFromApi(message), getMessageExternalReferencesFromApi(message))
        : getMessageTextFromApi(message);
      if (!text) continue;

      messages.push({
        role,
        text,
        key: message?.id || `${role}:${normalizeMessageKey(text)}`
      });
    }

    return messages;
  }

  function mergeContinuationMessages(messages) {
    const merged = [];

    for (const message of messages) {
      const previousMessage = merged[merged.length - 1];
      if (previousMessage?.role === "assistant" && message.role === "assistant") {
        const mergedText = finalizeExportAssistantText(`${previousMessage.text}\n\n${message.text}`);
        if (mergedText) {
          previousMessage.text = mergedText;
          previousMessage.key = `${previousMessage.key}|${message.key}`;
        }
        continue;
      }

      merged.push({ ...message });
    }

    return merged;
  }

  async function getFullConversationMessagesFromApi(exportId) {
    const conversationId = getConversationIdFromLocation();
    if (!conversationId) return [];
    throwIfChatExportStopped(exportId);

    await reportChatExportProgress(exportId, {
      message: "正在读取完整对话……",
      logMessage: "开始读取完整对话数据。"
    });

    const abortController = new AbortController();
    currentExportAbortController = abortController;
    try {
      let data = null;

      if (isShareConversationPage()) {
        data = getSharedConversationData();
      } else {
        const accessToken = await getAccessToken();
        const accountId = await getWorkspaceAccountId();
        const response = await fetch(`${getApiBaseUrl()}/conversation/${conversationId}`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            ...(accessToken
              ? {
                Authorization: `Bearer ${accessToken}`,
                "X-Authorization": `Bearer ${accessToken}`
              }
              : {}),
            ...(accountId
              ? {
                "Chatgpt-Account-Id": accountId
              }
              : {})
          },
          signal: abortController.signal
        });
        if (!response.ok) {
          throw new Error(`读取完整对话失败：${response.status}`);
        }

        data = await response.json();
      }

      const mapping = data && typeof data.mapping === "object" ? data.mapping : null;
      const currentNode = typeof data?.current_node === "string" ? data.current_node : "";
      if (!mapping) {
        return [];
      }

      const startNodeId = (currentNode && mapping[currentNode] ? currentNode : "") || Object.values(mapping).find((node) => {
        const children = Array.isArray(node?.children) ? node.children : [];
        return children.length === 0;
      })?.id || "";
      if (!startNodeId) {
        return [];
      }

      const path = buildConversationPath(mapping, startNodeId);
      const messages = mergeContinuationMessages(buildMessagesFromApiPath(path, exportId));

      if (messages.length) {
        await reportChatExportProgress(exportId, {
          message: `完整对话已读取，共 ${messages.length} 条消息，正在整理问答……`,
          logMessage: `完整对话接口已读取，共 ${messages.length} 条消息。`
        });
      }

      return messages;
    } finally {
      if (currentExportAbortController === abortController) {
        currentExportAbortController = null;
      }
    }
  }

  async function getFullConversationMessages(exportId) {
    const ready = await until(() => getConversationMessages().length > 0, 10000, 150);
    if (!ready) return [];
    throwIfChatExportStopped(exportId);

    const container = getConversationScrollContainer();
    if (!container) {
      return getConversationMessages().map((message) => ({
        role: message.role,
        text: message.text
      }));
    }

    const messages = new Map();

    await reportChatExportProgress(exportId, {
      message: "正在从顶部向下完整读取历史消息……",
      logMessage: "已开始页面完整滚动读取。"
    });
    const restoreScrollBehavior = setScrollBehaviorInstant(container);

    try {
      await scrollConversationToTop(container, exportId);
      collectConversationMessages(messages);

      let stagnantRounds = 0;
      let lastScrollTop = -1;

      for (let round = 0; round < 360; round += 1) {
        throwIfChatExportStopped(exportId);
        collectConversationMessages(messages);
        if (round % 4 === 0) {
          await reportChatExportProgress(exportId, {
            message: `正在从顶部向下完整读取历史消息，已收集 ${messages.size} 条消息……`
          });
        }

        const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
        if (container.scrollTop >= maxTop - 4) {
          break;
        }

        const step = Math.max(Math.floor(container.clientHeight * 0.2), 180);
        const nextTop = Math.min(maxTop, container.scrollTop + step);
        if (Math.abs(nextTop - container.scrollTop) < 4) {
          stagnantRounds += 1;
          if (stagnantRounds >= 8) break;
        } else {
          stagnantRounds = 0;
        }

        lastScrollTop = container.scrollTop;
        scrollContainerTo(container, nextTop);
        await waitForConversationDomStable(messages.size, exportId);

        if (Math.abs(container.scrollTop - lastScrollTop) < 4) {
          stagnantRounds += 1;
          if (stagnantRounds >= 8) break;
        }
      }

      collectConversationMessages(messages);
      scrollContainerTo(container, Math.max(0, container.scrollHeight - container.clientHeight));
      await waitForConversationDomStable(messages.size, exportId);
      collectConversationMessages(messages);
    } finally {
      restoreScrollBehavior();
    }

    const result = Array.from(messages.values());
    if (result.length) {
      await reportChatExportProgress(exportId, {
        message: `页面完整滚动已读取，共 ${result.length} 条消息，正在整理问答……`
      });
    }
    return result;
  }

  function buildConversationPairs(messages) {
    const pairs = [];
    let pendingQuestion = "";
    let pendingAnswerParts = [];

    for (const message of messages) {
      if (message.role === "user") {
        if (pendingQuestion && pendingAnswerParts.length) {
          pairs.push({
            question: pendingQuestion,
            answer: pendingAnswerParts.join("\n\n").trim()
          });
        }
        pendingQuestion = message.text;
        pendingAnswerParts = [];
        continue;
      }

      if (message.role === "assistant" && pendingQuestion) {
        const normalized = normalizeParagraphKey(message.text);
        const lastPart = pendingAnswerParts.length
          ? normalizeParagraphKey(pendingAnswerParts[pendingAnswerParts.length - 1])
          : "";
        if (normalized && normalized !== lastPart) {
          pendingAnswerParts.push(message.text);
        }
      }
    }

    if (pendingQuestion && pendingAnswerParts.length) {
      pairs.push({
        question: pendingQuestion,
        answer: pendingAnswerParts.join("\n\n").trim()
      });
    }

    return pairs.filter((pair) => pair.question && pair.answer);
  }

  function summarizeConversationCounts(messages, pairs) {
    const userCount = messages.filter((message) => message.role === "user").length;
    const assistantCount = messages.filter((message) => message.role === "assistant").length;
    return {
      userCount,
      assistantCount,
      pairCount: Array.isArray(pairs) ? pairs.length : 0
    };
  }

  async function reportConversationSummary(exportId, messages, pairs, sourceLabel) {
    const summary = summarizeConversationCounts(messages, pairs);
    await reportChatExportProgress(exportId, {
      logMessage: `${sourceLabel}共读取 ${messages.length} 条消息，其中用户 ${summary.userCount} 条，助手 ${summary.assistantCount} 条，整理出 ${summary.pairCount} 组问答。`
    });
  }

  async function finalizeConversationPairs(exportId, messages, sourceLabel) {
    const pairs = buildConversationPairs(messages);
    if (pairs.length) {
      await reportConversationSummary(exportId, messages, pairs, sourceLabel);
    }
    return pairs;
  }

  async function buildConversationResult(exportId, messages, sourceLabel) {
    const pairs = await finalizeConversationPairs(exportId, messages, sourceLabel);
    if (!pairs.length) {
      return {
        ok: false,
        error: "当前对话没有可导出的问答内容。",
        sourceLabel,
        messageCount: messages.length,
        pairCount: 0
      };
    }

    return {
      ok: true,
      pairs,
      terms: pairs.map((pair) => pair.question).filter(Boolean),
      sourceLabel,
      messageCount: messages.length,
      pairCount: pairs.length
    };
  }

  async function buildConversationResultWithLogs(exportId, messages, sourceLabel) {
    return buildConversationResult(exportId, messages, sourceLabel);
  }

  function getLastVisibleUserText() {
    const messages = getUserMessages();
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const text = getUserText(messages[index]);
      if (text) {
        return text;
      }
    }
    return "";
  }

  async function requestDeepResearchMarkdownFromIframe(iframe, exportId) {
    if (!iframe?.contentWindow) {
      return null;
    }

    throwIfChatExportStopped(exportId);
    const requestId = crypto.randomUUID();
    return new Promise((resolve) => {
      let settled = false;
      const cleanup = () => {
        settled = true;
        window.removeEventListener("message", handleMessage);
        clearTimeout(timeoutId);
      };
      const finish = (value) => {
        if (settled) {
          return;
        }
        cleanup();
        resolve(value);
      };
      const handleMessage = (event) => {
        if (event.source !== iframe.contentWindow) {
          return;
        }

        const data = event.data;
        if (!data || data.type !== DEEP_RESEARCH_EXPORT_RESPONSE || data.requestId !== requestId) {
          return;
        }

        finish({
          markdown: typeof data.markdown === "string" ? data.markdown : "",
          title: typeof data.title === "string" ? data.title : ""
        });
      };

      const timeoutId = window.setTimeout(() => finish(null), 8000);
      window.addEventListener("message", handleMessage);
      iframe.contentWindow.postMessage({
        type: DEEP_RESEARCH_EXPORT_REQUEST,
        requestId
      }, "*");
    });
  }

  async function getDeepResearchConversationResult(exportId) {
    const directRoot = getDeepResearchRoot(document);
    let markdown = "";
    let title = "";

    if (directRoot) {
      markdown = convertDeepResearchRootToMarkdown(directRoot);
      title = extractFirstMarkdownHeading(markdown);
    } else {
      const iframe = document.querySelector(DEEP_RESEARCH_IFRAME_SELECTOR);
      if (!iframe) {
        return null;
      }

      await reportChatExportProgress(exportId, {
        message: "正在读取 Deep Research 正文……",
        logMessage: "已检测到 Deep Research 页面，正在读取正文。"
      });

      const iframeResult = await requestDeepResearchMarkdownFromIframe(iframe, exportId);
      markdown = iframeResult?.markdown || "";
      title = iframeResult?.title || "";
    }

    markdown = normalizeMarkdownOutput(markdown);
    if (!markdown) {
      return null;
    }

    const heading = title || extractFirstMarkdownHeading(markdown);
    const question = heading || getLastVisibleUserText() || "Deep Research";
    const answer = heading ? stripLeadingMarkdownHeading(markdown) : markdown;

    if (!answer) {
      return null;
    }

    const result = {
      ok: true,
      pairs: [
        {
          question,
          answer
        }
      ],
      terms: [question],
      sourceLabel: "Deep Research 正文",
      messageCount: 2,
      pairCount: 1
    };

    await reportChatExportProgress(exportId, {
      message: "Deep Research 正文已提取，正在保存……",
      logMessage: "已采用 Deep Research 正文导出。"
    });

    return result;
  }

  async function handleExportCurrentConversation(payload) {
    const exportId = typeof payload?.exportId === "string" ? payload.exportId : "";
    let apiMessages = [];

    try {
      const deepResearchResult = await getDeepResearchConversationResult(exportId);
      if (deepResearchResult?.ok) {
        return deepResearchResult;
      }
    } catch (error) {
      if (isChatExportStoppedError(error)) {
        return { ok: false, stopped: true, error: "对话导出已停止。" };
      }
      await reportChatExportProgress(exportId, {
        logMessage: `Deep Research 正文读取失败：${error && error.message ? error.message : String(error)}`
      });
    }

    try {
      apiMessages = await getFullConversationMessagesFromApi(exportId);
    } catch (error) {
      if (isChatExportStoppedError(error)) {
        return { ok: false, stopped: true, error: "对话导出已停止。" };
      }
      await reportChatExportProgress(exportId, {
        logMessage: `完整对话接口读取失败：${error && error.message ? error.message : String(error)}`
      });
      apiMessages = [];
    }

    if (!apiMessages.length) {
      return { ok: false, error: "当前对话没有可读取的消息内容。" };
    }

    const result = await buildConversationResultWithLogs(exportId, apiMessages, "完整对话接口");
    if (result.ok) {
      await reportChatExportProgress(exportId, {
        message: `完整对话接口已整理出 ${result.pairCount} 组问答，正在保存……`,
        logMessage: `问答整理结果：完整对话接口 ${result.pairCount} 组问答/${result.messageCount} 条消息。已采用完整对话接口。`
      });
    }
    return result;
  }

  function getButtonLabel(button) {
    const ownLabels = [
      button.getAttribute("aria-label") || "",
      button.getAttribute("title") || "",
      button.getAttribute("data-testid") || "",
      button.textContent || ""
    ];
    const childLabels = Array.from(button.querySelectorAll("[aria-label], [title], [data-testid]"))
      .flatMap((element) => [
        element.getAttribute("aria-label") || "",
        element.getAttribute("title") || "",
        element.getAttribute("data-testid") || ""
      ]);
    return ownLabels.concat(childLabels).join(" ").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function hasStopIcon(button) {
    if (!button) return false;
    if (button.querySelector("svg rect")) return true;
    const pathText = Array.from(button.querySelectorAll("svg path"))
      .map((path) => path.getAttribute("d") || "")
      .join(" ");
    return /h\s*1[0-9](?:\.\d+)?\s*v\s*1[0-9](?:\.\d+)?/i.test(pathText) ||
      /v\s*1[0-9](?:\.\d+)?\s*h\s*-1[0-9](?:\.\d+)?/i.test(pathText);
  }

  function isComposerSubmitButton(button) {
    if (!button) return false;
    const label = getButtonLabel(button);
    const testId = String(button.getAttribute("data-testid") || "").toLowerCase();
    const id = String(button.id || "").toLowerCase();
    const type = String(button.getAttribute("type") || "").toLowerCase();
    return id === "composer-submit-button" ||
      type === "submit" ||
      testId.includes("send") ||
      testId.includes("submit") ||
      label.includes("send") ||
      label.includes("发送");
  }

  function hasEmptyComposerNearButton(button) {
    const form = button?.closest?.("form");
    const editor = form
      ? findVisibleComposerInRoot(form)
      : findVisibleComposer();
    return Boolean(editor && !getEditorValue(editor.element).trim());
  }

  function isStreamingStopButton(button) {
    if (!button || !isElementVisible(button) || button.disabled) return false;
    const label = getButtonLabel(button);
    const testId = String(button.getAttribute("data-testid") || "").toLowerCase();
    const id = String(button.id || "").toLowerCase();
    if (testId === "stop-button") return true;
    if (id === "composer-submit-button" && (label.includes("stop") || hasStopIcon(button))) return true;
    if (isComposerSubmitButton(button) && hasStopIcon(button)) return true;
    if (isComposerSubmitButton(button) && hasEmptyComposerNearButton(button) && button.querySelector("svg")) return true;
    return label.includes("stop streaming") ||
      label.includes("stop generating") ||
      label.includes("stop") ||
      label.includes("interrupt") ||
      label.includes("cancel response") ||
      label.includes("cancel") ||
      label.includes("停止生成") ||
      label.includes("停止") ||
      label === "stop" ||
      label === "停止";
  }

  function isGenerating() {
    if (Array.from(document.querySelectorAll("button")).some((button) => isStreamingStopButton(button))) {
      return true;
    }

    return Array.from(document.querySelectorAll("[aria-busy='true'], [data-message-streaming='true'], [data-is-streaming='true'], [data-testid*='streaming']"))
      .some((element) => isElementVisible(element));
  }

  function getReplyTextFromSnapshot(snapshot, allowShortReply, minShortReplySignalLength) {
    const rawText = snapshot.rawText || "";
    const shortReplyText = allowShortReply
      ? getShortAssistantReplyText(rawText, minShortReplySignalLength)
      : "";
    return snapshot.text || shortReplyText || rawText;
  }

  function hasUsableAssistantReply(text, allowShortReply, minShortReplySignalLength) {
    return allowShortReply
      ? Boolean(getShortAssistantReplyText(text, minShortReplySignalLength))
      : hasAssistantBodyText(text);
  }

  async function confirmAssistantReplySettled(batchId, allowShortReply, minShortReplySignalLength) {
    throwIfChatGptTransientPageError();
    const firstSnapshot = getAssistantSnapshot();
    const firstText = getReplyTextFromSnapshot(firstSnapshot, allowShortReply, minShortReplySignalLength);
    if (!hasUsableAssistantReply(firstText, allowShortReply, minShortReplySignalLength) || isGenerating()) return "";

    await sleepWithStopCheck(BATCH_REPLY_CONFIRM_MS, batchId);
    throwIfChatGptTransientPageError();
    if (isGenerating()) return "";

    const secondSnapshot = getAssistantSnapshot();
    const secondText = getReplyTextFromSnapshot(secondSnapshot, allowShortReply, minShortReplySignalLength);
    if (!hasUsableAssistantReply(secondText, allowShortReply, minShortReplySignalLength)) return "";
    if (secondSnapshot.text !== firstSnapshot.text) return "";
    if ((secondSnapshot.rawText || "") !== (firstSnapshot.rawText || "")) return "";

    await sleepWithStopCheck(BATCH_REPLY_FINAL_CONFIRM_MS, batchId);
    throwIfChatGptTransientPageError();
    if (isGenerating()) return "";

    const finalSnapshot = getAssistantSnapshot();
    const finalText = getReplyTextFromSnapshot(finalSnapshot, allowShortReply, minShortReplySignalLength);
    if (!hasUsableAssistantReply(finalText, allowShortReply, minShortReplySignalLength)) return "";
    if (finalSnapshot.text !== secondSnapshot.text) return "";
    if ((finalSnapshot.rawText || "") !== (secondSnapshot.rawText || "")) return "";
    return finalText;
  }

  async function isAssistantReplyChanging(batchId, waitMs = BATCH_REPLY_CONFIRM_MS) {
    if (getVisibleChatGptTransientPageErrorText()) return false;
    const firstSnapshot = getAssistantSnapshot();
    if (isGenerating()) return true;

    await sleepWithStopCheck(waitMs, batchId);
    if (getVisibleChatGptTransientPageErrorText()) return false;
    if (isGenerating()) return true;

    const secondSnapshot = getAssistantSnapshot();
    return firstSnapshot.count !== secondSnapshot.count ||
      firstSnapshot.key !== secondSnapshot.key ||
      firstSnapshot.text !== secondSnapshot.text ||
      (firstSnapshot.rawText || "") !== (secondSnapshot.rawText || "");
  }

  async function clickStopGeneratingIfVisible() {
    const stopButton = Array.from(document.querySelectorAll("button")).find((button) => isStreamingStopButton(button));

    if (!stopButton) return false;
    stopButton.click();
    await sleep(120);
    return true;
  }

  async function sleepWithStopCheck(ms, batchId) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < ms) {
      throwIfBatchStopped(batchId);
      sendBatchHeartbeat(batchId);
      await sleep(Math.min(200, ms - (Date.now() - startedAt)));
    }
  }

  async function waitForAssistantReply(previousAssistantSnapshot, batchId, timeout = BATCH_REPLY_TIMEOUT_MS, options = {}) {
    const startedAt = Date.now();
    let lastText = "";
    let lastRawText = "";
    let stableSince = Date.now();
    const allowShortReply = Boolean(options.allowShortReply);
    const minShortReplySignalLength = Number.isFinite(Number(options.minShortReplySignalLength))
      ? Math.max(1, Number(options.minShortReplySignalLength))
      : 1;

    while (true) {
      throwIfBatchStopped(batchId);
      throwIfChatGptTransientPageError();
      const currentSnapshot = getAssistantSnapshot();
      const latestText = currentSnapshot.text;
      const latestRawText = currentSnapshot.rawText || "";
      const shortReplyText = allowShortReply
        ? getShortAssistantReplyText(latestRawText, minShortReplySignalLength)
        : "";
      const replyText = getReplyTextFromSnapshot(currentSnapshot, allowShortReply, minShortReplySignalLength);

      if (latestText !== lastText || latestRawText !== lastRawText) {
        lastText = latestText;
        lastRawText = latestRawText;
        stableSince = Date.now();
      }

      const hasNewElement = (
        currentSnapshot.count > previousAssistantSnapshot.count ||
        (currentSnapshot.key && currentSnapshot.key !== previousAssistantSnapshot.key)
      );
      const hasNewText = Boolean(latestText) && latestText !== previousAssistantSnapshot.text;
      const hasNewRawText = Boolean(latestRawText) && latestRawText !== (previousAssistantSnapshot.rawText || "");
      const hasShortReply = allowShortReply && Boolean(shortReplyText) && (hasNewRawText || hasNewElement);
      const hasNewReply = hasNewText || (hasNewElement && hasNewRawText) || hasShortReply;
      const hasUsableReply = hasNewReply && hasUsableAssistantReply(replyText, allowShortReply, minShortReplySignalLength);
      const stableEnough = Date.now() - stableSince >= BATCH_REPLY_STABLE_MS;
      const timedOut = Date.now() - startedAt >= timeout;
      const currentlyGenerating = isGenerating();

      if (hasUsableReply && !currentlyGenerating && stableEnough) {
        const confirmedReply = await confirmAssistantReplySettled(batchId, allowShortReply, minShortReplySignalLength);
        if (confirmedReply) {
          return confirmedReply;
        }
        stableSince = Date.now();
      }

      if (timedOut && !currentlyGenerating && stableEnough && !hasUsableReply) {
        const replyChanging = await isAssistantReplyChanging(batchId);
        if (!replyChanging) {
          return "";
        }
        stableSince = Date.now();
      }

      await sleepWithStopCheck(500, batchId);
    }
  }

  function createBatchStoppedError() {
    return new Error(BATCH_STOPPED_ERROR);
  }

  function createChatExportStoppedError() {
    return new Error(CHAT_EXPORT_STOPPED_ERROR);
  }

  function shouldStopBatch(batchId) {
    return batchStopRequested && currentBatchId && currentBatchId === batchId;
  }

  function shouldStopChatExport(exportId) {
    return exportStopRequested && currentExportId && (!exportId || currentExportId === exportId);
  }

  function throwIfBatchStopped(batchId) {
    if (shouldStopBatch(batchId)) {
      throw createBatchStoppedError();
    }
  }

  function throwIfChatExportStopped(exportId) {
    if (shouldStopChatExport(exportId)) {
      throw createChatExportStoppedError();
    }
  }

  function isBatchStoppedError(error) {
    return String(error && error.message ? error.message : error) === BATCH_STOPPED_ERROR;
  }

  function isChatExportStoppedError(error) {
    return String(error && error.message ? error.message : error) === CHAT_EXPORT_STOPPED_ERROR;
  }

  async function sendRuntimeMessage(type, payload) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ type, payload }, (response) => {
          if (chrome.runtime.lastError) {
            resolve({ ok: false, error: chrome.runtime.lastError.message });
            return;
          }
          resolve(response || { ok: true });
        });
      } catch (error) {
        resolve({ ok: false, error: String(error && error.message ? error.message : error) });
      }
    });
  }

  function sendBatchHeartbeat(batchId) {
    if (!batchId || currentBatchId !== batchId || !batchRunning) return;
    const now = Date.now();
    if (now - lastBatchHeartbeatAt < BATCH_HEARTBEAT_INTERVAL_MS) return;
    lastBatchHeartbeatAt = now;
    sendRuntimeMessage("BATCH_HEARTBEAT", {
      batchId,
      time: new Date().toISOString()
    }).catch(() => {});
  }

  function refreshCurrentBatchAfterStuck(batchId) {
    if (!batchRunning || !currentBatchId || currentBatchId !== batchId) {
      return { ok: false, error: "当前页面没有对应的批量任务。" };
    }
    if (!currentBatchStuckRefresh?.payload) {
      return { ok: false, error: "当前批量任务没有可恢复的续跑状态。" };
    }

    const saved = saveBatchRetryState({
      payload: currentBatchStuckRefresh.payload,
      time: Date.now()
    });
    if (!saved) {
      return { ok: false, error: "续跑状态保存失败。" };
    }

    window.setTimeout(() => {
      location.reload();
    }, 80);
    return { ok: true };
  }

  function normalizeConversationTitle(title) {
    return String(title || "")
      .replace(/◆/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
  }

  function getBatchConversationSegment(index) {
    return Math.floor(Math.max(0, Number(index) || 0) / BATCH_CONVERSATION_ITEM_LIMIT);
  }

  function cleanBatchSubjectCandidate(value) {
    return normalizeConversationTitle(value)
      .replace(/^#+\s*/u, "")
      .replace(/^(?:\d+(?:[._]\d+)*|[IVXLC]+)[\s._-]+/iu, "")
      .replace(/\s*(?:思想地图|学科地图|地图)\s*$/u, "")
      .trim();
  }

  function isLikelyBatchSubjectName(value) {
    const text = cleanBatchSubjectCandidate(value);
    return Boolean(text && text.length <= 24 && /学/u.test(text) && !/地图/u.test(text));
  }

  function getBatchSubjectTitle(batchItems, index, directoryName) {
    const item = batchItems[index] || {};
    const path = Array.isArray(item.directoryPath) ? item.directoryPath.filter(Boolean) : [];
    const allPaths = batchItems.flatMap((batchItem) => (
      Array.isArray(batchItem && batchItem.directoryPath) ? batchItem.directoryPath.filter(Boolean) : []
    ));
    const candidates = [
      ...path.slice().reverse(),
      ...allPaths.slice().reverse(),
      directoryName
    ];
    const subject = candidates.find((candidate) => isLikelyBatchSubjectName(candidate));
    if (subject) {
      return `${cleanBatchSubjectCandidate(subject)}学科地图`;
    }

    return normalizeConversationTitle(path[path.length - 1] || directoryName || item.text || "批量消息");
  }

  function buildBatchConversationTitle(batchItems, index, options = {}) {
    const originalTotal = Number.isFinite(Number(options.originalTotal)) && Number(options.originalTotal) > 0
      ? Number(options.originalTotal)
      : batchItems.length;
    const displayIndex = Number.isFinite(Number(options.displayIndex)) && Number(options.displayIndex) > 0
      ? Number(options.displayIndex)
      : index + 1;
    return normalizeConversationTitle(`当前进度 ${displayIndex}/${originalTotal}`);
  }

  function isProgressConversationTitle(title) {
    return /^当前进度\s+\d+\s*\/\s*\d+$/u.test(normalizeConversationTitle(title));
  }

  async function reportDeleteProgress(message, level = "info") {
    await sendRuntimeMessage("DELETE_PROGRESS_CONVERSATIONS_PROGRESS", { message, level });
  }

  async function getChatApiHeaders() {
    const accessToken = await getAccessToken().catch(() => "");
    const accountId = await getWorkspaceAccountId().catch(() => null);
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
      headers["X-Authorization"] = `Bearer ${accessToken}`;
    }
    if (accountId) {
      headers["Chatgpt-Account-Id"] = accountId;
    }
    return headers;
  }

  function getConversationListItems(data) {
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.conversations)) return data.conversations;
    if (Array.isArray(data)) return data;
    return [];
  }

  function normalizeConversationListItem(item) {
    if (!item || typeof item !== "object") return null;
    const id = String(item.id || item.conversation_id || "").trim();
    const title = normalizeConversationTitle(item.title || item.name || "");
    if (!id || !title) return null;
    return { id, title };
  }

  async function fetchConversationListPage(offset, limit) {
    const url = new URL(`${getApiBaseUrl()}/conversations`);
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("order", "updated");
    const response = await fetch(url.toString(), {
      credentials: "include",
      headers: await getChatApiHeaders()
    });
    if (!response.ok) {
      throw new Error(`读取会话列表失败：${response.status}`);
    }
    return response.json();
  }

  async function hideConversationById(conversationId) {
    const response = await fetch(`${getApiBaseUrl()}/conversation/${conversationId}`, {
      method: "PATCH",
      credentials: "include",
      headers: await getChatApiHeaders(),
      body: JSON.stringify({ is_visible: false })
    });
    if (!response.ok) {
      throw new Error(`删除会话失败：${response.status}`);
    }
  }

  async function findProgressTitleConversations() {
    const limit = 100;
    let offset = 0;
    let scanned = 0;
    let total = null;
    const seenIds = new Set();
    const targets = [];

    await reportDeleteProgress("开始读取最近 3 页 ChatGPT 会话列表。");
    for (let page = 0; page < 3; page += 1) {
      await reportDeleteProgress(`正在读取最近会话列表第 ${page + 1}/3 页，offset=${offset}。`);
      const data = await fetchConversationListPage(offset, limit);
      const rawItems = getConversationListItems(data);
      if (Number.isFinite(Number(data?.total))) {
        total = Number(data.total);
      }

      for (const rawItem of rawItems) {
        const item = normalizeConversationListItem(rawItem);
        if (!item || seenIds.has(item.id)) continue;
        seenIds.add(item.id);
        scanned += 1;
        if (isProgressConversationTitle(item.title)) {
          targets.push(item);
        }
      }

      await reportDeleteProgress(`已读取第 ${page + 1}/3 页，累计扫描 ${scanned} 个，匹配 ${targets.length} 个进度标题对话。`);
      if (!rawItems.length || rawItems.length < limit) break;
      offset += rawItems.length;
      if (total !== null && offset >= total) break;
    }

    await reportDeleteProgress(`列表读取完成：扫描 ${scanned} 个，匹配 ${targets.length} 个进度标题对话，等待确认。`);
    return {
      scanned,
      matched: targets.length,
      targets
    };
  }

  async function deleteProgressTitleConversations(payload = {}) {
    const mode = payload.mode === "delete" ? "delete" : "list";
    if (mode === "list") {
      const result = await findProgressTitleConversations();
      return {
        ok: true,
        confirmRequired: true,
        ...result
      };
    }

    const targets = Array.isArray(payload.targets)
      ? payload.targets
        .map((item) => normalizeConversationListItem(item))
        .filter((item) => item && isProgressConversationTitle(item.title))
      : [];
    const scanned = Number.isFinite(Number(payload.scanned)) ? Math.max(0, Number(payload.scanned)) : 0;

    await reportDeleteProgress(`用户已确认，开始删除 ${targets.length} 个进度标题对话。`);
    let deleted = 0;
    let failed = 0;
    for (let index = 0; index < targets.length; index += 1) {
      const item = targets[index];
      try {
        await reportDeleteProgress(`正在删除第 ${index + 1}/${targets.length} 个：${item.title}`);
        await hideConversationById(item.id);
        deleted += 1;
      } catch {
        failed += 1;
        await reportDeleteProgress(`第 ${index + 1}/${targets.length} 个删除失败：${item.title}`, "error");
      }
    }

    await reportDeleteProgress(`清理完成：最近 3 页扫描 ${scanned} 个，确认 ${targets.length} 个，删除 ${deleted} 个，失败 ${failed} 个。`);
    return {
      ok: true,
      scanned,
      matched: targets.length,
      deleted,
      failed
    };
  }

  async function renameCurrentConversationBestEffort(title) {
    const cleanTitle = normalizeConversationTitle(title);
    if (!cleanTitle) return false;

    try {
      const conversationId = await until(() => getConversationIdFromLocation(), 15000, 250);
      if (!conversationId) return false;

      const accessToken = await getAccessToken().catch(() => "");
      const accountId = await getWorkspaceAccountId().catch(() => null);
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json"
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
        headers["X-Authorization"] = `Bearer ${accessToken}`;
      }
      if (accountId) {
        headers["Chatgpt-Account-Id"] = accountId;
      }

      const response = await fetch(`${getApiBaseUrl()}/conversation/${conversationId}`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify({ title: cleanTitle })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async function clickNewChatIfVisible() {
    const candidates = Array.from(document.querySelectorAll("button, a")).filter((element) => {
      if (element.offsetParent === null) return false;
      const label = [
        element.getAttribute("aria-label") || "",
        element.textContent || ""
      ].join(" ");
      return /New chat|新建对话|新建聊天|新对话/.test(label);
    });

    const button = candidates[0];
    if (!button) return false;

    button.click();
    await sleep(250);
    return true;
  }

  function findVisibleComposerInRoot(root) {
    const searchRoot = root || document;
    const explicitSelectors = [
      "#prompt-textarea",
      'form textarea',
      'main textarea',
      '[data-testid*="composer"] textarea',
      'form [contenteditable="true"][role="textbox"]',
      'form [contenteditable="true"]',
      'main [contenteditable="true"][role="textbox"]',
      'main [contenteditable="true"]'
    ];

    for (const selector of explicitSelectors) {
      const elements = Array.from(searchRoot.querySelectorAll(selector));
      const match = elements.find((element) => {
        if (!isElementVisible(element)) return false;
        if (element.getAttribute("role") === "presentation") return false;
        return Boolean(element.closest("form, main"));
      });
      if (match) {
        return {
          type: match.tagName === "TEXTAREA" ? "textarea" : "contenteditable",
          element: match
        };
      }
    }

    const forms = Array.from(searchRoot.querySelectorAll("form"));
    for (const form of forms) {
      if (!isElementVisible(form)) continue;

      const textarea = Array.from(form.querySelectorAll("textarea"))
        .find((element) => isElementVisible(element));
      if (textarea) {
        return { type: "textarea", element: textarea };
      }

      const editable = Array.from(form.querySelectorAll('[contenteditable="true"]'))
        .find((element) => isElementVisible(element) && element.getAttribute("role") !== "presentation");
      if (editable) {
        return { type: "contenteditable", element: editable };
      }
    }

    return null;
  }

  function findVisibleComposer() {
    return findVisibleComposerInRoot(document);
  }

  async function waitEditor(options = {}) {
    const timeout = Number.isFinite(Number(options.timeout)) ? Math.max(0, Number(options.timeout)) : 20000;
    const batchId = typeof options.batchId === "string" ? options.batchId : "";
    const startedAt = Date.now();
    let lastAssistantRawText = getAssistantSnapshot().rawText || "";
    let assistantChangedAt = 0;

    while (true) {
      if (batchId) {
        throwIfBatchStopped(batchId);
      }

      const currentAssistantRawText = getAssistantSnapshot().rawText || "";
      if (currentAssistantRawText !== lastAssistantRawText) {
        lastAssistantRawText = currentAssistantRawText;
        assistantChangedAt = currentAssistantRawText ? Date.now() : 0;
      }
      const assistantRecentlyChanged = Boolean(currentAssistantRawText) &&
        assistantChangedAt > 0 &&
        Date.now() - assistantChangedAt < BATCH_REPLY_STABLE_MS + 1000;
      const pageBusy = isGenerating() || assistantRecentlyChanged;
      const editor = findVisibleComposer();
      if (editor && !pageBusy) return editor;

      if (Date.now() - startedAt >= timeout && !pageBusy) {
        return null;
      }

      if (batchId) {
        await sleepWithStopCheck(150, batchId);
      } else {
        await sleep(150);
      }
    }
  }

  function triggerInput(element) {
    try {
      element.dispatchEvent(new InputEvent("input", { bubbles: true }));
    } catch {
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function getEditorValue(element) {
    if (!element) return "";
    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
      return element.value || "";
    }
    return element.textContent || "";
  }

  function setNativeInputValue(element, text) {
    const prototype = element.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement?.prototype
      : window.HTMLInputElement?.prototype;
    const descriptor = prototype ? Object.getOwnPropertyDescriptor(prototype, "value") : null;
    if (descriptor && typeof descriptor.set === "function") {
      descriptor.set.call(element, text);
      return;
    }
    element.value = text;
  }

  function triggerUserTyping(element, text) {
    const previousValue = getEditorValue(element);
    try {
      element.focus();
      const inserted = document.execCommand("insertText", false, text);
      if (inserted && getEditorValue(element) !== previousValue) return true;
    } catch {}

    try {
      const data = new DataTransfer();
      data.setData("text/plain", text);
      const pasteEvent = new ClipboardEvent("paste", { bubbles: true, clipboardData: data });
      element.dispatchEvent(pasteEvent);
      if (getEditorValue(element) !== previousValue) return true;
    } catch {}

    return false;
  }

  function hardSetValue(element, text) {
    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
      setNativeInputValue(element, text);
      element.focus();
      triggerInput(element);
      return;
    }

    element.focus();
    element.textContent = text;
    triggerInput(element);
  }

  function clearEditorValue(element) {
    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
      setNativeInputValue(element, "");
      element.focus();
      triggerInput(element);
      return;
    }

    element.focus();
    element.textContent = "";
    triggerInput(element);
  }

  async function waitForSendAccepted(editorElement, previousUserCount, timeout = 1600) {
    return until(() => {
      const currentValue = getEditorValue(editorElement).trim();
      if (!currentValue) return true;
      return getUserMessages().length > previousUserCount;
    }, timeout, 100);
  }

  async function pressSend(editorElement, previousUserCount) {
    const findSendButton = () => {
      const form = editorElement?.isConnected ? editorElement.closest("form") : null;
      const container = form?.isConnected ? form : document;
      const buttons = Array.from(container.querySelectorAll("button")).find((element) => {
        const label = [
          element.getAttribute("aria-label") || "",
          element.textContent || ""
        ].join(" ").toLowerCase();
        return element.isConnected && isElementVisible(element) && !element.disabled && (
          label.includes("send") ||
          label.includes("发送")
        );
      });

      if (buttons) return buttons;
      const submitButton = container.querySelector('button[type="submit"]:not(:disabled)');
      if (submitButton?.isConnected && isElementVisible(submitButton)) return submitButton;
      return Array.from(document.querySelectorAll('form button[type="submit"]:not(:disabled)'))
        .find((element) => element.isConnected && isElementVisible(element));
    };

    const form = editorElement?.isConnected ? editorElement.closest("form") : null;
    const button = await until(findSendButton, 8000, 100);
    if (button?.isConnected) {
      button.click();
      if (await waitForSendAccepted(editorElement, previousUserCount)) {
        return true;
      }
    }

    if (form?.isConnected && typeof form.requestSubmit === "function") {
      form.requestSubmit();
      if (await waitForSendAccepted(editorElement, previousUserCount)) {
        return true;
      }
    }

    const activeElement = document.activeElement || editorElement;
    if (!activeElement) return false;

    activeElement.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    }));
    activeElement.dispatchEvent(new KeyboardEvent("keyup", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    }));

    if (await waitForSendAccepted(editorElement, previousUserCount)) {
      return true;
    }

    if (button?.isConnected) {
      button.click();
      if (await waitForSendAccepted(editorElement, previousUserCount, 2500)) {
        return true;
      }
    }

    const sendAccepted = await until(() => {
      const currentValue = getEditorValue(editorElement).trim();
      if (!currentValue) return true;
      return getUserMessages().length > previousUserCount;
    }, 5000, 100);
    return Boolean(sendAccepted);
  }

  async function fillEditorAndSend({ text, prefix, fullText, autoSend, newChat, replaceExisting, batchId }) {
    throwIfBatchStopped(batchId);
    const editor = await prepareEditor(newChat, batchId);
    throwIfBatchStopped(batchId);
    if (replaceExisting && getEditorValue(editor.element).trim()) {
      clearEditorValue(editor.element);
      await sleep(80);
    }

    const messageText = typeof fullText === "string" ? fullText : composeFullText(text, prefix);
    const inserted = triggerUserTyping(editor.element, messageText);
    if (!inserted) {
      hardSetValue(editor.element, messageText);
    }

    if (getEditorValue(editor.element).trim() !== messageText.trim()) {
      hardSetValue(editor.element, messageText);
    }

    if (autoSend) {
      throwIfBatchStopped(batchId);
      const previousUserCount = getUserMessages().length;
      const sent = await pressSend(editor.element, previousUserCount);
      if (!sent) {
        throw new Error("发送按钮不可用。");
      }
    }
  }
  async function ensureHomeIfNeeded(newChat) {
    if (!newChat) return;
    if (location.pathname === "/" && !/\/c\//.test(location.pathname)) return;

    location.assign("/");
    await until(
      () => document.querySelector("main") || document.querySelector('[contenteditable="true"]') || document.querySelector("textarea"),
      15000,
      150
    );
  }

  async function prepareEditor(newChat, batchId = "") {
    throwIfBatchStopped(batchId);
    if (newChat) {
      const previousConversationId = getConversationIdFromLocation();
      const clicked = await clickNewChatIfVisible();
      if (clicked) {
        const changed = await until(() => {
          const currentConversationId = getConversationIdFromLocation();
          return !previousConversationId ||
            !currentConversationId ||
            currentConversationId !== previousConversationId ||
            getUserMessages().length === 0;
        }, 5000, 150);
        if (changed) {
          await sleep(200);
          const editor = await waitEditor({ batchId });
          if (editor) return editor;
        }
      }
    }

    await ensureHomeIfNeeded(newChat);

    if (newChat) {
      await clickNewChatIfVisible();
      await sleep(200);
    }

    const editor = await waitEditor({ batchId });
    if (!editor) {
      throw new Error("没有找到输入框。");
    }

    return editor;
  }

  async function handlePayload({ text, prefix, autoSend, newChat }) {
    try {
      await fillEditorAndSend({
        text,
        prefix,
        autoSend: Boolean(autoSend),
        newChat: Boolean(newChat),
        replaceExisting: false
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: String(error && error.message ? error.message : error) };
    }
  }

  async function sendPromptAndReadReply({ text, prompt, newChat, batchId, onSent }) {
    const fullText = composeFullText(text, prompt);
    return sendSingleMessageAndReadReply({ fullText, sentText: text, newChat, batchId, onSent });
  }

  async function sendGlobalPromptAndReadReply({ globalPrompt, newChat, batchId, onSent }) {
    return sendSingleMessageAndReadReply({
      fullText: globalPrompt,
      sentText: "全局 Prompt",
      newChat,
      batchId,
      onSent,
      allowShortReply: true,
      minShortReplySignalLength: 1
    });
  }

  async function sendSingleMessageAndReadReply({ fullText, sentText, newChat, batchId, onSent, allowShortReply, minShortReplySignalLength }) {
    const previousAssistantSnapshot = getAssistantSnapshot();
    throwIfBatchStopped(batchId);
    await fillEditorAndSend({
      fullText,
      autoSend: true,
      newChat,
      replaceExisting: true,
      batchId
    });
    const visibleSentText = String(sentText || fullText || "").trim();
    if (batchId && visibleSentText) {
      await sendRuntimeMessage("BATCH_PROGRESS", {
        batchId,
        sentText: visibleSentText,
        message: `已发送：${visibleSentText}，正在等待回答……`
      });
    }
    if (typeof onSent === "function") {
      await onSent();
    }

    const reply = await waitForAssistantReply(previousAssistantSnapshot, batchId, BATCH_REPLY_TIMEOUT_MS, {
      allowShortReply,
      minShortReplySignalLength
    });
    if (!reply) {
      throw new Error("没有提取到回答内容。");
    }

    return reply;
  }

  async function handleBatchExport(payload) {
    const {
      batchId,
      globalPrompt,
      prompt,
      items,
      itemIndexes,
      totalCount,
      completedOffset,
      newChat,
      delaySeconds,
      directoryName,
      resumeIndex,
      resumeCompleted,
      resumeFailed,
      resumeRetryAttempt,
      resumeNeedsGlobalPrompt
    } = payload || {};
    const oneTimePrompt = typeof globalPrompt === "string" ? globalPrompt.trim() : "";
    const batchItems = Array.isArray(items)
      ? items.map((item) => normalizeContentBatchItem(item)).filter(Boolean)
      : [];
    const originalIndexes = Array.isArray(itemIndexes) ? itemIndexes : [];
    const originalTotal = Number.isFinite(Number(totalCount)) && Number(totalCount) >= batchItems.length
      ? Number(totalCount)
      : batchItems.length;
    const skippedCount = Number.isFinite(Number(completedOffset))
      ? Math.min(originalTotal, Math.max(0, Number(completedOffset)))
      : 0;
    const shouldNewChat = newChat !== false;
    const normalizedDelaySeconds = Number.isFinite(Number(delaySeconds))
      ? Math.min(60, Math.max(0, Number(delaySeconds)))
      : 3;
    const delayMs = Math.round(normalizedDelaySeconds * 1000);
    const startIndex = Number.isFinite(Number(resumeIndex))
      ? Math.min(batchItems.length, Math.max(0, Number(resumeIndex)))
      : 0;
    const initialCompleted = Number.isFinite(Number(resumeCompleted)) ? Math.max(0, Number(resumeCompleted)) : 0;
    const initialFailed = Number.isFinite(Number(resumeFailed)) ? Math.max(0, Number(resumeFailed)) : 0;
    const initialRetryAttempt = Number.isFinite(Number(resumeRetryAttempt)) ? Math.max(0, Number(resumeRetryAttempt)) : 0;
    const isResume = startIndex > 0 || initialRetryAttempt > 0;
    const shouldSendResumeGlobalPrompt = Boolean(resumeNeedsGlobalPrompt);
    const getDisplayIndexForBatchItem = (index) => {
      const rawIndex = Number(originalIndexes[index]);
      return Number.isFinite(rawIndex) && rawIndex > 0
        ? rawIndex
        : skippedCount + index + 1;
    };
    const resumeDisplayIndex = getDisplayIndexForBatchItem(startIndex);

    if (!batchItems.length) {
      await sendRuntimeMessage("BATCH_FAILED", { error: "批量任务没有可执行的文本。" });
      return;
    }

    batchRunning = true;
    currentBatchId = batchId || "";
    batchStopRequested = false;
    lastBatchHeartbeatAt = 0;
    sendBatchHeartbeat(batchId);
    await sendRuntimeMessage("BATCH_PROGRESS", {
      batchId,
      running: true,
      total: originalTotal,
      currentIndex: skippedCount,
      currentText: "",
      sentText: "",
      retryAttempt: isResume ? initialRetryAttempt : 0,
      maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
      message: isResume
        ? initialRetryAttempt > 0
          ? `页面已刷新，正在第 ${initialRetryAttempt}/${BATCH_MAX_REFRESH_RETRIES} 次重试第 ${resumeDisplayIndex}/${originalTotal} 条……`
          : `页面已刷新，正在继续第 ${resumeDisplayIndex}/${originalTotal} 条……`
        : skippedCount
        ? `批量任务开始执行，共 ${originalTotal} 条，已跳过 ${skippedCount} 条。`
        : `批量任务开始执行，共 ${originalTotal} 条。`,
      startedAt: new Date().toISOString()
    });

    let completed = initialCompleted;
    let failed = initialFailed;
    const renamedSegments = new Set();
    const renameAttemptsBySegment = new Map();
    let retryWatchdogTimer = null;

    const buildResumePayload = (index, retryAttempt, needsGlobalPrompt) => ({
      batchId,
      globalPrompt,
      prompt,
      items: batchItems,
      itemIndexes: originalIndexes,
      totalCount: originalTotal,
      completedOffset: skippedCount,
      newChat,
      delaySeconds,
      directoryName,
      resumeIndex: index,
      resumeCompleted: completed,
      resumeFailed: failed,
      resumeRetryAttempt: retryAttempt,
      resumeNeedsGlobalPrompt: Boolean(needsGlobalPrompt)
    });

    const updateStuckRefreshPayload = (index, retryAttempt, needsGlobalPrompt) => {
      const safeIndex = Math.min(batchItems.length - 1, Math.max(0, Number(index) || 0));
      const safeRetryAttempt = Math.max(1, Number(retryAttempt) || 0);
      currentBatchStuckRefresh = {
        batchId,
        index: safeIndex,
        displayIndex: getDisplayIndexForBatchItem(safeIndex),
        payload: buildResumePayload(safeIndex, safeRetryAttempt, needsGlobalPrompt)
      };
    };

    if (batchItems.length) {
      updateStuckRefreshPayload(startIndex, initialRetryAttempt, shouldSendResumeGlobalPrompt);
    }

    const clearRetryStateForCurrentItem = (index) => {
      if (index === startIndex && initialRetryAttempt > 0) {
        clearBatchRetryState();
      }
    };

    const startRetryResumeWatchdog = () => {
      if (!isResume || initialRetryAttempt <= 0) return;
      retryWatchdogTimer = window.setTimeout(async () => {
        const retryState = readBatchRetryState();
        const retryPayload = retryState?.payload || {};
        const storedAttempt = Number.isFinite(Number(retryPayload.resumeRetryAttempt))
          ? Math.max(0, Number(retryPayload.resumeRetryAttempt))
          : initialRetryAttempt;
        const storedIndex = Number.isFinite(Number(retryPayload.resumeIndex))
          ? Math.max(0, Number(retryPayload.resumeIndex))
          : startIndex;
        if (!batchRunning || currentBatchId !== batchId || retryPayload.batchId !== batchId || storedIndex !== startIndex) {
          return;
        }

        let replyChanging = false;
        try {
          replyChanging = await isAssistantReplyChanging(batchId);
        } catch (error) {
          if (isBatchStoppedError(error)) {
            return;
          }
          throw error;
        }

        if (replyChanging) {
          await sendRuntimeMessage("BATCH_PROGRESS", {
            batchId,
            running: true,
            total: originalTotal,
            currentIndex: resumeDisplayIndex,
            currentText: batchItems[startIndex]?.text || "",
            sentText: batchItems[startIndex]?.text || "",
            retryAttempt: storedAttempt,
            maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
            message: `第 ${resumeDisplayIndex}/${originalTotal} 条刷新后回答仍在生成或更新，继续等待稳定后再判断。`
          });
          retryWatchdogTimer = null;
          startRetryResumeWatchdog();
          return;
        }

        if (storedAttempt >= BATCH_MAX_REFRESH_RETRIES) {
          clearBatchRetryState();
          await sendRuntimeMessage("BATCH_FAILED", {
            batchId,
            total: originalTotal,
            completed,
            failed,
            error: `第 ${resumeDisplayIndex}/${originalTotal} 条刷新重试已达到 ${BATCH_MAX_REFRESH_RETRIES} 次，任务已停止。`
          });
          batchStopRequested = true;
          return;
        }

        retryPayload.resumeRetryAttempt = storedAttempt + 1;
        if (retryPayload.resumeRetryAttempt >= BATCH_NEW_TAB_RETRY_AFTER) {
          const response = await sendRuntimeMessage("BATCH_RETRY_IN_NEW_TAB", {
            batchId,
            retryPayload: {
              ...retryPayload,
              newChat: true,
              resumeNeedsGlobalPrompt: true
            },
            index: resumeDisplayIndex,
            total: originalTotal,
            text: batchItems[startIndex]?.text || "",
            retryAttempt: retryPayload.resumeRetryAttempt,
            maxRetries: BATCH_MAX_REFRESH_RETRIES,
            reason: "刷新后仍未继续。"
          });
          if (response && response.ok) {
            batchStopRequested = true;
            batchRunning = false;
            return;
          }
        }

        const saved = saveBatchRetryState({
          payload: retryPayload,
          time: Date.now()
        });
        if (!saved) {
          await sendRuntimeMessage("BATCH_FAILED", {
            batchId,
            total: originalTotal,
            completed,
            failed,
            error: "刷新重试状态保存失败，任务已停止。"
          });
          batchStopRequested = true;
          return;
        }

        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: resumeDisplayIndex,
          currentText: batchItems[startIndex]?.text || "",
          retryAttempt: retryPayload.resumeRetryAttempt,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: `第 ${resumeDisplayIndex}/${originalTotal} 条刷新后仍未继续，正在第 ${retryPayload.resumeRetryAttempt}/${BATCH_MAX_REFRESH_RETRIES} 次刷新重试。`
        });
        location.reload();
      }, BATCH_RETRY_WATCHDOG_MS);
    };

    const renameSegmentConversation = async (index, options = {}) => {
      const force = Boolean(options.force);
      const segment = getBatchConversationSegment(index);
      if (!force && renamedSegments.has(segment)) return;
      const attemptKey = force ? `force:${segment}` : `normal:${segment}`;
      const attempts = renameAttemptsBySegment.get(attemptKey) || 0;
      if (attempts >= (force ? 3 : 2)) return;

      renameAttemptsBySegment.set(attemptKey, attempts + 1);
      const displayIndex = getDisplayIndexForBatchItem(index);
      const title = buildBatchConversationTitle(batchItems, index, {
        displayIndex,
        originalTotal,
        directoryName
      });
      await sendRuntimeMessage("BATCH_PROGRESS", {
        batchId,
        running: true,
        total: originalTotal,
        currentIndex: displayIndex,
        currentText: batchItems[index]?.text || "",
        sentText: "",
        retryAttempt: index === startIndex ? initialRetryAttempt : 0,
        maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
        message: `正在修改对话标题：${title}`
      });
      let renamed = await renameCurrentConversationBestEffort(title);
      if (force) {
        await sleepWithStopCheck(1200, batchId);
        renamed = await renameCurrentConversationBestEffort(title) || renamed;
      }
      if (renamed) {
        renamedSegments.add(segment);
        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: displayIndex,
          currentText: batchItems[index]?.text || "",
          sentText: "",
          retryAttempt: index === startIndex ? initialRetryAttempt : 0,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: `对话标题已改为：${title}`
        });
      } else {
        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: displayIndex,
          currentText: batchItems[index]?.text || "",
          sentText: "",
          retryAttempt: index === startIndex ? initialRetryAttempt : 0,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: `对话标题暂未改成：${title}，稍后会再次尝试。`
        });
      }
    };

    const openNewBatchSegmentConversation = async (index, displayIndex) => {
      await sendRuntimeMessage("BATCH_PROGRESS", {
        batchId,
        running: true,
        total: originalTotal,
        currentIndex: Math.max(skippedCount, displayIndex - 1),
        currentText: "",
        sentText: "",
        retryAttempt: 0,
        maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
        message: `已处理 ${Math.max(0, displayIndex - 1)} 条，正在新建对话……`
      });
      const resumeStateSaved = saveBatchRetryState({
        payload: buildResumePayload(index, 0, Boolean(oneTimePrompt)),
        time: Date.now()
      });
      if (!resumeStateSaved) {
        throw new Error("新建对话续跑状态保存失败。");
      }

      await prepareEditor(true, batchId);
      await sendRuntimeMessage("BATCH_PROGRESS", {
        batchId,
        running: true,
        total: originalTotal,
        currentIndex: Math.max(skippedCount, displayIndex - 1),
        currentText: "",
        sentText: "",
        retryAttempt: 0,
        maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
        message: oneTimePrompt ? "新对话已打开，正在准备全局 Prompt……" : "新对话已打开，正在准备本段第一条文本……"
      });

      if (oneTimePrompt) {
        updateStuckRefreshPayload(index, 1, true);
        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: Math.max(skippedCount, displayIndex - 1),
          currentText: "",
          sentText: "",
          retryAttempt: 0,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: "正在发送全局 Prompt……"
        });
        await sendGlobalPromptAndReadReply({
          globalPrompt: oneTimePrompt,
          newChat: false,
          batchId,
          onSent: () => renameSegmentConversation(index, { force: true })
        });
        updateStuckRefreshPayload(index, 1, false);
        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: Math.max(skippedCount, displayIndex - 1),
          currentText: "",
          sentText: "全局 Prompt",
          retryAttempt: 0,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: "全局 Prompt 已收到回答，正在进入批量文本处理……"
        });
      }

      await renameSegmentConversation(index);
      clearBatchRetryState();
    };

    const scheduleItemRetry = async ({ index, retryAttempt, displayIndex, text, reason }) => {
      if (retryAttempt >= BATCH_MAX_REFRESH_RETRIES) {
        clearBatchRetryState();
        await sendRuntimeMessage("BATCH_FAILED", {
          batchId,
          total: originalTotal,
          completed,
          failed,
          error: `第 ${displayIndex}/${originalTotal} 条刷新重试已达到 ${BATCH_MAX_REFRESH_RETRIES} 次，任务已停止。${reason || ""}`.trim()
        });
        batchStopRequested = true;
        return;
      }

      const nextRetryAttempt = retryAttempt + 1;
      const retryMethod = nextRetryAttempt >= BATCH_NEW_TAB_RETRY_AFTER ? "新标签页重试" : "刷新重试";
      const retryPayload = buildResumePayload(index, nextRetryAttempt, false);
      await sendRuntimeMessage("BATCH_PROGRESS", {
        batchId,
        running: true,
        total: originalTotal,
        currentIndex: displayIndex,
        currentText: text,
        sentText: text,
        retryAttempt: nextRetryAttempt,
        maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
        message: `第 ${displayIndex}/${originalTotal} 条保存失败，正在第 ${nextRetryAttempt}/${BATCH_MAX_REFRESH_RETRIES} 次${retryMethod}。${reason || ""}`.trim()
      });

      if (nextRetryAttempt >= BATCH_NEW_TAB_RETRY_AFTER) {
        const response = await sendRuntimeMessage("BATCH_RETRY_IN_NEW_TAB", {
          batchId,
          retryPayload: {
            ...retryPayload,
            newChat: true,
            resumeNeedsGlobalPrompt: true
          },
          index: displayIndex,
          total: originalTotal,
          text,
          retryAttempt: nextRetryAttempt,
          maxRetries: BATCH_MAX_REFRESH_RETRIES,
          reason
        });
        if (response && response.ok) {
          return;
        }
      }

      const retryStateSaved = saveBatchRetryState({
        payload: retryPayload,
        time: Date.now()
      });
      if (!retryStateSaved) {
        throw new Error("重试状态保存失败。");
      }
      location.reload();
    };

    const getLatestPromptBeforeAssistantReply = () => {
      const messages = getConversationMessages();
      for (let index = messages.length - 1; index >= 0; index -= 1) {
        if (messages[index].role !== "assistant") continue;
        for (let userIndex = index - 1; userIndex >= 0; userIndex -= 1) {
          if (messages[userIndex].role === "user") {
            return messages[userIndex].text || "";
          }
        }
      }

      const users = getUserMessages();
      const latestUser = users[users.length - 1] || null;
      return latestUser ? getUserText(latestUser) : "";
    };

    const currentItemWasAlreadySent = (text) => {
      const latestPrompt = normalizeMessageKey(getLatestPromptBeforeAssistantReply());
      const fullText = normalizeMessageKey(composeFullText(text, prompt));
      const itemText = normalizeMessageKey(text);
      if (!latestPrompt || !itemText) return false;
      return latestPrompt.includes(fullText) || latestPrompt.includes(itemText);
    };

    const readCurrentSettledAssistantReply = async () => {
      const startedAt = Date.now();
      let lastText = "";
      let lastRawText = "";
      let stableSince = Date.now();

      while (true) {
        throwIfBatchStopped(batchId);
        throwIfChatGptTransientPageError();
        const snapshot = getAssistantSnapshot();
        const replyText = getReplyTextFromSnapshot(snapshot, false, 1);
        const rawText = snapshot.rawText || "";

        if (replyText !== lastText || rawText !== lastRawText) {
          lastText = replyText;
          lastRawText = rawText;
          stableSince = Date.now();
        }

        const stableEnough = Date.now() - stableSince >= BATCH_REPLY_STABLE_MS;
        const timedOut = Date.now() - startedAt >= BATCH_REPLY_TIMEOUT_MS;
        if (hasUsableAssistantReply(replyText, false, 1) && !isGenerating() && stableEnough) {
          const confirmedReply = await confirmAssistantReplySettled(batchId, false, 1);
          if (confirmedReply) {
            return confirmedReply;
          }
          stableSince = Date.now();
        }

        if (timedOut && !isGenerating() && stableEnough) {
          return "";
        }

        await sleepWithStopCheck(500, batchId);
      }
    };

    const trySaveExistingResumeAnswer = async () => {
      if (!isResume || initialRetryAttempt <= 0 || shouldSendResumeGlobalPrompt || startIndex >= batchItems.length) {
        return "";
      }

      const item = batchItems[startIndex];
      if (!item || !currentItemWasAlreadySent(item.text)) {
        return "";
      }

      const displayIndex = getDisplayIndexForBatchItem(startIndex);
      await sendRuntimeMessage("BATCH_PROGRESS", {
        batchId,
        running: true,
        total: originalTotal,
        currentIndex: displayIndex,
        currentText: item.text,
        sentText: item.text,
        retryAttempt: initialRetryAttempt,
        maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
        message: `页面已刷新，正在读取第 ${displayIndex}/${originalTotal} 条已有回答……`
      });

      let answer = "";
      try {
        answer = await readCurrentSettledAssistantReply();
      } catch (error) {
        if (isBatchStoppedError(error)) {
          throw error;
        }
        await scheduleItemRetry({
          index: startIndex,
          retryAttempt: initialRetryAttempt,
          displayIndex,
          text: item.text,
          reason: String(error && error.message ? error.message : error)
        });
        return "retry";
      }
      if (!answer) {
        return "";
      }

      await sendRuntimeMessage("BATCH_PROGRESS", {
        batchId,
        running: true,
        total: originalTotal,
        currentIndex: displayIndex,
        currentText: item.text,
        sentText: item.text,
        retryAttempt: initialRetryAttempt,
        maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
        message: `第 ${displayIndex}/${originalTotal} 条已有回答已读取，正在保存：${item.text}`
      });

      const result = await sendRuntimeMessage("BATCH_ITEM_RESULT", {
        batchId,
        index: displayIndex,
        total: originalTotal,
        text: item.text,
        itemNumber: item.itemNumber,
        directoryPath: item.directoryPath,
        prompt,
        answer,
        retryAttempt: initialRetryAttempt,
        maxRetries: BATCH_MAX_REFRESH_RETRIES
      });

      if (result && result.retry) {
        await scheduleItemRetry({
          index: startIndex,
          retryAttempt: initialRetryAttempt,
          displayIndex,
          text: item.text,
          reason: result.error || ""
        });
        return "retry";
      }

      clearRetryStateForCurrentItem(startIndex);
      if (result && result.saved) {
        await renameSegmentConversation(startIndex, { force: true });
        completed += 1;
        return "saved";
      }

      failed += 1;
      return "failed";
    };

    const isRetryableBatchSetupError = (error) => {
      const message = String(error && error.message ? error.message : error);
      return message.includes("没有找到输入框。");
    };

    try {
      throwIfBatchStopped(batchId);
      if (isResume) {
        await until(() => document.readyState === "complete", 20000, 150);
      }

      let loopStartIndex = startIndex;
      const existingResumeResult = await trySaveExistingResumeAnswer();
      if (existingResumeResult === "retry") {
        return;
      }
      if (existingResumeResult) {
        loopStartIndex = Math.min(startIndex + 1, batchItems.length);
      } else if (isResume && initialRetryAttempt > 0) {
        startRetryResumeWatchdog();
      }

      if (!existingResumeResult) {
        if (shouldNewChat && !isResume) {
          await sendRuntimeMessage("BATCH_PROGRESS", {
            batchId,
            running: true,
            total: originalTotal,
            currentIndex: skippedCount,
            currentText: "",
            sentText: "",
            retryAttempt: 0,
            maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
            message: "正在新建对话……"
          });
          await prepareEditor(true, batchId);
          await sendRuntimeMessage("BATCH_PROGRESS", {
            batchId,
            running: true,
            total: originalTotal,
            currentIndex: skippedCount,
            currentText: "",
            sentText: "",
            retryAttempt: 0,
            maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
            message: oneTimePrompt ? "新对话已打开，正在准备全局 Prompt……" : "新对话已打开，正在准备第一条文本……"
          });
        } else {
          await sendRuntimeMessage("BATCH_PROGRESS", {
            batchId,
            running: true,
            total: originalTotal,
            currentIndex: skippedCount,
            currentText: "",
            sentText: "",
            retryAttempt: isResume ? initialRetryAttempt : 0,
            maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
            message: "正在检查当前页面输入框和回答状态……"
          });
          const editor = await waitEditor({ batchId });
          if (!editor) {
            throw new Error("没有找到输入框。");
          }
        }
      }

      if (loopStartIndex === startIndex && oneTimePrompt && (!isResume || shouldSendResumeGlobalPrompt)) {
        updateStuckRefreshPayload(startIndex, 1, true);
        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: skippedCount,
          currentText: "",
          sentText: "",
          retryAttempt: 0,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: "正在发送全局 Prompt……"
        });
        await sendGlobalPromptAndReadReply({
          globalPrompt: oneTimePrompt,
          newChat: false,
          batchId,
          onSent: () => renameSegmentConversation(startIndex, { force: true })
        });
        updateStuckRefreshPayload(startIndex, 1, false);
        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: skippedCount,
          currentText: "",
          sentText: "全局 Prompt",
          retryAttempt: 0,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: "全局 Prompt 已收到回答，正在准备第一条文本……"
        });
      }
      if (loopStartIndex === startIndex && getConversationIdFromLocation()) {
        await renameSegmentConversation(startIndex);
      }

      for (let index = loopStartIndex; index < batchItems.length; index += 1) {
        throwIfBatchStopped(batchId);
        const item = batchItems[index];
        const text = item.text;
        const directoryPath = item.directoryPath;
        const retryAttempt = index === startIndex ? initialRetryAttempt : 0;
        const displayIndex = getDisplayIndexForBatchItem(index);
        updateStuckRefreshPayload(index, retryAttempt, false);
        if (index > startIndex && index % BATCH_CONVERSATION_ITEM_LIMIT === 0) {
          await openNewBatchSegmentConversation(index, displayIndex);
        }
        await sendRuntimeMessage("BATCH_PROGRESS", {
          batchId,
          running: true,
          total: originalTotal,
          currentIndex: displayIndex,
          currentText: text,
          sentText: "",
          retryAttempt,
          maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
          message: `正在准备第 ${displayIndex}/${originalTotal} 条：${text}`
        });

        const scheduleRetry = async (reason) => {
          await scheduleItemRetry({
            index,
            retryAttempt,
            displayIndex,
            text,
            reason
          });
        };

        const handleResult = async (result) => {
          if (result && result.retry) {
            await scheduleRetry(result.error || "");
            return "retry";
          }
          if (result && result.saved) {
            clearRetryStateForCurrentItem(index);
            completed += 1;
            return "saved";
          }
          clearRetryStateForCurrentItem(index);
          failed += 1;
          return "failed";
        };

        try {
          await sendRuntimeMessage("BATCH_PROGRESS", {
            batchId,
            running: true,
            total: originalTotal,
            currentIndex: displayIndex,
            currentText: text,
            sentText: "",
            retryAttempt,
            maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
            message: `正在发送第 ${displayIndex}/${originalTotal} 条：${text}`
          });
          const answer = await sendPromptAndReadReply({
            text,
            prompt,
            newChat: false,
            batchId,
            onSent: () => renameSegmentConversation(index, {
              force: index === startIndex || index % BATCH_CONVERSATION_ITEM_LIMIT === 0
            })
          });
          await sendRuntimeMessage("BATCH_PROGRESS", {
            batchId,
            running: true,
            total: originalTotal,
            currentIndex: displayIndex,
            currentText: text,
            sentText: text,
            retryAttempt,
            maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
            message: `第 ${displayIndex}/${originalTotal} 条回答已读取，正在保存：${text}`
          });
          const result = await sendRuntimeMessage("BATCH_ITEM_RESULT", {
            batchId,
            index: displayIndex,
            total: originalTotal,
            text,
            itemNumber: item.itemNumber,
            directoryPath,
            prompt,
            answer,
            retryAttempt,
            maxRetries: BATCH_MAX_REFRESH_RETRIES
          });
          if (await handleResult(result) === "retry") return;
        } catch (error) {
          await sendRuntimeMessage("BATCH_PROGRESS", {
            batchId,
            running: true,
            total: originalTotal,
            currentIndex: displayIndex,
            currentText: text,
            sentText: text,
            retryAttempt,
            maxRefreshRetries: BATCH_MAX_REFRESH_RETRIES,
            message: `第 ${displayIndex}/${originalTotal} 条发送、读取或保存前处理失败，正在记录结果：${text}`
          });
          const result = await sendRuntimeMessage("BATCH_ITEM_RESULT", {
            batchId,
            index: displayIndex,
            total: originalTotal,
            text,
            itemNumber: item.itemNumber,
            directoryPath,
            prompt,
            error: String(error && error.message ? error.message : error),
            retryAttempt,
            maxRetries: BATCH_MAX_REFRESH_RETRIES
          });
          if (await handleResult(result) === "retry") return;
        }
        await renameSegmentConversation(index, {
          force: (isResume && initialRetryAttempt > 0 && index === startIndex) ||
            index % BATCH_CONVERSATION_ITEM_LIMIT === 0
        });

        if (index + 1 < batchItems.length && delayMs > 0) {
          await sleepWithStopCheck(delayMs, batchId);
        }
      }

      const messageParts = skippedCount ? [`跳过 ${skippedCount} 条`] : [];
      messageParts.push(`成功 ${completed} 条`);
      if (failed) {
        messageParts.push(`失败 ${failed} 条`);
      }
      const message = `任务结束，${messageParts.join("，")}。`;

      await sendRuntimeMessage("BATCH_FINISHED", {
        batchId,
        total: originalTotal,
        completed,
        failed,
        message
      });
      clearBatchRetryState();
    } catch (error) {
      if (isBatchStoppedError(error)) {
        clearBatchRetryState();
        return;
      }

      if (isRetryableBatchSetupError(error) && startIndex < batchItems.length) {
        const item = batchItems[startIndex];
        const displayIndex = getDisplayIndexForBatchItem(startIndex);
        await scheduleItemRetry({
          index: startIndex,
          retryAttempt: initialRetryAttempt,
          displayIndex,
          text: item?.text || "",
          reason: String(error && error.message ? error.message : error)
        });
        return;
      }

      clearBatchRetryState();
      await sendRuntimeMessage("BATCH_FAILED", {
        batchId,
        total: originalTotal,
        completed,
        failed,
        error: String(error && error.message ? error.message : error)
      });
    } finally {
      if (retryWatchdogTimer) {
        window.clearTimeout(retryWatchdogTimer);
      }
      batchRunning = false;
      currentBatchId = "";
      batchStopRequested = false;
      currentBatchStuckRefresh = null;
      lastBatchHeartbeatAt = 0;
    }
  }

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== DEEP_RESEARCH_EXPORT_REQUEST) {
      return;
    }

    const root = getDeepResearchRoot(document);
    const markdown = root ? convertDeepResearchRootToMarkdown(root) : "";
    const title = extractFirstMarkdownHeading(markdown);
    if (event.source && typeof event.source.postMessage === "function") {
      event.source.postMessage({
        type: DEEP_RESEARCH_EXPORT_RESPONSE,
        requestId: data.requestId,
        markdown,
        title
      }, "*");
    }
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (window !== window.top) {
      return;
    }

    if (!message || !message.type) return;

    if (message.type === "EXT_SEND_TO_GPT") {
      handlePayload(message.payload).then((result) => sendResponse(result));
      return true;
    }

    if (message.type === "EXT_START_BATCH_EXPORT") {
      if (batchRunning) {
        sendResponse({ ok: false, error: "批量任务仍在执行中。" });
        return;
      }

      sendResponse({ ok: true });
      handleBatchExport(message.payload).catch(async (error) => {
        batchRunning = false;
        await sendRuntimeMessage("BATCH_FAILED", {
          error: String(error && error.message ? error.message : error)
        });
      });
      return;
    }

    if (message.type === "EXT_EXPORT_CURRENT_CONVERSATION") {
      const exportId = typeof message.payload?.exportId === "string" ? message.payload.exportId : "";
      if (exportRunning) {
        sendResponse({ ok: false, error: "对话导出任务仍在执行中。" });
        return;
      }

      exportRunning = true;
      currentExportId = exportId;
      exportStopRequested = false;
      handleExportCurrentConversation(message.payload)
        .then((result) => sendResponse(result))
        .catch((error) => sendResponse({
          ok: false,
          error: String(error && error.message ? error.message : error)
        }))
        .finally(() => {
          exportRunning = false;
          currentExportId = "";
          exportStopRequested = false;
          currentExportAbortController = null;
        });
      return true;
    }

    if (message.type === "EXT_DELETE_PROGRESS_CONVERSATIONS") {
      if (batchRunning) {
        sendResponse({ ok: false, error: "批量任务仍在执行中。" });
        return;
      }

      deleteProgressTitleConversations(message.payload)
        .then((result) => sendResponse(result))
        .catch(async (error) => {
          const errorMessage = String(error && error.message ? error.message : error);
          await reportDeleteProgress(`清理进度标题对话失败：${errorMessage}`, "error");
          sendResponse({
            ok: false,
            error: errorMessage
          });
        });
      return true;
    }

    if (message.type === "EXT_STOP_BATCH_EXPORT") {
      const batchId = typeof message.payload?.batchId === "string" ? message.payload.batchId : "";
      if (!batchRunning || !currentBatchId || (batchId && currentBatchId !== batchId)) {
        sendResponse({ ok: true });
        return;
      }

      batchStopRequested = true;
      clearBatchRetryState();
      clickStopGeneratingIfVisible().catch(() => {});
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "EXT_REFRESH_STUCK_BATCH") {
      const batchId = typeof message.payload?.batchId === "string" ? message.payload.batchId : "";
      sendResponse(refreshCurrentBatchAfterStuck(batchId));
      return;
    }

    if (message.type === "EXT_STOP_CHAT_EXPORT") {
      const exportId = typeof message.payload?.exportId === "string" ? message.payload.exportId : "";
      if (!exportRunning || !currentExportId || (exportId && currentExportId !== exportId)) {
        sendResponse({ ok: true });
        return;
      }

      exportStopRequested = true;
      if (currentExportAbortController) {
        currentExportAbortController.abort();
      }
      sendResponse({ ok: true });
    }
  });

  const retryState = readBatchRetryState();
  if (retryState && retryState.payload && retryState.payload.batchId) {
    handleBatchExport(retryState.payload).catch(async (error) => {
      batchRunning = false;
      currentBatchId = "";
      batchStopRequested = false;
      currentBatchStuckRefresh = null;
      lastBatchHeartbeatAt = 0;
      await sendRuntimeMessage("BATCH_FAILED", {
        batchId: retryState.payload.batchId,
        error: String(error && error.message ? error.message : error)
      });
    });
  }
})();
