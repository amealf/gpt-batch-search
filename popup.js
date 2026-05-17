const DEFAULTS = {
  selectionBubbleEnabled: true,
  selectionBubbleExcludedUrls: []
};

const selectionBubbleEnabled = document.getElementById("selectionBubbleEnabled");
const statusText = document.getElementById("status");
const openOptions = document.getElementById("openOptions");
const openShortcuts = document.getElementById("openShortcuts");

function setStatus(enabled) {
  statusText.textContent = enabled
    ? "当前已开启。选中文本后会显示发送按钮。"
    : "当前已关闭。普通网页不会显示发送按钮。";
}

function getShortcutSettingsUrl() {
  const userAgent = navigator.userAgent || "";
  if (/Edg\//i.test(userAgent)) {
    return "edge://extensions/shortcuts";
  }
  return "chrome://extensions/shortcuts";
}

function loadSettings() {
  chrome.storage.sync.get(DEFAULTS, (items) => {
    const enabled = items.selectionBubbleEnabled !== false;
    selectionBubbleEnabled.checked = enabled;
    setStatus(enabled);
  });
}

function saveSettings() {
  const enabled = selectionBubbleEnabled.checked;
  chrome.storage.sync.set({ selectionBubbleEnabled: enabled }, () => {
    if (chrome.runtime.lastError) {
      statusText.textContent = "保存失败，请重新打开弹窗再试。";
      return;
    }
    setStatus(enabled);
  });
}

function openOptionsPage() {
  chrome.storage.local.set({ optionsActivePage: "hotkeys" }, () => {
    chrome.runtime.openOptionsPage();
  });
}

function openShortcutSettingsPage() {
  chrome.tabs.create({ url: getShortcutSettingsUrl() });
}

selectionBubbleEnabled.addEventListener("change", saveSettings);
openOptions.addEventListener("click", openOptionsPage);
openShortcuts.addEventListener("click", openShortcutSettingsPage);

loadSettings();
