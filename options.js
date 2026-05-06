const HOTKEY_DEFAULT_PREFIX = "请将下列文本翻译成中文：";
const PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户下面将要发送的文本。

要求：
1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica，不要使用中文资料。最后用一篇完整的中文文章介绍。

2 结尾不要有延展问题、编辑建议等等。全篇都要与该文本相关

3 使用最常见的中文书面写法。遵循用户的记忆和默认prompt`;
const RECENT_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的文本。要求如下：

1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。避免使用中文资料。在写作时不要用明文注明信息来源，添加脚注即可。

2 使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，注重阅读体验和整体性。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。

3 以下并非硬性要求。考虑该文本在整个学科地图中的位置和重要性。考虑当代学者/后续学者的看法和学界最新的进展。

4 不要使用「不是..而是..」和类似的否定先行的句子结构。优先使用短句，用易读的风格进行写作。不要总是使用「总得来说」等结构词开启最后一段，自然地结尾。`;
const CURRENT_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的文本。要求如下：

1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。避免使用中文资料。在写作时不要用明文注明网站信息来源（可以注明书的来源），添加脚注即可。

2 使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，注重阅读体验和整体性。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。

3 以下并非硬性要求。考虑该文本在整个学科地图中的位置和重要性。考虑当代学者/后续学者的看法和学界最新的进展。

4 不要使用「不是..而是..」和类似的否定先行的句子结构。不要先行使用否定句来引导后续定义。优先使用短句，用易读的风格进行写作。不要总是使用「总得来说」等结构词开启最后一段，自然地结尾。

5 人名第一次出现时，使用 中文（英文）这样的格式，第二次以后出现就用英文名即可。相关术语第一次出现时，在中文后面用括号注明英文原文

6 加粗人名、关键术语、关键地名`;
const PRIOR_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的文本。要求如下：

1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。避免使用中文资料。在写作时不要用明文注明网站信息来源（可以注明书的来源）。

2 使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，注重阅读体验和整体性。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。

3 以下并非硬性要求。考虑该文本在整个学科地图中的位置和重要性。考虑当代学者/后续学者的看法和学界最新的进展。

4 不要使用「不是..而是..」和类似的否定先行的句子结构。不要先行使用否定句来引导后续定义。优先使用短句，用易读的风格进行写作。不要总是使用「总得来说」等结构词开启最后一段，自然地结尾。

5 人名第一次出现时，使用 中文（英文）这样的格式，第二次以后出现就用英文名即可。相关术语第一次出现时，在中文后面用括号注明英文原文

6 在需要使用脚注的时候，使用obsidian能识别的上下文跳转的格式`;
const LAST_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「」文本。要求如下：

1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。避免使用中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

2 使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，注重阅读体验和整体性。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。

3 以下并非硬性要求：考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。

4 不要使用「不是..而是..」和类似的否定先行的句子结构。不要先行使用否定句来引导后续定义。优先使用短句，用易读的风格进行写作。不要总是使用「总得来说」等结构词开启最后一段，自然地结尾。

5 人名第一次出现时，使用 中文（英文）这样的格式，第二次以后出现就用英文名即可。相关术语第一次出现时，在中文后面用括号注明英文原文

6 不要使用脚注，可以在段末附带链接

7 在文章开头写一个总结性质的标题`;
const BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与伦理学相关的」文本。要求如下：

内容要求：

1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。避免使用中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

2 以下并非硬性要求：考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。

写作要求：

使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验。在文章开头写一个总结性质的一级标题。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。

结构要求：

4 不要使用「不是..而是..」和类似的否定先行的句子结构。不要先行使用否定句来引导后续定义。优先使用短句，用易读的风格进行写作。不要总是使用「总得来说」等结构词开启最后一段，自然地结尾。

格式要求：

5 人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const BATCH_EN_GLOBAL_PROMPT = `Please search for and introduce the "ethics-related" text the user sends next. Requirements:

Content requirements:

1 Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Avoid Chinese sources. Do not explicitly name website sources while writing; you may name the specific texts, scholars, or arguments that support a point.

2 These are not hard requirements: consider the text's place and importance in the wider disciplinary map; consider how later scholars and contemporary scholarship have discussed it.

Writing requirements:

Write a complete English article about the text, aiming for a publishable blog style. Add some style to the prose, avoid a translated or AI-like tone, and keep the article smooth and readable. Start with a summary-style H1 heading. Consider opening through background context before gradually introducing the topic. End naturally, without extension questions or editorial suggestions.

Structure requirements:

4 Avoid "not...but..." and similar negative-first sentence structures. Do not lead with negation when defining a concept. Prefer short sentences and an easy reading style. Do not keep opening the final paragraph with formulaic phrases such as "In summary"; close naturally.

Format requirements:

