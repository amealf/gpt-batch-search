# GPT Quick Search

[简体中文](README.md) | English

GPT Quick Search is a Chrome extension for submitting items in batches, formatting the results as Markdown files, and saving them locally.

## Main Features

- Quick messages: Send selected text to ChatGPT with a preset prompt.
- Batch tasks: Paste multiple titles or a tree-style list, then submit them to ChatGPT in order.
- Directory saving: Choose a local folder and save Markdown files according to the task tree.
- Existing-file skipping: Detect saved titles before running to avoid duplicate submissions.
- Segmented conversations: Create a new ChatGPT conversation every 30 batch items to reduce lag in long chats.
- Failure retry: Refresh and retry when saving fails, the answer is empty, or ChatGPT returns a temporary error. After repeated failures, the extension can continue in a new tab.
- Answer cleanup: Clean Markdown links, bold text, italic text, and trailing reference links before saving.
- Chat export: Automatically read the current ChatGPT conversation and save question-answer pairs as Markdown.

## Installation

1. Open the Chrome extensions page.
2. Enable Developer mode.
3. Click Load unpacked.
4. Download and unzip this project, then load the extracted folder.

## Usage

Batch tasks usually follow this workflow:

1. Enter the global prompt and message prompt on the left.
2. Paste the items or tree-style list on the right.
3. Select a task mode, such as New chat.
4. Choose the save directory.
5. Click Start to run the batch task.

While a task is running, the bottom of the page shows the current progress, successful items, skipped items, failed items, and logs.

## Save Format

Each answer is saved as a Markdown file. The file name comes from the current item title.

The extension applies these cleanup rules while saving:

- `**bold**` is converted to `<strong>bold</strong>`.
- `*italic*` and `_italic_` are converted to `<em>italic</em>`.
- Links in the body are converted to numbered references, such as `[1]` and `[2]`.
- Reference links are collected at the end:

```md
## Footnotes

References

[1] https://example.com
[2] https://example.org
```

## TBD

- Add a "focus ChatGPT window when stuck" toggle, used only when the input box stays unavailable for a long time.
- Add a "maximize Chrome when stuck" option for cases where background pages render slowly.
- Add a resume interface for continuing from a selected item.
- Add a separate rerun feature for failed tasks.
- Add save-format presets, such as plain Markdown, HTML bold, and numbered footnotes.
- Add log export for debugging long batch tasks.
- Add task queue management for running multiple batch tasks in order.
- Add a page-structure detection notice for ChatGPT UI changes that require selector maintenance.
