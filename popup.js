const DEFAULTS = {
  selectionBubbleEnabled: false,
  selectionBubbleUseCurrentChat: true,
  selectionBubbleExcludedUrls: []
};

const selectionBubbleEnabled = document.getElementById("selectionBubbleEnabled");
const selectionBubbleUseCurrentChat = document.getElementById("selectionBubbleUseCurrentChat");
const openOptions = document.getElementById("openOptions");
const openShortcuts = document.getElementById("openShortcuts");

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
    selectionBubbleUseCurrentChat.checked = items.selectionBubbleUseCurrentChat !== false;
  });
}

function saveSettings() {
  const enabled = selectionBubbleEnabled.checked;
  const useCurrentChat = selectionBubbleUseCurrentChat.checked;
  chrome.storage.sync.set({
    selectionBubbleEnabled: enabled,
    selectionBubbleUseCurrentChat: useCurrentChat
  }, () => {
    if (chrome.runtime.lastError) {
      selectionBubbleEnabled.checked = !enabled;
      selectionBubbleUseCurrentChat.checked = !useCurrentChat;
    }
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
selectionBubbleUseCurrentChat.addEventListener("change", saveSettings);
openOptions.addEventListener("click", openOptionsPage);
openShortcuts.addEventListener("click", openShortcutSettingsPage);

loadSettings();