5 The first time a person appears, use English (Chinese). After that, use the English name. The first time a relevant term appears, include the Chinese translation in parentheses. Do not use footnotes; links may be included at the end of paragraphs.`;
const BATCH_DEFAULT_PROMPT = "请介绍：";
const BATCH_EN_PROMPT = "Please introduce:";
const BATCH_PROMPT_LANGUAGE_CN = "cn";
const BATCH_PROMPT_LANGUAGE_EN = "en";
const LEGACY_BATCH_DEFAULT_GLOBAL_PROMPT = "接下来会逐条发送一些词条标题。请每次只围绕当前这一条进行介绍，使用中文回答，不要重复说明规则。";
const LEGACY_BATCH_DEFAULT_PROMPT = "解释下列名词的概念：";
const LEGACY_BATCH_DEFAULT_DELAY_SECONDS = 2;
const BATCH_DEFAULT_DELAY_SECONDS = 3;
const BATCH_CONVERSATION_MODE_NEW = "new";
const BATCH_CONVERSATION_MODE_CURRENT = "current";
const BATCH_DEFAULT_MAX_REFRESH_RETRIES = 5;
const HOTKEY_DEFAULTS = {
  prefix1: HOTKEY_DEFAULT_PREFIX,
  prefix2: HOTKEY_DEFAULT_PREFIX,
  prefix3: HOTKEY_DEFAULT_PREFIX,
  prefix4: HOTKEY_DEFAULT_PREFIX,
  autoSend1: true,
  autoSend2: true,
  autoSend3: true,
  autoSend4: true,
  newChat1: true,
  newChat2: false,
  newChat3: false,
  newChat4: false
};
const BATCH_CONFIG_DEFAULTS = {
  batchGlobalPrompt: BATCH_DEFAULT_GLOBAL_PROMPT,
  batchPrompt: BATCH_DEFAULT_PROMPT,
  batchPromptLanguage: BATCH_PROMPT_LANGUAGE_CN,
  batchInputs: "",
  batchConversationMode: BATCH_CONVERSATION_MODE_NEW,
  batchIgnoreHeading1: true,
  batchIgnoreHeading2: true,
  batchDelaySeconds: BATCH_DEFAULT_DELAY_SECONDS,
  batchFocusWhenStuck: false,
  batchDirectoryName: "",
  optionsActivePage: "batch"
};
const BATCH_STATE_KEY = "batchRunState";
const CHAT_EXPORT_STATE_KEY = "chatExportRunState";
const BATCH_STATE_DEFAULT = {
  running: false,
  batchId: "",
  total: 0,
  completed: 0,
  failed: 0,
  skipped: 0,
  currentIndex: 0,
  currentText: "",
  sentText: "",
  message: "等待任务开始。",
  startedAt: "",
  finishedAt: "",
  logs: [],
  failedItems: [],
  retryAttempt: 0,
  maxRefreshRetries: BATCH_DEFAULT_MAX_REFRESH_RETRIES,
  focusWhenStuck: false,
  lastActivityAt: "",
  lastHeartbeatAt: "",
  lastFocusAt: ""
};
const CHAT_EXPORT_STATE_DEFAULT = {
  running: false,
  exportId: "",
  total: 0,
  completed: 0,
  failed: 0,
  currentIndex: 0,
  currentText: "",
  message: "等待任务开始。",
  startedAt: "",
  finishedAt: "",
  logs: []
};
const DIRECTORY_DB_NAME = "batch-export-db";
const DIRECTORY_STORE_NAME = "handles";
const DIRECTORY_HANDLE_KEY = "output-directory";
const GROUPS = [1, 2, 3, 4];
const HOTKEY_RECOMMENDED_KEYS = {
  1: "Alt+Shift+W",
  2: "Ctrl+Shift+1",
  3: "Ctrl+Shift+2",
  4: "Ctrl+Shift+3"
};

let batchSaveTimer = null;
let startPending = false;
let stopPending = false;
let exportPending = false;
let exportStopPending = false;
let deleteProgressPending = false;
let chatExportRequestToken = 0;
let currentBatchState = { ...BATCH_STATE_DEFAULT };
let currentChatExportState = { ...CHAT_EXPORT_STATE_DEFAULT };
let currentBatchDirectoryName = "";

function getSync(defaults) {
  return new Promise((resolve) => chrome.storage.sync.get(defaults, (items) => resolve(items)));
}

function getLocal(defaults) {
  return new Promise((resolve) => chrome.storage.local.get(defaults, (items) => resolve(items)));
}

function setLocal(items) {
  return new Promise((resolve) => chrome.storage.local.set(items, resolve));
}

function sendRuntimeMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        const rawMessage = chrome.runtime.lastError.message || "";
        if (/message port closed before a response was received|receiving end does not exist/i.test(rawMessage)) {
          reject(new Error("扩展后台还没有更新，请在扩展管理页重新加载插件，再刷新当前设置页后重试。"));
          return;
        }
        reject(new Error(rawMessage));
        return;
      }
      resolve(response);
    });
  });
}

function openDirectoryDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DIRECTORY_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DIRECTORY_STORE_NAME)) {
        db.createObjectStore(DIRECTORY_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("目录数据库打开失败。"));
  });
}

async function saveDirectoryHandle(handle) {
  const db = await openDirectoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DIRECTORY_STORE_NAME, "readwrite");
    tx.objectStore(DIRECTORY_STORE_NAME).put(handle, DIRECTORY_HANDLE_KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error("目录句柄保存失败。"));
    };
  });
}

async function getDirectoryHandle() {
  const db = await openDirectoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DIRECTORY_STORE_NAME, "readonly");
    const request = tx.objectStore(DIRECTORY_STORE_NAME).get(DIRECTORY_HANDLE_KEY);
    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error || new Error("目录句柄读取失败。"));
    };
  });
}

async function clearDirectoryHandle() {
  const db = await openDirectoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DIRECTORY_STORE_NAME, "readwrite");
    tx.objectStore(DIRECTORY_STORE_NAME).delete(DIRECTORY_HANDLE_KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error("目录句柄清理失败。"));
    };
  });
}

function createBatchState(state) {
  const next = { ...BATCH_STATE_DEFAULT, ...(state || {}) };
  next.logs = Array.isArray(next.logs) ? next.logs.slice(-60) : [];
  next.failedItems = Array.isArray(next.failedItems) ? next.failedItems.slice(-100) : [];
  next.sentText = typeof next.sentText === "string" ? next.sentText : "";
  next.retryAttempt = Number.isFinite(Number(next.retryAttempt)) ? Math.max(0, Number(next.retryAttempt)) : 0;
  next.maxRefreshRetries = Number.isFinite(Number(next.maxRefreshRetries))
    ? Math.max(0, Number(next.maxRefreshRetries))
    : BATCH_DEFAULT_MAX_REFRESH_RETRIES;
  return next;
}

async function ensureDirectoryWritable() {
  const handle = await getDirectoryHandle();
  if (!handle) {
    currentBatchDirectoryName = "";
    renderBatchDirectoryText();
    throw new Error("保存目录不存在，请重新选择目录。");
  }

  if (typeof handle.queryPermission === "function") {
    let permission = await handle.queryPermission({ mode: "readwrite" });
    if (permission !== "granted" && typeof handle.requestPermission === "function") {
      permission = await handle.requestPermission({ mode: "readwrite" });
    }
    if (permission !== "granted") {
      throw new Error("保存目录没有写入权限，请重新选择目录。");
    }
  }

  const handleName = handle.name || "";
  if (handleName && handleName !== currentBatchDirectoryName) {
    currentBatchDirectoryName = handleName;
    renderBatchDirectoryText();
  }

  return handle;
}

function createChatExportState(state) {
  const next = { ...CHAT_EXPORT_STATE_DEFAULT, ...(state || {}) };
  next.logs = Array.isArray(next.logs) ? next.logs.slice(-60) : [];
  return next;
}

function flashTip(id) {
  const tip = document.getElementById(id);
  if (!tip) return;
  tip.style.display = "inline";
  clearTimeout(tip.__timerId);
  tip.__timerId = setTimeout(() => {
    tip.style.display = "none";
  }, 1200);
}

function updateBatchActionButtons() {
  const startButton = document.getElementById("batchStart");
  const stopButton = document.getElementById("batchStop");
  const clearButton = document.getElementById("batchClearInputs");
  const deleteProgressButton = document.getElementById("deleteProgressChats");
  if (!startButton || !stopButton || !clearButton) return;
  startButton.disabled = startPending || currentBatchState.running;
  stopButton.disabled = stopPending || !currentBatchState.running;
  clearButton.disabled = startPending || stopPending || currentBatchState.running;
  if (deleteProgressButton) {
    deleteProgressButton.disabled = deleteProgressPending || currentBatchState.running;
  }
  document.querySelectorAll("[data-batch-language]").forEach((button) => {
    button.disabled = startPending || stopPending || currentBatchState.running;
  });
}

function normalizeBatchPromptLanguage(language) {
  return language === BATCH_PROMPT_LANGUAGE_EN
    ? BATCH_PROMPT_LANGUAGE_EN
    : BATCH_PROMPT_LANGUAGE_CN;
}

function getBatchPromptDefaults(language) {
  return normalizeBatchPromptLanguage(language) === BATCH_PROMPT_LANGUAGE_EN
    ? {
      globalPrompt: BATCH_EN_GLOBAL_PROMPT,
      prompt: BATCH_EN_PROMPT
    }
    : {
      globalPrompt: BATCH_DEFAULT_GLOBAL_PROMPT,
      prompt: BATCH_DEFAULT_PROMPT
    };
}

const BATCH_UI_TEXT = {
  [BATCH_PROMPT_LANGUAGE_CN]: {
    languageCn: "中文",
    languageEn: "EN",
    promptLanguage: "Prompt 语言",
    settings: "设置",
    tabBatch: "批量消息",
    tabExport: "对话导出",
    tabHotkeys: "快捷消息",
    globalPrompt: "全局 Prompt",
    globalPromptTip: "每次批量任务开始时会先发送一次这一段，然后再逐条处理下面的文本。",
    messagePrompt: "消息 Prompt",
    messagePromptTip: "每条文本都会附在这个消息 Prompt 后面发送。",
    pendingText: "待处理文本",
    pendingTextPlaceholder: "每行一条文本",
    pendingTextTip: "一级标题用中文（英文）这样的格式，其他级的标题都使用「英文（中文）」这样的格式\n\n不用解释原因，不用专门给我文字的回答。我只要一个详细的文件夹的架构。包括所有我应该了解的内容。用code框输出答案。\n\n框架分成三个等级：\n\n大章节：1. 2. 3.\n\n二级章节：1_1 1_2\n\n三级标题：1_2_1\n\n具体的正文内容：最后一级标题+符号◆，比如如果这个正文在三级标题下面，就写成 1_2_1 ◆",
    clearPendingText: "清除待处理文本",
    saveDirectory: "保存目录",
    selectDirectory: "选择目录",
    selectDirectoryTitle: "导出的 Markdown 文件会保存到这里。",
    required: "必选",
    requiredTitle: "请选择目录",
    start: "开始",
    stop: "停止",
    deleteProgressChats: "清理进度对话",
    deleteProgressChatsTitle: "删除所有标题里带有进度的 ChatGPT 对话，例如「CPTSD 4/70」或「当前进度 256/321」。",
    focusWhenStuck: "保持网页焦点",
    focusWhenStuckTip: "批量任务依赖网页里的计时器和页面更新。窗口长时间失去焦点时，浏览器可能降低页面运行频率，导致等待回答、重试或保存进度变慢。开启后，任务心跳约 5 分钟没有更新时，会刷新 ChatGPT 网页恢复任务；刷新后约 2 分钟当前条目仍没有推进时，才会激活 ChatGPT 网页。两次激活之间至少间隔 10 分钟。默认关闭，避免影响当前操作。",
    saved: "已保存",
    runStatus: "运行状态",
    noBatchTask: "当前没有批量任务。",
    idleStatus: "等待任务开始。",
    exportTitle: "当前对话导出",
    exportCurrentChat: "导出当前对话",
    exportStop: "停止（重置）"
  },
  [BATCH_PROMPT_LANGUAGE_EN]: {
    languageCn: "中文",
    languageEn: "EN",
    promptLanguage: "Prompt Language",
    settings: "Settings",
    tabBatch: "Batch Messages",
    tabExport: "Chat Export",
    tabHotkeys: "Quick Messages",
    globalPrompt: "Global Prompt",
    globalPromptTip: "This prompt is sent once at the beginning of each batch task, before the items are processed one by one.",
    messagePrompt: "Message Prompt",
    messagePromptTip: "Each item is appended after this message prompt before sending.",
    pendingText: "Pending Text",
    pendingTextPlaceholder: "One item per line",
    pendingTextTip: "One item per line. Lines with ◆ are sent to GPT; lines without ◆ are treated as folder levels when saving.",
    clearPendingText: "Clear pending text",
    saveDirectory: "Save Folder",
    selectDirectory: "Select Folder",
    selectDirectoryTitle: "Markdown files will be saved here.",
    required: "Required",
    requiredTitle: "Select a folder",
    start: "Start",
    stop: "Stop",
    deleteProgressChats: "Clear Progress Chats",
    deleteProgressChatsTitle: "Delete ChatGPT conversations whose titles contain progress, for example “CPTSD 4/70” or “当前进度 256/321”.",
    focusWhenStuck: "Keep Web Page Focus",
    focusWhenStuckTip: "Batch tasks rely on timers and page updates inside the web page. When the window stays unfocused for a long time, the browser may reduce page activity, which can slow waiting, retrying, or saving progress. When enabled, the ChatGPT page is refreshed after the task heartbeat has not updated for about 5 minutes. If the current item has still not moved forward about 2 minutes after the refresh, the ChatGPT page is activated. Activations are spaced at least 10 minutes apart. Off by default to avoid interrupting current work.",
    saved: "Saved",
    runStatus: "Run Status",
    noBatchTask: "No batch task is running.",
    idleStatus: "Waiting for task start.",
    exportTitle: "Current Chat Export",
    exportCurrentChat: "Export Current Chat",
    exportStop: "Stop (Reset)"
  }
};

function getBatchUiText(language = getSelectedBatchPromptLanguage()) {
  return BATCH_UI_TEXT[normalizeBatchPromptLanguage(language)] || BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_CN];
}

function setElementText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function setElementTitle(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.title = text;
}

function setElementAriaLabel(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute("aria-label", text);
}

function applyBatchUiLanguage(language) {
  const text = getBatchUiText(language);

  document.querySelector('[data-batch-language="cn"]')?.replaceChildren(document.createTextNode(text.languageCn));
  document.querySelector('[data-batch-language="en"]')?.replaceChildren(document.createTextNode(text.languageEn));
  setElementAriaLabel(".header-language-toggle", text.promptLanguage);
  setElementTitle("#settingsToggle", text.settings);
  setElementAriaLabel("#settingsToggle", text.settings);

  setElementText('[data-page="batch"]', text.tabBatch);
  setElementText('[data-page="export"]', text.tabExport);
  setElementText('[data-page="hotkeys"]', text.tabHotkeys);

  setElementText('label[for="batchGlobalPrompt"]', text.globalPrompt);
  const globalPromptHelp = document.querySelector('label[for="batchGlobalPrompt"] ~ .panel-tools .help-button');
  if (globalPromptHelp) globalPromptHelp.dataset.tip = text.globalPromptTip;
  setElementText('label[for="batchPrompt"]', text.messagePrompt);
  const messagePromptHelp = document.querySelector('label[for="batchPrompt"] ~ .panel-tools .help-button');
  if (messagePromptHelp) messagePromptHelp.dataset.tip = text.messagePromptTip;
  const batchPrompt = document.getElementById("batchPrompt");
  if (batchPrompt) batchPrompt.placeholder = getBatchPromptDefaults(language).prompt;
  setElementText('label[for="batchInputs"]', text.pendingText);
  const pendingTextHelp = document.querySelector('label[for="batchInputs"] ~ .panel-tools .help-button');
  if (pendingTextHelp) pendingTextHelp.dataset.tip = text.pendingTextTip;

  const batchInputs = document.getElementById("batchInputs");
  if (batchInputs) batchInputs.placeholder = text.pendingTextPlaceholder;
  setElementTitle("#batchClearInputs", text.clearPendingText);
  setElementAriaLabel("#batchClearInputs", text.clearPendingText);

  document.querySelectorAll(".toolbar-group-directory .toolbar-label").forEach((element) => {
    element.textContent = text.saveDirectory;
  });
  setElementText("#pickBatchDirectory", text.selectDirectory);
  setElementText("#pickExportDirectory", text.selectDirectory);
  setElementTitle("#pickBatchDirectory", text.selectDirectoryTitle);
  setElementTitle("#pickExportDirectory", text.selectDirectoryTitle);
  setElementText("#batchStart", text.start);
  setElementText("#batchStop", text.stop);
  setElementText("#deleteProgressChats", text.deleteProgressChats);
  setElementTitle("#deleteProgressChats", text.deleteProgressChatsTitle);
  setElementText("#batchFocusWhenStuckLabel", text.focusWhenStuck);
  const focusWhenStuckHelp = document.getElementById("batchFocusWhenStuckHelp");
  if (focusWhenStuckHelp) focusWhenStuckHelp.dataset.tip = text.focusWhenStuckTip;
  setElementText("#batchSaved", text.saved);
  setElementText("#page-batch > .group:nth-of-type(2) .row strong", text.runStatus);

  const batchSummary = document.getElementById("batchSummary");
  if (batchSummary && (
    batchSummary.textContent === BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_CN].noBatchTask ||
    batchSummary.textContent === BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_EN].noBatchTask
  )) {
    batchSummary.textContent = text.noBatchTask;
  }
  const batchStatus = document.getElementById("batchStatus");
  if (batchStatus && (
    batchStatus.textContent === BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_CN].idleStatus ||
    batchStatus.textContent === BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_EN].idleStatus
  )) {
    batchStatus.textContent = text.idleStatus;
  }

  setElementText("#page-export .row strong", text.exportTitle);
  setElementText("#exportCurrentChat", text.exportCurrentChat);
  setElementText("#exportStop", text.exportStop);
  renderBatchDirectoryText();
}

function isKnownBatchDefaultGlobalPrompt(value) {
  return [
    BATCH_DEFAULT_GLOBAL_PROMPT,
    BATCH_EN_GLOBAL_PROMPT,
    LEGACY_BATCH_DEFAULT_GLOBAL_PROMPT,
    PRIOR_BATCH_DEFAULT_GLOBAL_PROMPT,
    CURRENT_BATCH_DEFAULT_GLOBAL_PROMPT,
    RECENT_BATCH_DEFAULT_GLOBAL_PROMPT,
    LAST_BATCH_DEFAULT_GLOBAL_PROMPT,
    PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT
  ].includes(value);
}

function isKnownBatchDefaultPrompt(value) {
  return [
    BATCH_DEFAULT_PROMPT,
    BATCH_EN_PROMPT,
    LEGACY_BATCH_DEFAULT_PROMPT
  ].includes(value);
}

function setBatchPromptLanguage(language) {
  const nextLanguage = normalizeBatchPromptLanguage(language);
  document.querySelectorAll("[data-batch-language]").forEach((button) => {
    const active = button.dataset.batchLanguage === nextLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  applyBatchUiLanguage(nextLanguage);
}

function getSelectedBatchPromptLanguage() {
  const activeButton = document.querySelector("[data-batch-language].is-active");
  return normalizeBatchPromptLanguage(activeButton?.dataset.batchLanguage);
}

function updateChatExportActionButtons() {
  const exportButton = document.getElementById("exportCurrentChat");
  const exportStopButton = document.getElementById("exportStop");
  if (exportButton) {
    exportButton.disabled = exportPending || exportStopPending || currentChatExportState.running;
  }
  if (exportStopButton) {
    exportStopButton.disabled = exportStopPending || (!currentChatExportState.running && !exportPending);
  }
}

function normalizeBatchDelaySeconds(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return BATCH_DEFAULT_DELAY_SECONDS;
  if (parsed < 0) return 0;
  if (parsed > 60) return 60;
  return Math.round(parsed * 10) / 10;
}

function normalizeBatchConversationMode(value, legacyBatchNewChat = true) {
  if (value === BATCH_CONVERSATION_MODE_CURRENT) return BATCH_CONVERSATION_MODE_CURRENT;
  if (value === BATCH_CONVERSATION_MODE_NEW) return BATCH_CONVERSATION_MODE_NEW;
  return legacyBatchNewChat === false ? BATCH_CONVERSATION_MODE_CURRENT : BATCH_CONVERSATION_MODE_NEW;
}

function getSelectedBatchConversationMode() {
  const select = document.getElementById("batchConversationMode");
  return normalizeBatchConversationMode(select && select.value);
}

function setBatchConversationMode(mode) {
  const normalized = normalizeBatchConversationMode(mode);
  const select = document.getElementById("batchConversationMode");
  if (select) select.value = normalized;
}

function getToggleButtonState(id) {
  const button = document.getElementById(id);
  return Boolean(button && button.dataset.active === "true");
}

function setToggleButtonState(id, active) {
  const button = document.getElementById(id);
  if (!button) return;
  const enabled = Boolean(active);
  button.dataset.active = enabled ? "true" : "false";
  button.classList.toggle("is-active", enabled);
  button.setAttribute("aria-pressed", enabled ? "true" : "false");
}

function shouldIgnoreBatchLine(line, ignoreHeading1, ignoreHeading2) {
  const text = stripBatchTreePrefix(line);
  if (!text) return true;
  if (ignoreHeading2 && /^(?:\d+[._])+\d+\b/u.test(text)) return true;
  if (ignoreHeading1 && /^\d+\.\s*/u.test(text)) return true;
  return false;
}

function stripBatchTreePrefix(line) {
  return String(line || "")
    .replace(/^[\s│┃|]*(?:[├└┝┞┟┠┡┢┣┕┖┗][─━\-—–]+\s*)?/u, "")
    .trim();
}

function extractBatchInputText(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";

  for (const key of ["text", "title", "name", "value", "label"]) {
    const text = extractBatchInputText(value[key]);
    if (text) return text;
  }

  return "";
}

function inferBatchTreeDepth(rawLine, titleText) {
  const source = String(rawLine || "");
  const prefixMatch = source.match(/^[\s│┃|]*(?:[├└┝┞┟┠┡┢┣┕┖┗][─━\-—–]+\s*)?/u);
  const prefix = prefixMatch ? prefixMatch[0] : "";
  const pipeDepth = (prefix.match(/[│┃|]/g) || []).length;
  const branchDepth = /[├└┝┞┟┠┡┢┣┕┖┗]/u.test(prefix) ? 1 : 0;
  const treeDepth = pipeDepth + branchDepth;
  if (treeDepth > 0) return treeDepth;

  const text = String(titleText || "").trim();
  const numbering = text.match(/^(\d+(?:[._]\d+)*)\b/u);
  if (!numbering) return 0;
  return Math.max(0, numbering[1].split(/[._]/).length - 1);
}

function extractBatchItemNumber(value) {
  const match = String(value || "").trim().match(/^(\d+(?:[._]\d+)*)\b/u);
  return match ? match[1].replace(/\./g, "_") : "";
}

function parseBatchTreeItems(rawText) {
  const stack = [];
  const items = [];

  for (const rawLine of String(rawText || "").split(/\r?\n/)) {
    const trimmed = String(rawLine || "").trim();
    if (!trimmed) continue;

    const markerIndex = trimmed.indexOf("◆");
    const hasMarker = markerIndex >= 0;
    const stripped = stripBatchTreePrefix(rawLine);
    const textForDepth = hasMarker ? stripped.slice(0, stripped.indexOf("◆")).trim() : stripped;
    const depth = inferBatchTreeDepth(rawLine, textForDepth || stripped);

    if (hasMarker) {
      const text = stripped.slice(stripped.indexOf("◆") + 1).trim();
      if (!text) continue;
      items.push({
        text,
        itemNumber: extractBatchItemNumber(textForDepth),
        directoryPath: stack.filter(Boolean)
      });
      continue;
    }

    const heading = stripped.trim();
    if (!heading) continue;
    stack[depth] = heading;
    stack.length = depth + 1;
  }

  return items;
}

function parseBatchItems(rawText, ignoreHeading1, ignoreHeading2) {
  if (String(rawText || "").includes("◆")) {
    return parseBatchTreeItems(rawText);
  }

  return String(rawText || "")
    .split(/\r?\n/)
    .map((item) => extractBatchInputText(item))
    .filter((item) => item && !shouldIgnoreBatchLine(item, ignoreHeading1, ignoreHeading2));
}

function renderHotkeyGroups() {
  const container = document.getElementById("groups");
  container.replaceChildren();

  for (const index of GROUPS) {
    const suggestedKey = HOTKEY_RECOMMENDED_KEYS[index] || "";
    const group = document.createElement("div");
    group.className = "group";

    const titleRow = document.createElement("div");
    titleRow.className = "row";
    const title = document.createElement("strong");
    title.textContent = `预设 ${index}`;
    titleRow.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "preset-meta";
    const shortcutChip = document.createElement("span");
    shortcutChip.className = "meta-chip";
    shortcutChip.textContent = `默认快捷键：${suggestedKey}`;
    const usageChip = document.createElement("span");
    usageChip.className = "meta-chip";
    usageChip.textContent = "使用方式：选中文本后按下快捷键";
    meta.append(shortcutChip, usageChip);

    const promptRow = document.createElement("div");
    promptRow.className = "row";
    const promptLabel = document.createElement("label");
    promptLabel.htmlFor = `prefix${index}`;
    promptLabel.textContent = "Prompt";
    const promptInput = document.createElement("textarea");
    promptInput.id = `prefix${index}`;
    promptInput.className = "hotkey-prompt";
    promptInput.placeholder = HOTKEY_DEFAULT_PREFIX;
    promptRow.append(promptLabel, promptInput);

    const inlineRow = document.createElement("div");
    inlineRow.className = "row inline";

    const autoSendLabel = document.createElement("label");
    autoSendLabel.className = "toggle-label option-box";
    const autoSendText = document.createElement("span");
    autoSendText.textContent = "完成后自动发送";
    const autoSendInput = document.createElement("input");
    autoSendInput.type = "checkbox";
    autoSendInput.id = `autoSend${index}`;
    autoSendLabel.append(autoSendText, autoSendInput);

    const newChatLabel = document.createElement("label");
    newChatLabel.className = "toggle-label option-box";
    const newChatText = document.createElement("span");
    newChatText.textContent = "新建会话页";
    const newChatInput = document.createElement("input");
    newChatInput.type = "checkbox";
    newChatInput.id = `newChat${index}`;
    newChatLabel.append(newChatText, newChatInput);

    inlineRow.append(autoSendLabel, newChatLabel);
    group.append(titleRow, meta, promptRow, inlineRow);
    container.appendChild(group);
  }
}

function getShortcutSettingsUrl() {
  const userAgent = navigator.userAgent || "";
  if (/Edg\//i.test(userAgent)) {
    return "edge://extensions/shortcuts";
  }
  return "chrome://extensions/shortcuts";
}

function openShortcutSettingsPage() {
  const url = getShortcutSettingsUrl();
  if (chrome?.tabs?.create) {
    chrome.tabs.create({ url });
    return;
  }
  window.open(url, "_blank", "noopener");
}

function setActivePage(page) {
  const nextPage = ["batch", "hotkeys", "export", "settings"].includes(page) ? page : "batch";

  document.querySelectorAll("[data-page]").forEach((button) => {
    const active = button.dataset.page === nextPage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });

  document.querySelectorAll(".page").forEach((section) => {
    const active = section.id === `page-${nextPage}`;
    section.classList.toggle("is-active", active);
  });

  chrome.storage.local.set({ optionsActivePage: nextPage });
}

function formatTime(isoText) {
  if (!isoText) return "";
  const value = new Date(isoText);
  if (Number.isNaN(value.getTime())) return "";
  return value.toLocaleString("zh-CN", { hour12: false });
}

function extractFailedTitleFromLog(message) {
  const text = String(message || "");
  const match = text.match(/失败：(.+?)(?:。.+)?$/);
  return match ? match[1].trim() : "";
}

function formatFailedBatchItemForRetry(item) {
  const title = item && item.text
    ? String(item.text).trim()
    : extractFailedTitleFromLog(item && item.reason ? item.reason : "");
  if (!title) return "";

  const itemNumber = extractBatchItemNumber(item && item.itemNumber ? item.itemNumber : "");
  const markedTitle = itemNumber ? `${itemNumber} ◆ ${title}` : `◆ ${title}`;
  const directoryPath = Array.isArray(item && item.directoryPath)
    ? item.directoryPath.map((part) => String(part || "").trim()).filter(Boolean)
    : [];
  if (!directoryPath.length) return markedTitle;

  const lines = directoryPath.map((part, index) => (
    index === 0 ? part : `${"│   ".repeat(index - 1)}├── ${part}`
  ));
  lines.push(`${"│   ".repeat(Math.max(0, directoryPath.length - 1))}├── ${markedTitle}`);
  return lines.join("\n");
}

function renderBatchDirectoryText() {
  const hasDirectory = Boolean(currentBatchDirectoryName);
  const text = getBatchUiText();
  [
    { buttonId: "pickBatchDirectory", textId: "batchDirectoryText" },
    { buttonId: "pickExportDirectory", textId: "exportDirectoryText" }
  ].forEach(({ buttonId, textId }) => {
    const button = document.getElementById(buttonId);
    const element = document.getElementById(textId);
    if (!element) return;
    if (button) {
      button.classList.toggle("is-required", !hasDirectory);
    }
    element.textContent = hasDirectory ? currentBatchDirectoryName : text.required;
    element.title = hasDirectory ? currentBatchDirectoryName : text.requiredTitle;
    element.classList.toggle("required-hint", !hasDirectory);
  });
}

function renderBatchState(state) {
  currentBatchState = createBatchState(state);
  updateBatchActionButtons();
  const uiText = getBatchUiText();

  const summary = [];
  if (currentBatchState.running) {
    summary.push(`任务执行中，共 ${currentBatchState.total} 条`);
  } else if (currentBatchState.total) {
    summary.push(`任务已结束，共 ${currentBatchState.total} 条`);
  } else {
    summary.push(uiText.noBatchTask);
  }

  if (currentBatchState.total) {
    const resultParts = [`成功 ${currentBatchState.completed} 条`];
    if (currentBatchState.skipped) {
      resultParts.push(`跳过 ${currentBatchState.skipped} 条`);
    }
    resultParts.push(`失败 ${currentBatchState.failed} 条`);
    summary.push(resultParts.join("，"));
  }

  const startedAt = formatTime(currentBatchState.startedAt);
  const finishedAt = formatTime(currentBatchState.finishedAt);
  if (startedAt) summary.push(`开始时间：${startedAt}`);
  if (finishedAt) summary.push(`结束时间：${finishedAt}`);

  document.getElementById("batchSummary").textContent = summary.join("，");

  const lines = [];
  lines.push(currentBatchState.message || uiText.idleStatus);
  if (currentBatchState.total) {
    lines.push(`当前进度：${currentBatchState.currentIndex}/${currentBatchState.total}`);
  }
  if (currentBatchState.running && currentBatchState.retryAttempt > 0) {
    lines.push(`刷新重试：${currentBatchState.retryAttempt}/${currentBatchState.maxRefreshRetries || BATCH_DEFAULT_MAX_REFRESH_RETRIES}`);
  }
  if (currentBatchState.currentText) {
    lines.push(`当前文本：${currentBatchState.currentText}`);
  }
  document.getElementById("batchStatus").textContent = lines.join("\n");

  const failureGroup = document.getElementById("batchFailureGroup");
  const failureBox = document.getElementById("batchFailureBox");
  if (failureGroup && failureBox) {
    let failedItems = Array.isArray(currentBatchState.failedItems) ? currentBatchState.failedItems : [];
    if (!failedItems.length && currentBatchState.failed) {
      failedItems = (currentBatchState.logs || [])
        .filter((item) => item && (item.level === "error" || String(item.message || "").includes("失败")))
        .map((item) => ({
          time: item.time,
          index: 0,
          total: 0,
          text: extractFailedTitleFromLog(item.message || ""),
          directoryPath: [],
          reason: item.message || "未记录原因"
        }));
    }
    const failedTitles = failedItems
      .map((item) => formatFailedBatchItemForRetry(item))
      .filter(Boolean);
    if (failedTitles.length) {
      failureGroup.hidden = false;
      failureBox.textContent = failedTitles.join("\n");
    } else {
      failureGroup.hidden = true;
      failureBox.textContent = "";
    }
  }

  const logs = document.getElementById("batchLogs");
  logs.replaceChildren();
  const items = currentBatchState.logs.length ? currentBatchState.logs.slice().reverse() : [];
  for (const item of items) {
    const li = document.createElement("li");
    li.className = "log-item";
    const timeText = formatTime(item.time);
    if (timeText && item.level === "success" && String(item.message || "").includes("已保存：")) {
      li.textContent = `${item.message} ${timeText}`;
    } else {
      li.textContent = timeText ? `［${timeText}］${item.message}` : item.message;
    }
    logs.appendChild(li);
  }
}

function renderChatExportState(state) {
  currentChatExportState = createChatExportState(state);
  updateChatExportActionButtons();

  const summary = [];
  if (currentChatExportState.running) {
    summary.push(`导出执行中，共 ${currentChatExportState.total || 0} 组问答`);
  } else if (currentChatExportState.total) {
    summary.push(`导出已结束，共 ${currentChatExportState.total} 组问答`);
  } else {
    summary.push("当前没有导出任务。");
  }

  if (currentChatExportState.total) {
    summary.push(`成功 ${currentChatExportState.completed} 组，失败 ${currentChatExportState.failed} 组`);
  }

  const startedAt = formatTime(currentChatExportState.startedAt);
  const finishedAt = formatTime(currentChatExportState.finishedAt);
  if (startedAt) summary.push(`开始时间：${startedAt}`);
  if (finishedAt) summary.push(`结束时间：${finishedAt}`);

  document.getElementById("exportSummary").textContent = summary.join("，");

  const lines = [];
  lines.push(currentChatExportState.message || "等待任务开始。");
  if (currentChatExportState.total) {
    const savedCount = Math.min(
      currentChatExportState.total,
      currentChatExportState.completed + currentChatExportState.failed
    );
    lines.push(`保存进度：${savedCount}/${currentChatExportState.total}`);
  }
  if (currentChatExportState.currentText) {
    lines.push(`当前问题：${currentChatExportState.currentText}`);
  }
  document.getElementById("exportStatus").textContent = lines.join("\n");

  const logs = document.getElementById("exportLogs");
  logs.replaceChildren();
  const items = currentChatExportState.logs.length ? currentChatExportState.logs.slice().reverse() : [];
  for (const item of items) {
    const li = document.createElement("li");
    li.className = "log-item";
    const timeText = formatTime(item.time);
    li.textContent = timeText ? `［${timeText}］${item.message}` : item.message;
    logs.appendChild(li);
  }
}

async function forceStopBatchState(message = "任务已停止。") {
  const finishedAt = new Date().toISOString();
  const nextState = createBatchState({
    ...currentBatchState,
    running: false,
    batchId: "",
    message,
    finishedAt,
    logs: (currentBatchState.logs || []).concat({
      time: finishedAt,
      level: "info",
      message
    }).slice(-60)
  });
  await setLocal({ [BATCH_STATE_KEY]: nextState });
  renderBatchState(nextState);
  return nextState;
}

async function forceResetChatExportState() {
  const nextState = createChatExportState();
  await setLocal({ [CHAT_EXPORT_STATE_KEY]: nextState });
  renderChatExportState(nextState);
  return nextState;
}

async function loadHotkeySettings() {
  const config = await getSync(HOTKEY_DEFAULTS);
  for (const key of Object.keys(HOTKEY_DEFAULTS)) {
    const element = document.getElementById(key);
    if (!element) continue;
    if (typeof HOTKEY_DEFAULTS[key] === "boolean") {
      element.checked = Boolean(config[key]);
    } else {
      element.value = config[key] || HOTKEY_DEFAULTS[key];
    }
  }
}

function saveHotkeySettings() {
  const data = {};
  for (const key of Object.keys(HOTKEY_DEFAULTS)) {
    const element = document.getElementById(key);
    if (!element) continue;
    if (typeof HOTKEY_DEFAULTS[key] === "boolean") {
      data[key] = Boolean(element.checked);
    } else {
      data[key] = element.value || HOTKEY_DEFAULTS[key];
    }
  }

  chrome.storage.sync.set(data, () => flashTip("saved"));
}

async function persistBatchConfig(showTip = false) {
  const delayInput = document.getElementById("batchDelaySeconds");
  const delaySeconds = normalizeBatchDelaySeconds(delayInput.value);
  delayInput.value = String(delaySeconds);
  const focusWhenStuck = document.getElementById("batchFocusWhenStuck");
  const payload = {
    batchGlobalPrompt: document.getElementById("batchGlobalPrompt").value,
    batchPrompt: document.getElementById("batchPrompt").value,
    batchPromptLanguage: getSelectedBatchPromptLanguage(),
    batchInputs: document.getElementById("batchInputs").value,
    batchConversationMode: getSelectedBatchConversationMode(),
    batchIgnoreHeading1: getToggleButtonState("batchIgnoreHeading1"),
    batchIgnoreHeading2: getToggleButtonState("batchIgnoreHeading2"),
    batchDelaySeconds: delaySeconds,
    batchFocusWhenStuck: Boolean(focusWhenStuck && focusWhenStuck.checked),
    batchDirectoryName: currentBatchDirectoryName
  };
  await setLocal(payload);
  if (showTip) flashTip("batchSaved");
}

async function switchBatchPromptLanguage(language) {
  if (currentBatchState.running) return;

  const nextLanguage = normalizeBatchPromptLanguage(language);
  const defaults = getBatchPromptDefaults(nextLanguage);
  document.getElementById("batchGlobalPrompt").value = defaults.globalPrompt;
  document.getElementById("batchPrompt").value = defaults.prompt;
  setBatchPromptLanguage(nextLanguage);
  await persistBatchConfig(true);
}

function scheduleBatchConfigSave() {
  clearTimeout(batchSaveTimer);
  batchSaveTimer = setTimeout(() => {
    persistBatchConfig(false).catch(() => {});
  }, 300);
}

async function loadBatchConfig() {
  const config = await getLocal(BATCH_CONFIG_DEFAULTS);
  const batchPromptLanguage = normalizeBatchPromptLanguage(config.batchPromptLanguage);
  const languageDefaults = getBatchPromptDefaults(batchPromptLanguage);
  const batchGlobalPrompt = !config.batchGlobalPrompt || isKnownBatchDefaultGlobalPrompt(config.batchGlobalPrompt)
    ? languageDefaults.globalPrompt
    : config.batchGlobalPrompt;
  const batchConversationMode = normalizeBatchConversationMode(config.batchConversationMode, config.batchNewChat);
  const batchIgnoreHeading1 = config.batchIgnoreHeading1 === true;
  const batchIgnoreHeading2 = config.batchIgnoreHeading2 !== false;
  const batchPrompt = !config.batchPrompt || isKnownBatchDefaultPrompt(config.batchPrompt)
    ? languageDefaults.prompt
    : config.batchPrompt;
  const batchDelaySeconds = config.batchDelaySeconds == null || Number(config.batchDelaySeconds) === LEGACY_BATCH_DEFAULT_DELAY_SECONDS
    ? BATCH_DEFAULT_DELAY_SECONDS
    : normalizeBatchDelaySeconds(config.batchDelaySeconds);
  document.getElementById("batchGlobalPrompt").value = batchGlobalPrompt;
  document.getElementById("batchPrompt").value = batchPrompt;
  setBatchPromptLanguage(batchPromptLanguage);
  document.getElementById("batchInputs").value = config.batchInputs || "";
  setBatchConversationMode(batchConversationMode);
  setToggleButtonState("batchIgnoreHeading1", batchIgnoreHeading1);
  setToggleButtonState("batchIgnoreHeading2", batchIgnoreHeading2);
  document.getElementById("batchDelaySeconds").value = String(batchDelaySeconds);
  const batchFocusWhenStuck = config.batchFocusWhenStuck === true;
  document.getElementById("batchFocusWhenStuck").checked = batchFocusWhenStuck;
  currentBatchDirectoryName = config.batchDirectoryName || "";
  renderBatchDirectoryText();
  setActivePage(["batch", "hotkeys", "export", "settings"].includes(config.optionsActivePage) ? config.optionsActivePage : "batch");

  if (
    batchGlobalPrompt !== config.batchGlobalPrompt ||
    batchPromptLanguage !== config.batchPromptLanguage ||
    batchConversationMode !== config.batchConversationMode ||
    batchIgnoreHeading1 !== Boolean(config.batchIgnoreHeading1) ||
    batchIgnoreHeading2 !== (config.batchIgnoreHeading2 !== false) ||
    batchPrompt !== config.batchPrompt ||
    batchDelaySeconds !== Number(config.batchDelaySeconds) ||
    config.batchFocusWhenStuck !== batchFocusWhenStuck
  ) {
    await setLocal({
      batchGlobalPrompt,
      batchPromptLanguage,
      batchConversationMode,
      batchIgnoreHeading1,
      batchIgnoreHeading2,
      batchPrompt,
      batchDelaySeconds,
      batchFocusWhenStuck
    });
  }
}

async function loadBatchState() {
  try {
    const response = await sendRuntimeMessage({ type: "GET_BATCH_STATE" });
    if (response && response.ok) {
      renderBatchState(response.state);
      return;
    }
  } catch {}

  const localItems = await getLocal({ [BATCH_STATE_KEY]: BATCH_STATE_DEFAULT });
  renderBatchState(localItems[BATCH_STATE_KEY]);
}

async function loadChatExportState() {
  try {
    const response = await sendRuntimeMessage({ type: "GET_CHAT_EXPORT_STATE" });
    if (response && response.ok) {
      renderChatExportState(response.state);
      return;
    }
  } catch {}

  const localItems = await getLocal({ [CHAT_EXPORT_STATE_KEY]: CHAT_EXPORT_STATE_DEFAULT });
  renderChatExportState(localItems[CHAT_EXPORT_STATE_KEY]);
}

async function pickBatchDirectory() {
  if (typeof window.showDirectoryPicker !== "function") {
    const message = "当前浏览器环境不支持目录选择功能。";
    renderBatchState({
      ...currentBatchState,
      message
    });
    renderChatExportState({
      ...currentChatExportState,
      message
    });
    return;
  }

  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    if (typeof handle.requestPermission === "function") {
      const permission = await handle.requestPermission({ mode: "readwrite" });
      if (permission !== "granted") {
        const message = "目录写入权限没有授权。";
        renderBatchState({
          ...currentBatchState,
          message
        });
        renderChatExportState({
          ...currentChatExportState,
          message
        });
        return;
      }
    }

    await saveDirectoryHandle(handle);
    currentBatchDirectoryName = handle.name || "";
    renderBatchDirectoryText();
    await persistBatchConfig(true);
  } catch (error) {
    if (error && error.name === "AbortError") return;
    const message = error && error.message ? error.message : "目录选择失败。";
    renderBatchState({
      ...currentBatchState,
      message
    });
    renderChatExportState({
      ...currentChatExportState,
      message
    });
  }
}

async function startBatch() {
  if (startPending) return;

  const conversationMode = getSelectedBatchConversationMode();
  const ignoreHeading1 = getToggleButtonState("batchIgnoreHeading1");
  const ignoreHeading2 = getToggleButtonState("batchIgnoreHeading2");
  const globalPrompt = document.getElementById("batchGlobalPrompt").value.trim();
  const prompt = document.getElementById("batchPrompt").value.trim();
  const delaySeconds = normalizeBatchDelaySeconds(document.getElementById("batchDelaySeconds").value);
  const items = parseBatchItems(document.getElementById("batchInputs").value, ignoreHeading1, ignoreHeading2);

  if (!items.length) {
    renderBatchState({
      ...currentBatchState,
      message: "没有可处理的文本，请检查标题忽略选项。"
    });
    setActivePage("batch");
    return;
  }

  if (!currentBatchDirectoryName) {
    renderBatchState({
      ...currentBatchState,
      message: "请先选择目录。"
    });
    setActivePage("batch");
    return;
  }

  startPending = true;
  updateBatchActionButtons();

  try {
    await ensureDirectoryWritable();
    await persistBatchConfig(true);
    const response = await sendRuntimeMessage({
      type: "START_BATCH_EXPORT",
      payload: {
        globalPrompt,
        prompt,
        items,
        newChat: conversationMode === BATCH_CONVERSATION_MODE_NEW,
        delaySeconds,
        focusWhenStuck: Boolean(document.getElementById("batchFocusWhenStuck").checked),
        directoryName: currentBatchDirectoryName
      }
    });

    if (!response || !response.ok) {
      renderBatchState({
        ...currentBatchState,
        message: response && response.error ? response.error : "批量任务启动失败。"
      });
      return;
    }

    if (response.state) renderBatchState(response.state);
    setActivePage("batch");
  } catch (error) {
    renderBatchState({
      ...currentBatchState,
      message: error && error.message ? error.message : "批量任务启动失败。"
    });
  } finally {
    startPending = false;
    updateBatchActionButtons();
  }
}

async function startChatExport() {
  if (exportPending) return;
  const requestToken = ++chatExportRequestToken;

  if (!currentBatchDirectoryName) {
    renderChatExportState({
      ...currentChatExportState,
      message: "请先选择目录。"
    });
    setActivePage("export");
    return;
  }

  exportPending = true;
  updateChatExportActionButtons();

  try {
    await ensureDirectoryWritable();
    const response = await sendRuntimeMessage({
      type: "START_CHAT_EXPORT",
      payload: {
        directoryName: currentBatchDirectoryName
      }
    });
    if (requestToken !== chatExportRequestToken) return;

    if (!response || !response.ok) {
      renderChatExportState({
        ...currentChatExportState,
        message: response && response.error ? response.error : "当前对话导出启动失败。"
      });
      return;
    }

    if (response.state) renderChatExportState(response.state);
    setActivePage("export");
  } catch (error) {
    if (requestToken !== chatExportRequestToken) return;
    renderChatExportState({
      ...currentChatExportState,
      message: error && error.message ? error.message : "当前对话导出启动失败。"
    });
  } finally {
    if (requestToken === chatExportRequestToken) {
      exportPending = false;
      updateChatExportActionButtons();
    }
  }
}

async function stopChatExport() {
  if (exportStopPending || (!currentChatExportState.running && !exportPending)) return;

  chatExportRequestToken += 1;
  exportPending = false;
  exportStopPending = true;
  updateChatExportActionButtons();

  try {
    const response = await sendRuntimeMessage({ type: "STOP_CHAT_EXPORT" });
    if (!response || !response.ok) {
      await forceResetChatExportState();
      return;
    }

    if (response.state) {
      renderChatExportState(response.state);
    } else {
      await forceResetChatExportState();
    }
  } catch {
    await forceResetChatExportState();
  } finally {
    exportStopPending = false;
    updateChatExportActionButtons();
  }
}

async function stopBatch() {
  if (stopPending || !currentBatchState.running) return;

  stopPending = true;
  updateBatchActionButtons();

  try {
    const response = await sendRuntimeMessage({ type: "STOP_BATCH_EXPORT" });
    if (!response || !response.ok) {
      await forceStopBatchState("任务已停止。");
      return;
    }

    if (response.state) {
      renderBatchState(response.state);
    }
  } catch (error) {
    await forceStopBatchState("任务已停止。");
  } finally {
    stopPending = false;
    updateBatchActionButtons();
  }
}

async function deleteProgressConversations() {
  if (deleteProgressPending || currentBatchState.running) return;

  deleteProgressPending = true;
  updateBatchActionButtons();
  renderBatchState({
    ...currentBatchState,
    message: "正在读取最近 3 页进度标题对话……"
  });

  try {
    const listResponse = await sendRuntimeMessage({
      type: "DELETE_PROGRESS_CONVERSATIONS",
      payload: { mode: "list" }
    });
    if (!listResponse || !listResponse.ok) {
      throw new Error(listResponse && listResponse.error ? listResponse.error : "读取进度标题对话失败。");
    }

    const targets = Array.isArray(listResponse.targets) ? listResponse.targets : [];
    if (!targets.length) {
      renderBatchState({
        ...currentBatchState,
        message: `最近 3 页没有找到进度标题对话，扫描 ${listResponse.scanned || 0} 个。`
      });
      return;
    }

    const listText = targets
      .map((item, index) => `${index + 1}. ${item.title}`)
      .join("\n");
    const confirmed = confirm(`将删除以下 ${targets.length} 个进度标题对话：\n\n${listText}\n\n确定删除吗？`);
    if (!confirmed) {
      renderBatchState({
        ...currentBatchState,
        message: `已取消删除，最近 3 页匹配 ${targets.length} 个进度标题对话。`
      });
      return;
    }

    renderBatchState({
      ...currentBatchState,
      message: `已确认删除 ${targets.length} 个进度标题对话，正在执行……`
    });

    const response = await sendRuntimeMessage({
      type: "DELETE_PROGRESS_CONVERSATIONS",
      payload: {
        mode: "delete",
        targets,
        scanned: listResponse.scanned || 0
      }
    });
    if (!response || !response.ok) {
      throw new Error(response && response.error ? response.error : "删除进度标题对话失败。");
    }

    const failedText = response.failed ? `，失败 ${response.failed} 个` : "";
    renderBatchState({
      ...currentBatchState,
      message: `已删除 ${response.deleted || 0} 个进度标题对话，确认 ${response.matched || 0} 个${failedText}。`
    });
  } catch (error) {
    renderBatchState({
      ...currentBatchState,
      message: error && error.message ? error.message : "删除进度标题对话失败。"
    });
  } finally {
    deleteProgressPending = false;
    updateBatchActionButtons();
  }
}

async function clearBatchInputs() {
  if (currentBatchState.running) return;

  const inputs = document.getElementById("batchInputs");
  inputs.value = "";
  await persistBatchConfig(true);
  await setLocal({ [BATCH_STATE_KEY]: BATCH_STATE_DEFAULT });
  renderBatchState(BATCH_STATE_DEFAULT);
  inputs.focus();
}

function bindTabEvents() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => setActivePage(button.dataset.page));
  });
}

function bindBatchEvents() {
  const globalPrompt = document.getElementById("batchGlobalPrompt");
  const prompt = document.getElementById("batchPrompt");
  const inputs = document.getElementById("batchInputs");
  const conversationMode = document.getElementById("batchConversationMode");
  const ignoreHeading1 = document.getElementById("batchIgnoreHeading1");
  const ignoreHeading2 = document.getElementById("batchIgnoreHeading2");
  const delaySeconds = document.getElementById("batchDelaySeconds");
  const focusWhenStuck = document.getElementById("batchFocusWhenStuck");

  globalPrompt.addEventListener("input", scheduleBatchConfigSave);
  prompt.addEventListener("input", scheduleBatchConfigSave);
  inputs.addEventListener("input", scheduleBatchConfigSave);
  delaySeconds.addEventListener("input", scheduleBatchConfigSave);
  focusWhenStuck.addEventListener("change", () => persistBatchConfig(true));
  conversationMode.addEventListener("change", () => persistBatchConfig(true));
  ignoreHeading1.addEventListener("click", () => {
    setToggleButtonState("batchIgnoreHeading1", !getToggleButtonState("batchIgnoreHeading1"));
    persistBatchConfig(true).catch(() => {});
  });
  ignoreHeading2.addEventListener("click", () => {
    setToggleButtonState("batchIgnoreHeading2", !getToggleButtonState("batchIgnoreHeading2"));
    persistBatchConfig(true).catch(() => {});
  });
  globalPrompt.addEventListener("change", () => persistBatchConfig(true));
  prompt.addEventListener("change", () => persistBatchConfig(true));
  inputs.addEventListener("change", () => persistBatchConfig(true));
  delaySeconds.addEventListener("change", () => persistBatchConfig(true));
  document.getElementById("batchStart").addEventListener("click", startBatch);
  document.getElementById("batchStop").addEventListener("click", stopBatch);
  document.getElementById("deleteProgressChats").addEventListener("click", () => {
    deleteProgressConversations().catch(() => {});
  });
  document.getElementById("batchClearInputs").addEventListener("click", () => {
    clearBatchInputs().catch(() => {});
  });
  document.getElementById("pickBatchDirectory").addEventListener("click", pickBatchDirectory);
  document.querySelectorAll("[data-batch-language]").forEach((button) => {
    button.addEventListener("click", () => {
      switchBatchPromptLanguage(button.dataset.batchLanguage).catch(() => {});
    });
  });
}

function bindExportEvents() {
  document.getElementById("pickExportDirectory").addEventListener("click", pickBatchDirectory);
  document.getElementById("exportCurrentChat").addEventListener("click", () => {
    startChatExport().catch(() => {});
  });
  document.getElementById("exportStop").addEventListener("click", () => {
    stopChatExport().catch(() => {});
  });
}

function bindRuntimeEvents() {
  chrome.runtime.onMessage.addListener((message) => {
    if (!message) return;
    if (message.type === "BATCH_STATE_UPDATED") {
      renderBatchState(message.state);
      return;
    }
    if (message.type === "CHAT_EXPORT_STATE_UPDATED") {
      renderChatExportState(message.state);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  renderHotkeyGroups();
  bindTabEvents();
  bindBatchEvents();
  bindExportEvents();
  bindRuntimeEvents();
  document.getElementById("save").addEventListener("click", saveHotkeySettings);
  document.getElementById("openShortcutSettings").addEventListener("click", openShortcutSettingsPage);

  await Promise.all([
    loadHotkeySettings(),
    loadBatchConfig(),
    loadBatchState(),
    loadChatExportState()
  ]);
});
