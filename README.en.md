# GPT Batch Search

[简体中文](README.md) | English

GPT Batch Search is a Chrome extension for submitting items to ChatGPT one by one, formatting each answer as a Markdown file, and saving them locally in a directory tree. It supports tree-style input parsing, automatic failure retry, conversation export, and quick messages via keyboard shortcuts.

## Installation

1. Open the Chrome extensions page.
2. Enable Developer mode.
3. Click Load unpacked.
4. Download and unzip this project, then load the extracted folder.

## Usage

Batch tasks usually follow this workflow:

1. Enter the global prompt and message prompt on the left.
2. Paste the items or tree-style list on the right. Lines prefixed with ◆ are treated as body items to send to ChatGPT; lines without ◆ are used as heading-level folder names. Up to three heading levels are supported. Example:

```
├─ 1. Classical Poetics
│  ├─ 1_1 Debates, Paradigm Shifts, and Contexts
│  │  ├─ ◆ 1_1_1 Plato on Poetry in Republic Book X
```

3. Select a task mode (New Chat or Current Window).
4. Choose the save directory.
5. Click Start to run the batch task.

While a task is running, the bottom of the page shows the current progress, successful items, skipped items, failed items, and logs.

## Main Features

### Batch Tasks

- Paste multiple titles or a tree-style list, then submit them to ChatGPT in order.
- Choose a local folder and save Markdown files according to the task tree into corresponding subfolders.
- Detect saved titles before running to avoid duplicate submissions.
- Create a new ChatGPT conversation every 30 items to reduce lag in long chats.

### Failure Retry

- Automatically refresh and retry when saving fails, the answer is empty, or ChatGPT returns a transient page error.
- Up to 5 retries by default; the first 2 retries refresh the current page, and subsequent retries open a new tab.
- Non-retryable errors (directory permissions, missing paths, etc.) are skipped immediately without using retry attempts.
- After the task ends, failed items are listed in tree format at the bottom and can be copied directly into the pending text area for a rerun.

### Answer Cleanup

- Markdown links, footnotes, and inline citations are converted to numbered endnotes before saving.
- Bold and italic Markdown markers are converted to HTML tags (`<strong>` / `<em>`) for better readability in tools like Obsidian.
- ChatGPT Sources panels, thinking process markers, and search tool call artifacts are automatically filtered out.

### Keep Web Page Focus

- Batch tasks rely on timers and page updates inside the web page. When the window stays unfocused for a long time, the browser may reduce page activity.
- When enabled, the ChatGPT page is refreshed after the task heartbeat has not updated for about 5 minutes. If the current item still has not moved forward about 2 minutes after the refresh, the window is activated. Activations are spaced at least 10 minutes apart. Off by default.

### Conversation Export

- Automatically read all question-answer pairs from the currently open ChatGPT conversation page and save each as a Markdown file.
- Global prompt and message prompt prefixes are stripped during export, keeping only the actual titles.
- Supports DOM parsing and Markdown conversion for Deep Research results.
- Automatically generates a term index file.

### Quick Messages

- Select text on any web page and press a keyboard shortcut to prepend it to a preset prompt and send it to ChatGPT.
- Four independent presets, each with its own prompt, auto-send toggle, and new-chat toggle.
- Default shortcuts: Alt+Shift+W, Ctrl+Shift+1, Ctrl+Shift+2, Ctrl+Shift+3.

### Clear Progress Chats

- During batch tasks, progress is written into ChatGPT conversation titles (e.g. "CPTSD 4/70").
- A one-click cleanup scans the most recent 3 pages of ChatGPT conversations, lists conversations whose titles match the progress format, and deletes them after confirmation.

## Additional Notes

- The settings page supports Chinese and English interface switching; the default prompts are updated accordingly.
- The settings page supports light/dark mode switching.
- A one-click copy button is provided for the Discipline Map Prompt, which can be used to generate knowledge structure outlines.
- The delay between items is configurable (0 to 60 seconds).
- Heading ignore options allow skipping level-1 and level-2 headings.
- Batch task configuration (prompts, pending text, settings) is saved automatically and restored after refresh or restart.

## Compatibility

- Works with Chrome and Edge browsers (Manifest V3).
- Supports chatgpt.com and chat.openai.com domains.
