(function () {
  const DEFAULTS = {
    selectionBubbleEnabled: false,
    selectionBubbleExcludedUrls: []
  };
  const ROOT_ID = "gpt-quick-search-selection-root";
  const TRANSLATE_LABEL = "翻译";
  const EXPLAIN_LABEL = "Ask GPT";

  let enabled = DEFAULTS.selectionBubbleEnabled;
  let excludedUrls = [];
  let root = null;
  let shadow = null;
  let bubble = null;
  let replyBox = null;
  let closeButton = null;
  let currentSelection = null;
  let currentRequestId = "";
  let hideTimer = 0;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeExcludedUrl(value) {
    return String(value || "").trim().replace(/\/+$/u, "");
  }

  function normalizeExcludedUrls(values) {
    const seen = new Set();
    const result = [];
    for (const value of Array.isArray(values) ? values : []) {
      const text = normalizeExcludedUrl(value);
      const key = text.toLowerCase();
      if (!text || seen.has(key)) continue;
      seen.add(key);
      result.push(text);
    }
    return result;
  }

  function isCurrentUrlExcluded() {
    if (!excludedUrls.length) return false;

    const href = String(location.href || "").toLowerCase();
    const hostname = String(location.hostname || "").replace(/^www\./i, "").toLowerCase();

    return excludedUrls.some((item) => {
      const pattern = normalizeExcludedUrl(item).toLowerCase();
      if (!pattern) return false;
      if (/^https?:\/\//i.test(pattern)) {
        return href === pattern || href.startsWith(`${pattern}/`);
      }

      const cleanPattern = pattern
        .replace(/^\*+:\/\//u, "")
        .replace(/^www\./u, "");
      return hostname === cleanPattern ||
        hostname.endsWith(`.${cleanPattern}`) ||
        href.includes(cleanPattern);
    });
  }

  function isEditableSelectionTarget(element) {
    if (!element) return false;
    const tagName = String(element.tagName || "").toUpperCase();
    if (tagName === "TEXTAREA") return true;
    if (tagName !== "INPUT") return false;
    return ["text", "search", "url", "email", "tel"].includes(String(element.type || "").toLowerCase());
  }

  function getActiveInputSelection() {
    const element = document.activeElement;
    if (!isEditableSelectionTarget(element)) return null;
    if (typeof element.selectionStart !== "number" || typeof element.selectionEnd !== "number") return null;
    if (element.selectionStart === element.selectionEnd) return null;

    const text = String(element.value || "").slice(element.selectionStart, element.selectionEnd);
    if (!text.trim()) return null;

    const rect = element.getBoundingClientRect();
    return {
      text,
      rect: {
        left: rect.right,
        right: rect.right,
        top: rect.bottom,
        bottom: rect.bottom
      }
    };
  }

  function getLastUsefulRect(range) {
    const rects = Array.from(range.getClientRects ? range.getClientRects() : []);
    for (let index = rects.length - 1; index >= 0; index -= 1) {
      const rect = rects[index];
      if (rect && rect.width >= 0 && rect.height >= 0) return rect;
    }
    const rect = range.getBoundingClientRect ? range.getBoundingClientRect() : null;
    return rect && (rect.width || rect.height) ? rect : null;
  }

  function getSelectionDetails() {
    const selection = window.getSelection?.();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString();
      if (text.trim()) {
        const range = selection.getRangeAt(selection.rangeCount - 1);
        const rect = getLastUsefulRect(range);
        if (rect) {
          return { text, rect };
        }
      }
    }

    return getActiveInputSelection();
  }

  function ensureBubble() {
    if (bubble) return bubble;

    root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      document.documentElement.appendChild(root);
    }

    shadow = root.shadowRoot || root.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
        }

        .bubble {
          position: fixed;
          z-index: 2147483647;
          display: none;
          max-width: min(540px, calc(100vw - 24px));
          color: #111111;
          font-family: "Microsoft YaHei", "微软雅黑", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 15px;
          line-height: 1.5;
          filter: drop-shadow(0 18px 36px rgba(0, 0, 0, .2));
        }

        .bubble.is-visible {
          display: block;
        }

        .bar,
        .result {
          border: 1px solid rgba(0, 0, 0, .18);
          border-radius: 14px;
          background: rgba(255, 255, 255, .9);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .82), 0 18px 44px rgba(0, 0, 0, .14);
          backdrop-filter: blur(18px) saturate(1.12);
          -webkit-backdrop-filter: blur(18px) saturate(1.12);
        }

        .bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px;
        }

        .action {
          height: 32px;
          min-width: 96px;
          padding: 0 14px;
          border: 1px solid #111111;
          border-radius: 999px;
          background: rgba(255, 255, 255, .95);
          color: #111111;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .action.primary {
          border-color: rgb(56, 125, 201);
          background: rgb(56, 125, 201);
          color: #ffffff;
        }

        .action.ask {
          border-color: #111111;
          background: #111111;
          color: #ffffff;
        }

        .action:hover,
        .action:focus-visible {
          outline: 2px solid rgba(0, 0, 0, .18);
          outline-offset: 2px;
        }

        .result {
          display: none;
          width: min(540px, calc(100vw - 24px));
          overflow: hidden;
          position: relative;
        }

        .bubble.has-result .bar {
          display: none;
        }

        .bubble.has-result .result {
          display: block;
        }

        .close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          width: 26px;
          height: 26px;
          border: 1px solid rgba(0, 0, 0, .24);
          border-radius: 999px;
          background: rgba(255, 255, 255, .9);
          color: #111111;
          font: inherit;
          line-height: 1;
          cursor: pointer;
        }

        .reply {
          max-height: min(468px, 68vh);
          overflow: auto;
          padding: 22px 54px 22px 24px;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          color: #111111;
          font-size: 16px;
          line-height: 1.72;
        }

        .reply strong {
          font-weight: 800;
        }

        .reply.is-muted {
          color: #6b7280;
        }
      </style>
      <div class="bubble" part="bubble">
        <div class="bar">
          <button class="action primary" type="button" data-action="translate" title="翻译成中文">${TRANSLATE_LABEL}</button>
          <button class="action ask" type="button" data-action="explain" title="Ask GPT">${EXPLAIN_LABEL}</button>
        </div>
        <div class="result">
          <button class="close" type="button" aria-label="关闭">x</button>
          <div class="reply is-muted">等待回答返回...</div>
        </div>
      </div>
    `;

    bubble = shadow.querySelector(".bubble");
    replyBox = shadow.querySelector(".reply");
    closeButton = shadow.querySelector(".close");

    shadow.querySelectorAll("[data-action], [data-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action || "";
        sendSelection(action || Number(button.dataset.preset || 1));
      });
    });

    closeButton.addEventListener("click", hideBubble);
    return bubble;
  }

  function positionBubble(rect) {
    const element = ensureBubble();
    element.classList.add("is-visible");
    element.style.left = "0px";
    element.style.top = "0px";

    const margin = 12;
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const width = element.offsetWidth || 210;
    const height = element.offsetHeight || 52;
    const anchorX = Number(rect?.right || rect?.left || margin);
    const anchorY = Number(rect?.bottom || rect?.top || margin);

    const left = clamp(anchorX + 8, margin, Math.max(margin, viewportWidth - width - margin));
    const lowerTop = anchorY + 8;
    const top = lowerTop + height + margin > viewportHeight
      ? clamp(Number(rect?.top || anchorY) - height - 8, margin, Math.max(margin, viewportHeight - height - margin))
      : clamp(lowerTop, margin, Math.max(margin, viewportHeight - height - margin));

    element.style.left = `${Math.round(left)}px`;
    element.style.top = `${Math.round(top)}px`;
  }

  function showBubble(details) {
    if (!enabled || isCurrentUrlExcluded() || !details || !details.text.trim()) {
      hideBubble();
      return;
    }

    currentSelection = {
      text: details.text,
      rect: details.rect
    };
    currentRequestId = "";
    const element = ensureBubble();
    element.classList.remove("has-result");
    renderReplyText("等待回答返回...");
    replyBox.classList.add("is-muted");
    positionBubble(details.rect);
  }

  function hideBubble() {
    if (bubble) {
      bubble.classList.remove("is-visible", "has-result");
    }
    currentRequestId = "";
  }

  function hideBubbleForPageMove() {
    if (currentRequestId && bubble?.classList.contains("has-result")) return;
    hideBubble();
  }

  function scheduleSelectionCheck(delay = 80) {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (currentRequestId && bubble?.classList.contains("has-result")) return;
      showBubble(getSelectionDetails());
    }, delay);
  }

  function renderReplyText(message) {
    const text = String(message || "");
    replyBox.replaceChildren();

    const parts = text.split("**");
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      if (!part) continue;

      const isBold = index % 2 === 1 && index < parts.length - 1;
      if (isBold) {
        const strong = document.createElement("strong");
        strong.textContent = part;
        replyBox.appendChild(strong);
      } else {
        replyBox.appendChild(document.createTextNode(part));
      }
    }

    if (!replyBox.childNodes.length) {
      replyBox.appendChild(document.createTextNode(""));
    }
  }

  function setResultState(status, message) {
    const element = ensureBubble();
    element.classList.add("is-visible", "has-result");
    renderReplyText(status === "发送失败" && message ? `${status}\n${message}` : message);
    const waitingText = !message || message === "GPT 正在回答..." || message === "等待回答返回..." || message.includes("正在");
    replyBox.classList.toggle("is-muted", waitingText);
    if (currentSelection?.rect) {
      positionBubble(currentSelection.rect);
    }
  }

  function sendRuntimeMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || "发送失败。"));
          return;
        }
        resolve(response);
      });
    });
  }

  async function sendSelection(target, forcedText, forcedRequestId) {
    const text = String(forcedText || currentSelection?.text || "").trim();
    if (!text) {
      hideBubble();
      return;
    }

    currentRequestId = forcedRequestId || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
    setResultState("GPT 正在回答", "GPT 正在回答...");

    try {
      const response = await sendRuntimeMessage({
        type: "SELECTION_BUBBLE_SEND_TO_GPT",
        payload: {
          requestId: currentRequestId,
          ...(typeof target === "string" ? { action: target } : { presetIndex: Number(target || 1) }),
          text
        }
      });

      if (!response || !response.ok) {
        throw new Error(response && response.error ? response.error : "发送失败。");
      }

      if (response.reply && response.requestId === currentRequestId) {
        setResultState("", response.reply);
      }
    } catch (error) {
      if (!currentRequestId) return;
      setResultState("发送失败", String(error && error.message ? error.message : error));
    }
  }

  function loadEnabledState() {
    chrome.storage.sync.get(DEFAULTS, (items) => {
      enabled = items.selectionBubbleEnabled !== false;
      excludedUrls = normalizeExcludedUrls(items.selectionBubbleExcludedUrls);
      if (!enabled || isCurrentUrlExcluded()) hideBubble();
    });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") return;
    if (changes.selectionBubbleEnabled) {
      enabled = changes.selectionBubbleEnabled.newValue !== false;
    }
    if (changes.selectionBubbleExcludedUrls) {
      excludedUrls = normalizeExcludedUrls(changes.selectionBubbleExcludedUrls.newValue);
    }
    if (!enabled || isCurrentUrlExcluded()) hideBubble();
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) return;

    if (message.type === "GPT_QUICK_SEARCH_GET_SELECTION") {
      if (isCurrentUrlExcluded()) {
        sendResponse({ ok: true, text: "" });
        return;
      }
      const details = getSelectionDetails();
      sendResponse({
        ok: true,
        text: details?.text || ""
      });
      return;
    }

    if (message.type === "GPT_QUICK_SEARCH_START_FROM_COMMAND") {
      if (isCurrentUrlExcluded()) {
        sendResponse({ ok: true });
        return;
      }
      const payload = message.payload || {};
      const details = getSelectionDetails() || currentSelection;
      currentSelection = {
        text: payload.text || details?.text || "",
        rect: details?.rect || currentSelection?.rect || {
          left: window.innerWidth / 2,
          right: window.innerWidth / 2,
          top: window.innerHeight / 2,
          bottom: window.innerHeight / 2
        }
      };
      sendSelection(Number(payload.presetIndex || 1), currentSelection.text, payload.requestId).catch(() => {});
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "GPT_QUICK_SEARCH_STATUS") {
      const payload = message.payload || {};
      if (payload.requestId && currentRequestId && payload.requestId !== currentRequestId) {
        sendResponse({ ok: true });
        return;
      }
      if (payload.requestId) currentRequestId = payload.requestId;
      if (payload.status === "done") {
        setResultState("", payload.reply || "");
      } else if (payload.status === "error") {
        setResultState("发送失败", payload.error || "发送失败。");
      } else if (payload.status === "answering") {
        setResultState("GPT 正在回答", payload.reply || payload.message || "GPT 正在回答...");
      } else if (payload.message) {
        setResultState("正在发送到 GPT...", payload.message);
      }
      sendResponse({ ok: true });
    }
  });

  document.addEventListener("mouseup", () => scheduleSelectionCheck(), true);
  document.addEventListener("keyup", () => scheduleSelectionCheck(), true);
  document.addEventListener("selectionchange", () => scheduleSelectionCheck(120), true);
  document.addEventListener("scroll", hideBubbleForPageMove, true);
  window.addEventListener("resize", hideBubbleForPageMove);
  document.addEventListener("mousedown", (event) => {
    if (!bubble || !bubble.classList.contains("is-visible")) return;
    const path = event.composedPath ? event.composedPath() : [];
    if (path.includes(root) || path.includes(bubble)) return;
    hideBubble();
  }, true);

  loadEnabledState();
})();
