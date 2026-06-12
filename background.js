const CHAT_HOME = "https://chatgpt.com/";
const EXECUTION_URL_PATTERNS = [
  "https://chatgpt.com/*",
  "https://chat.openai.com/*",
  "https://gemini.google.com/*"
];
const INJECT_WORLD = "ISOLATED";

const DEFAULT_PREFIX = "请将下列文本翻译成中文：";
const LEGACY_EXPLAIN_PREFIX = "请展开解释以下文本";
const EXPLAIN_PREFIX = "请展开解释以下文本：";
const HOTKEY_PRESET_VERSION_KEY = "hotkeyPresetVersion";
const HOTKEY_PRESET_VERSION = 3;
const HOTKEY_DEFAULTS = {
  prefix1: DEFAULT_PREFIX,
  prefix2: DEFAULT_PREFIX,
  prefix3: EXPLAIN_PREFIX,
  prefix4: EXPLAIN_PREFIX,
  autoSend1: true,
  autoSend2: true,
  autoSend3: true,
  autoSend4: true,
  newChat1: true,
  newChat2: false,
  newChat3: true,
  newChat4: false,
  selectionBubbleEnabled: false,
  selectionBubbleUseCurrentChat: true,
  quickMessageProjectUrl: "",
  selectionBubbleExcludedUrls: []
};
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
const ETHICS_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与伦理学相关的」文本。要求如下：

内容要求：

1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。避免使用中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

2 以下并非硬性要求：考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。

写作要求：

使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验。在文章开头写一个总结性质的一级标题。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。

结构要求：

4 不要使用「不是..而是..」和类似的否定先行的句子结构。不要先行使用否定句来引导后续定义。优先使用短句，用易读的风格进行写作。不要总是使用「总得来说」等结构词开启最后一段，自然地结尾。

格式要求：

5 人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const LITERARY_THEORY_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与文学理论相关的」文本。要求如下：

内容要求：

1 优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。避免使用中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

2 以下并非硬性要求：考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。

写作要求：

3 使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验。在文章开头写一个总结性质的一级标题。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。

结构要求：

4 不要使用「不是..而是..」和类似的否定先行的句子结构。不要先行使用否定句来引导后续定义。优先使用短句，用易读的风格进行写作。不要总是使用「总得来说」等结构词开启最后一段，自然地结尾。

格式要求：

5 人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const SOCIOLOGY_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与社会学相关的」文本。要求如下：

内容要求：

优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。尽量减少使用中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。这个并非硬性要求。

写作要求：

使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验。在文章开头写一个简洁的一级标题概括全文。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。

风格要求：

不要使用「不是..而是」「并非..而是」和类似的否定先行的句子结构。用易读的风格进行写作，考虑优先使用短句。不要总是使用「总得来说」等结构词开启最后一段，以一篇可发表的文章的结尾进行收尾。

格式要求：

人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const SOCIOLOGY_LAST_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与社会学相关的」文本。要求如下：

# 内容要求：

优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。尽量减少搜索中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。这并非硬性要求。

# 写作要求：

使用一篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验作.优先考虑使用短句。
在文章开头写一个简洁的一级标题概括全文。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。不要总是使用「总得来说」等结构词开启最后一段，以一篇可发表的文章的结尾进行收尾。

不要使用「不是..而是」「并非..而是」和类似的否定先行的句子结构。

# 格式要求：

人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。
相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const SOCIOLOGY_TITLE_RULES_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与社会学相关的」文本。要求如下：

# 内容要求：

优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。尽量减少搜索中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。这并非硬性要求。

# 写作要求：

使用一整篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验作.优先考虑使用短句。
在文章开头写一个简洁的一级标题概括全文。考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。不要总是使用「总得来说」等结构词开启最后一段，以一篇可发表的文章的结尾进行收尾。
不要使用「不是..而是」「并非..而是」和类似的否定先行的句子结构。
减少使用「如果」来开启句子。禁止使用「更像」。不要用结论+冒号作为句子的开头，比如「...的意思很明确：」，很明确在这里就是一个结论。这种情况你应该直接进入内容，不需要判断它是否明确。

# 格式要求：

人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。
相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const SOCIOLOGY_SUBJECT_TITLE_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与社会学相关的」文本。要求如下：

# 内容要求：

优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。尽量减少搜索中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。这并非硬性要求。

# 写作要求：

使用一整篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验作.优先考虑使用短句。

在文章开头写一个一级标题概括全文，偏向学术地位、理论贡献、研究对象、方法贡献、具体内容概括。标题表达书面、简洁，避免完整口语句、疑问句、讲解。尤其避免「如何」「怎样」「为什么」「把」「了」「一门」「一种」「不是……而是……」「写成」「让……」

考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。不要总是使用「总得来说」等结构词开启最后一段，以一篇可发表的文章的结尾进行收尾。
不要使用「不是..而是」「并非..而是」和类似的否定先行的句子结构。
减少使用「如果」来开启句子。禁止使用「更像」。不要用结论+冒号作为句子的开头，比如「...的意思很明确：」，很明确在这里就是一个结论。这种情况你应该直接进入内容，不需要判断它是否明确。

# 格式要求：

人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。
相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const SOCIOLOGY_STANDALONE_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与社会学相关的」文本。要求如下：

# 内容要求：

优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。尽量减少搜索中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。这并非硬性要求。

# 写作要求：

使用一整篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验作.优先考虑使用短句。

在文章开头写一个一级标题概括全文，偏向学术地位、理论贡献、研究对象、方法贡献、具体内容概括。标题表达书面、简洁，避免完整口语句、疑问句、讲解。尤其避免「如何」「怎样」「为什么」「把」「了」「一门」「一种」「不是……而是……」「写成」「让……」。如果文章主题是人物、书、论文，请将标题写成以下形式：主题名+冒号+简短描述

考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。不要总是使用「总得来说」等结构词开启最后一段，以一篇可发表的文章的结尾进行收尾。
不要使用「不是..而是」「并非..而是」和类似的否定先行的句子结构。
减少使用「如果」来开启句子。禁止使用「更像」。不要用结论+冒号作为句子的开头，比如「...的意思很明确：」，很明确在这里就是一个结论。这种情况你应该直接进入内容，不需要判断它是否明确。

# 格式要求：

人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。
相关术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接`;
const BATCH_DEFAULT_GLOBAL_PROMPT = `请搜索并介绍用户接下来发送的「与社会学相关的」文本。要求如下：

# 内容要求：

优先搜索Stanford Encyclopedia of Philosophy、Wikipedia、Britannica、该文本的原文的相关信息。尽量减少搜索中文资料。在写作时不要注明网站信息来源，可以注明观点的具体文本、学者的来源。

考虑该文本在整个学科地图中的位置和重要性；考虑当代学者/后续学者的看法和学界最新的进展。这并非硬性要求。

# 写作要求：

使用一整篇完整的中文文章介绍该文本的相关信息，以「可直接发表」为目标，使用博客文章的写作风格，加入一些写作风格，避免翻译腔和AI腔。注重文本流畅性和整体阅读体验作.优先考虑使用短句。每篇文章都将会被单独发表，不要引用前面有过的回答、用户的prompt等等。

在文章开头写一个一级标题概括全文，偏向学术地位、理论贡献、研究对象、方法贡献、具体内容概括。标题表达书面、简洁，避免完整口语句、疑问句、讲解。尤其避免「如何」「怎样」「为什么」「把」「了」「一门」「一种」「不是……而是……」「写成」「让……」。如果文章主题是人物、书、论文，请将标题写成以下形式：主题名+冒号+简短描述

考虑开头通过背景逐渐引入主题、结尾不要有延展问题和编辑建议。不要总是使用「总得来说」等结构词开启最后一段，以一篇可发表的文章的结尾进行收尾。
不要使用「不是..而是」「并非..而是」和类似的否定先行的句子结构。
减少使用「如果」来开启句子。禁止使用「更像」。不要用结论+冒号作为句子的开头，比如「...的意思很明确：」，很明确在这里就是一个结论。这种情况你应该直接进入内容，不需要判断它是否明确。

# 格式要求：

人名第一次出现时，使用英文（中文）这样的格式，第二次以后就用英文名即可。
相关专业术语第一次出现时，在中文后面用括号注明英文原文。不要使用脚注，可以在段末附带链接。
中文的书名要加书名号《》
不要有代码框、编辑框`;
const LITERARY_THEORY_BATCH_EN_GLOBAL_PROMPT = `Please search for and introduce the "literary theory-related" text the user sends next. Requirements:

Content requirements:

1 Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Prefer English-language sources and reliable original-language sources. Do not explicitly name website sources while writing; you may name the specific texts, scholars, or arguments that support a point.

2 These are not hard requirements: consider the text's place and importance in the wider disciplinary map; consider how later scholars and contemporary scholarship have discussed it.

Writing requirements:

3 Write a complete English article about the text, aiming for a publishable blog style. Add some style to the prose, avoid a translated or AI-like tone, and keep the article smooth and readable. Start with a summary-style H1 heading. Consider opening through background context before gradually introducing the topic. End naturally, without extension questions or editorial suggestions.

Structure requirements:

4 Avoid "not...but..." and similar negative-first sentence structures. Do not lead with negation when defining a concept. Prefer short sentences and an easy reading style. Do not keep opening the final paragraph with formulaic phrases such as "In summary"; close naturally.

Format requirements:

5 When a relevant term has an established original-language name, include that original name in parentheses the first time the term appears. Do not use footnotes; links may be included at the end of paragraphs.`;
const SOCIOLOGY_PREVIOUS_BATCH_EN_GLOBAL_PROMPT = `Please search for and introduce the sociology-related text the user sends next. Requirements:

Content requirements:

Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Prefer English-language sources and reliable original-language sources. Do not name websites as sources while writing; you may name the specific texts, scholars, or viewpoints that support a point.

Consider the text's place and importance in the wider disciplinary map; consider contemporary scholars' or later scholars' views and the latest developments in the field. This is not a hard requirement.

Writing requirements:

Write a complete English article about the text, aiming for publishable quality. Use a blog-article style, add some prose style, and avoid translated-sounding or AI-sounding phrasing. Keep the article smooth and pleasant to read as a whole. Begin with a concise H1 heading that summarizes the article. Consider opening through background context before gradually introducing the topic, and end without extension questions or editorial suggestions.

Style requirements:

Avoid "not...but...", "not so much...as...", and similar negative-first sentence structures. Write in an easy-to-read style and prefer short sentences where possible. Do not habitually open the final paragraph with formulaic transitions such as "In summary"; close the piece like a publishable article.

Format requirements:

When a relevant term has an established original-language name, include that original name in parentheses the first time the term appears. Do not use footnotes; links may be included at the end of paragraphs.`;
const SOCIOLOGY_LAST_BATCH_EN_GLOBAL_PROMPT = `Please search for and introduce the sociology-related text the user sends next. Requirements:

# Content Requirements:

Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Prefer English-language sources and reliable original-language sources. Do not name websites as sources while writing; you may name the specific texts, scholars, or viewpoints that support a point.

Consider the text's place and importance in the wider disciplinary map; consider contemporary scholars' or later scholars' views and the latest developments in the field. This is not a hard requirement.

# Writing Requirements:

Write a complete English article about the text, aiming for publishable quality. Use a blog-article style, add some prose style, and avoid translated-sounding or AI-sounding phrasing. Keep the article smooth and pleasant to read as a whole. Prefer short sentences.
Begin with a concise H1 heading that summarizes the article. Consider opening through background context before gradually introducing the topic, and end without extension questions or editorial suggestions. Do not habitually open the final paragraph with formulaic transitions such as "In summary"; close the piece like a publishable article.

Avoid "not...but...", "not so much...as...", and similar negative-first sentence structures.

# Format Requirements:

When a relevant term has an established original-language name, include that original name in parentheses the first time the term appears. Do not use footnotes; links may be included at the end of paragraphs.`;
const BATCH_EN_GLOBAL_PROMPT = `Please search for and introduce the sociology-related text the user sends next. Requirements:

# Content Requirements:

Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Prefer English-language sources and reliable original-language sources. Do not name websites as sources while writing; you may name the specific texts, scholars, or viewpoints that support a point.

Consider the text's place and importance in the wider disciplinary map; consider contemporary scholars' or later scholars' views and the latest developments in the field. This is not a hard requirement.

# Writing Requirements:

Write one complete English article about the text, aiming for publishable quality. Use a blog-article style, add some prose style, and avoid translated-sounding or AI-sounding phrasing. Keep the article smooth and pleasant to read as a whole. Prefer short sentences.
Begin with a concise H1 heading that summarizes the article. Consider opening through background context before gradually introducing the topic, and end without extension questions or editorial suggestions. Do not habitually open the final paragraph with formulaic transitions such as "In summary"; close the piece like a publishable article.

Avoid "not...but...", "not so much...as...", and similar negative-first sentence structures.
Use sentence openings with "if" sparingly. Do not use "more like". Do not open a sentence with a conclusion followed by a colon, such as "The meaning is clear:"; move into the content without judging whether it is clear.

# Format Requirements:

When a relevant term has an established original-language name, include that original name in parentheses the first time the term appears. Do not use footnotes; links may be included at the end of paragraphs.`;
const ETHICS_BATCH_EN_GLOBAL_PROMPT = `Please search for and introduce the "ethics-related" text the user sends next. Requirements:

Content requirements:

1 Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Prefer English-language sources and reliable original-language sources. Do not explicitly name website sources while writing; you may name the specific texts, scholars, or arguments that support a point.

2 These are not hard requirements: consider the text's place and importance in the wider disciplinary map; consider how later scholars and contemporary scholarship have discussed it.

Writing requirements:

Write a complete English article about the text, aiming for a publishable blog style. Add some style to the prose, avoid a translated or AI-like tone, and keep the article smooth and readable. Start with a summary-style H1 heading. Consider opening through background context before gradually introducing the topic. End naturally, without extension questions or editorial suggestions.

Structure requirements:

4 Avoid "not...but..." and similar negative-first sentence structures. Do not lead with negation when defining a concept. Prefer short sentences and an easy reading style. Do not keep opening the final paragraph with formulaic phrases such as "In summary"; close naturally.

Format requirements:

5 When a relevant term has an established original-language name, include that original name in parentheses the first time the term appears. Do not use footnotes; links may be included at the end of paragraphs.`;
const BATCH_DEFAULT_PROMPT = "请介绍以下文本。前两项是学科地图中的位置，用来理解语境；最后一项是本次需要介绍的文本。";
const BATCH_EN_PROMPT = "Please introduce the following text. The first two items are positions in the discipline map, used to understand the context; the last item is the text to introduce.";
const LEGACY_BATCH_DEFAULT_GLOBAL_PROMPT = "接下来会逐条发送一些词条标题。请每次只围绕当前这一条进行介绍，使用中文回答，不要重复说明规则。";
const LEGACY_BATCH_DEFAULT_PROMPT = "解释下列名词的概念：";
const LEGACY_BATCH_EN_PROMPT = "Please introduce:";
const RECENT_BATCH_DEFAULT_PROMPT = "请介绍：";
const CHAT_EXPORT_MODE_SEPARATE = "separate";
const CHAT_EXPORT_MODE_SINGLE = "single";
const BATCH_MODEL_DEFAULT = "default";
const BATCH_MODEL_INSTANT = "instant";
const BATCH_MODEL_THINKING = "thinking";
const BATCH_MODEL_PRO = "pro";
const BATCH_CONFIG_DEFAULTS = {
  batchGlobalPrompt: BATCH_DEFAULT_GLOBAL_PROMPT,
  batchPrompt: BATCH_DEFAULT_PROMPT,
  batchPromptLanguage: "cn",
  batchNewChatUrl: "",
  batchModel: BATCH_MODEL_DEFAULT
};
const BATCH_STATE_KEY = "batchRunState";
const CHAT_EXPORT_STATE_KEY = "chatExportRunState";
const DIRECTORY_DB_NAME = "batch-export-db";
const DIRECTORY_STORE_NAME = "handles";
const DIRECTORY_HANDLE_KEY = "output-directory";
const BATCH_DEFAULT_MAX_REFRESH_RETRIES = 5;
const BATCH_NEW_TAB_RETRY_AFTER = 2;
const BATCH_DEFAULT_DELAY_SECONDS = 1;
const BATCH_FOCUS_ALARM_NAME = "batch-focus-when-stuck";
const BATCH_FOCUS_STUCK_MS = 5 * 60 * 1000;
const BATCH_FOCUS_AFTER_REFRESH_MS = 2 * 60 * 1000;
const BATCH_FOCUS_COOLDOWN_MS = 10 * 60 * 1000;
const BATCH_CONTROL_FOCUS_INTERVAL_MS = 60 * 1000;

if (chrome.action?.onClicked) {
  chrome.action.onClicked.addListener(() => {
    chrome.storage.local.set({ optionsActivePage: "batch" }, () => {
      chrome.runtime.openOptionsPage();
    });
  });
}

const EMPTY_BATCH_STATE = {
  running: false,
  batchId: "",
  total: 0,
  completed: 0,
  failed: 0,
  skipped: 0,
  currentIndex: 0,
  currentText: "",
  currentItemNumber: "",
  sentText: "",
  message: "等待任务开始。",
  startedAt: "",
  finishedAt: "",
  logs: [],
  failedItems: [],
  retryAttempt: 0,
  maxRefreshRetries: BATCH_DEFAULT_MAX_REFRESH_RETRIES,
  delaySeconds: BATCH_DEFAULT_DELAY_SECONDS,
  directoryName: "",
  focusWhenStuck: false,
  controlMode: false,
  batchTabId: 0,
  lastActivityAt: "",
  lastHeartbeatAt: "",
  lastStuckRefreshAt: "",
  lastStuckRefreshProgressKey: "",
  lastFocusAt: "",
  lastControlFocusAt: "",
  refreshRecoveryFailureCount: 0,
  lastRefreshRecoveryFailureAt: ""
};
const EMPTY_CHAT_EXPORT_STATE = {
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
  logs: [],
  directoryName: "",
  exportMode: CHAT_EXPORT_MODE_SEPARATE
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function getSync(defaults) {
  return new Promise((resolve) => chrome.storage.sync.get(defaults, (items) => resolve(items)));
}

function getSyncItems(keys) {
  return new Promise((resolve) => chrome.storage.sync.get(keys, (items) => resolve(items)));
}

function getLocal(defaults) {
  return new Promise((resolve) => chrome.storage.local.get(defaults, (items) => resolve(items)));
}

function setLocal(items) {
  return new Promise((resolve) => chrome.storage.local.set(items, resolve));
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

async function getOutputDirectoryHandle() {
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

function createBatchState(state) {
  const next = { ...EMPTY_BATCH_STATE, ...(state || {}) };
  next.logs = Array.isArray(next.logs) ? next.logs.slice(-60) : [];
  next.failedItems = Array.isArray(next.failedItems) ? next.failedItems.slice(-100) : [];
  next.sentText = typeof next.sentText === "string" ? next.sentText : "";
  next.currentItemNumber = normalizeBatchItemNumber(next.currentItemNumber);
  next.retryAttempt = Number.isFinite(Number(next.retryAttempt)) ? Math.max(0, Number(next.retryAttempt)) : 0;
  next.maxRefreshRetries = Number.isFinite(Number(next.maxRefreshRetries))
    ? Math.max(0, Number(next.maxRefreshRetries))
    : BATCH_DEFAULT_MAX_REFRESH_RETRIES;
  next.batchTabId = Number.isFinite(Number(next.batchTabId)) ? Math.max(0, Number(next.batchTabId)) : 0;
  next.refreshRecoveryFailureCount = Number.isFinite(Number(next.refreshRecoveryFailureCount))
    ? Math.max(0, Number(next.refreshRecoveryFailureCount))
    : 0;
  return next;
}

function isRetryableBatchItemError(reason) {
  const text = String(reason || "");
  if (!text) return true;
  return !(
    text.includes("保存目录") ||
    text.includes("保存路径不可用") ||
    text.includes("写入权限") ||
    text.includes("读取权限") ||
    text.includes("NotAllowedError") ||
    text.includes("NotFoundError") ||
    text.includes("requested file or directory could not be found") ||
    text.includes("file or directory could not be found") ||
    text.includes("系统找不到指定的路径") ||
    text.includes("SecurityError")
  );
}

function formatBatchRetryAction(nextRetryAttempt, maxRetries) {
  return `准备第 ${nextRetryAttempt}/${maxRetries} 次重试`;
}

function extractBatchDirectoryNumber(directoryPath) {
  const parts = normalizeDirectoryPath(directoryPath);
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const match = String(parts[index] || "").trim().match(/^(\d+(?:[._]\d+)*)\b/u);
    if (match) return match[1];
  }
  return "";
}

function normalizeBatchItemNumber(value) {
  const match = String(value || "").trim().match(/^(\d+(?:[._]\d+)*)$/u);
  return match ? match[1].replace(/\./g, "_") : "";
}

function formatBatchLogTitle(text, directoryPath, itemNumber = "") {
  const number = normalizeBatchItemNumber(itemNumber) || extractBatchDirectoryNumber(directoryPath);
  return number ? `${number} ${text}` : text;
}

function createChatExportState(state) {
  const next = { ...EMPTY_CHAT_EXPORT_STATE, ...(state || {}) };
  next.logs = Array.isArray(next.logs) ? next.logs.slice(-60) : [];
  return next;
}

function isCurrentBatchMessage(currentState, batchId) {
  return Boolean(batchId) && currentState.batchId === batchId;
}

function isCurrentChatExportMessage(currentState, exportId) {
  return Boolean(exportId) && currentState.exportId === exportId;
}

async function getBatchState() {
  const items = await getLocal({ [BATCH_STATE_KEY]: EMPTY_BATCH_STATE });
  return createBatchState(items[BATCH_STATE_KEY]);
}

async function getChatExportState() {
  const items = await getLocal({ [CHAT_EXPORT_STATE_KEY]: EMPTY_CHAT_EXPORT_STATE });
  return createChatExportState(items[CHAT_EXPORT_STATE_KEY]);
}

async function broadcastBatchState(state) {
  try {
    await chrome.runtime.sendMessage({ type: "BATCH_STATE_UPDATED", state });
  } catch {}
}

async function broadcastChatExportState(state) {
  try {
    await chrome.runtime.sendMessage({ type: "CHAT_EXPORT_STATE_UPDATED", state });
  } catch {}
}

async function saveBatchState(nextState) {
  const state = createBatchState(nextState);
  await setLocal({ [BATCH_STATE_KEY]: state });
  await broadcastBatchState(state);
  syncBatchFocusAlarm(state).catch(() => {});
  return state;
}

async function saveChatExportState(nextState) {
  const state = createChatExportState(nextState);
  await setLocal({ [CHAT_EXPORT_STATE_KEY]: state });
  await broadcastChatExportState(state);
  return state;
}

async function handleChatExportProgress(payload) {
  const current = await getChatExportState();
  if (!isCurrentChatExportMessage(current, payload?.exportId)) {
    return current;
  }

  const nextState = { ...current };
  if (typeof payload?.message === "string" && payload.message.trim()) {
    nextState.message = payload.message;
  }
  if (typeof payload?.currentText === "string") {
    nextState.currentText = payload.currentText;
  }
  if (Number.isFinite(Number(payload?.currentIndex))) {
    nextState.currentIndex = Math.max(0, Number(payload.currentIndex));
  }
  if (Number.isFinite(Number(payload?.total))) {
    nextState.total = Math.max(0, Number(payload.total));
  }
  if (typeof payload?.logMessage === "string" && payload.logMessage.trim()) {
    nextState.logs = current.logs.concat({
      time: new Date().toISOString(),
      level: payload?.level === "error" ? "error" : "info",
      message: payload.logMessage
    }).slice(-60);
  }

  return saveChatExportState(nextState);
}

async function handleStopChatExport() {
  const current = await getChatExportState();
  const exportId = current.exportId;
  const resetState = await saveChatExportState({
    ...EMPTY_CHAT_EXPORT_STATE
  });

  if (exportId) {
    (async () => {
      try {
        const chatTab = await findChatTab();
        if (chatTab && chatTab.id) {
          await sendMessageToChatTabSafely(chatTab.id, "EXT_STOP_CHAT_EXPORT", {
            exportId
          });
        }
      } catch {}
    })();
  }

  return { ok: true, state: resetState };
}

async function updateBatchState(patch) {
  const current = await getBatchState();
  return saveBatchState({ ...current, ...(patch || {}) });
}

async function appendBatchLog(message, level = "info") {
  const current = await getBatchState();
  const logs = current.logs.concat({
    time: new Date().toISOString(),
    level,
    message
  }).slice(-60);
  return saveBatchState({ ...current, logs });
}

async function appendBatchLogIfCurrent(batchId, message, level = "info") {
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, batchId)) {
    return current;
  }

  const logs = current.logs.concat({
    time: new Date().toISOString(),
    level,
    message
  }).slice(-60);

  return saveBatchState({ ...current, logs });
}

function normalizeHotkeyDefaultText(value) {
  return String(value || "").replace(/\r\n?/g, "\n").trim();
}

function createHotkeySettings(items = {}) {
  const settings = { ...HOTKEY_DEFAULTS, ...(items || {}) };
  const patch = {};
  const oldPresetVersion = Number(items?.[HOTKEY_PRESET_VERSION_KEY] || 0) < HOTKEY_PRESET_VERSION;
  const translatePrefix = normalizeHotkeyDefaultText(DEFAULT_PREFIX);
  const explainPrefixes = new Set([
    normalizeHotkeyDefaultText(LEGACY_EXPLAIN_PREFIX),
    normalizeHotkeyDefaultText(EXPLAIN_PREFIX)
  ]);

  if (oldPresetVersion) {
    const prefix2 = normalizeHotkeyDefaultText(items.prefix2);
    const prefix3 = normalizeHotkeyDefaultText(items.prefix3);
    const prefix4 = normalizeHotkeyDefaultText(items.prefix4);

    if (!prefix2 || prefix2 === translatePrefix || explainPrefixes.has(prefix2)) {
      settings.prefix2 = DEFAULT_PREFIX;
      settings.newChat2 = false;
      patch.prefix2 = DEFAULT_PREFIX;
      patch.newChat2 = false;
    }

    if (!prefix3 || prefix3 === translatePrefix || explainPrefixes.has(prefix3)) {
      settings.prefix3 = EXPLAIN_PREFIX;
      settings.newChat3 = true;
      patch.prefix3 = EXPLAIN_PREFIX;
      patch.newChat3 = true;
    }

    if (!prefix4 || prefix4 === translatePrefix || explainPrefixes.has(prefix4)) {
      settings.prefix4 = EXPLAIN_PREFIX;
      settings.newChat4 = false;
      patch.prefix4 = EXPLAIN_PREFIX;
      patch.newChat4 = false;
    }

    patch[HOTKEY_PRESET_VERSION_KEY] = HOTKEY_PRESET_VERSION;
  }

  return { settings, patch };
}

async function getHotkeySettings() {
  const items = await getSyncItems([...Object.keys(HOTKEY_DEFAULTS), HOTKEY_PRESET_VERSION_KEY]);
  return createHotkeySettings(items).settings;
}

async function getSelectedTextOnActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab || !tab.id) {
    return { text: "", tabId: 0, canDisplayInPage: false };
  }
  if (typeof tab.url === "string" && tab.url.startsWith(`chrome-extension://${chrome.runtime.id}/`)) {
    return { text: "", tabId: tab.id, canDisplayInPage: false };
  }

  try {
    const response = await sendMessageToTab(tab.id, { type: "GPT_QUICK_SEARCH_GET_SELECTION" });
    if (response && response.ok) {
      return {
        text: response.text || "",
        tabId: tab.id,
        canDisplayInPage: true
      };
    }
  } catch {}

  if (typeof tab.url !== "string" || !EXECUTION_URL_PATTERNS.some((pattern) => {
    const prefix = pattern.replace(/\*$/, "");
    return tab.url.startsWith(prefix);
  })) {
    return { text: "", tabId: tab.id, canDisplayInPage: false };
  }

  const [{ result: selectedText = "" } = {}] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: INJECT_WORLD,
    func: () => {
      const selection = window.getSelection?.();
      let text = selection && selection.toString ? selection.toString() : "";

      if (!text && document.activeElement) {
        const element = document.activeElement;
        const isTextInput = element.tagName === "TEXTAREA" ||
          (element.tagName === "INPUT" && ["text", "search", "url", "email", "tel", "password"].includes(element.type));

        if (isTextInput && typeof element.selectionStart === "number" && typeof element.selectionEnd === "number") {
          text = element.value.substring(element.selectionStart, element.selectionEnd);
        }
      }

      return text || "";
    }
  });

  return {
    text: selectedText || "",
    tabId: tab.id,
    canDisplayInPage: false
  };
}

async function findChatTab() {
  const tabs = await chrome.tabs.query({ url: ["https://chatgpt.com/*", "https://chat.openai.com/*"] });
  if (!tabs.length) return null;
  const activeTab = tabs.find((tab) => tab.active);
  return activeTab || tabs[0];
}

async function getChatTabById(tabId) {
  const id = Number(tabId) || 0;
  if (id <= 0) return null;
  try {
    const tab = await chrome.tabs.get(id);
    return tab && isChatTabUrl(tab.url) ? tab : null;
  } catch {
    return null;
  }
}

async function getBatchStatusFromChatTab(tabId, batchId) {
  const id = Number(tabId) || 0;
  const currentBatchId = typeof batchId === "string" ? batchId : "";
  if (id <= 0 || !currentBatchId) return null;
  try {
    const response = await sendMessageToTab(id, {
      type: "EXT_GET_BATCH_STATUS",
      payload: { batchId: currentBatchId }
    });
    return response?.ok ? response : null;
  } catch {
    return null;
  }
}

async function findBatchChatTab(batchId, preferredTabId = 0) {
  const currentBatchId = typeof batchId === "string" ? batchId : "";
  if (!currentBatchId) return null;

  const preferred = await getChatTabById(preferredTabId);
  if (preferred?.id) {
    const status = await getBatchStatusFromChatTab(preferred.id, currentBatchId);
    if (status?.matchesBatch) return preferred;
  }

  const tabs = await chrome.tabs.query({ url: ["https://chatgpt.com/*", "https://chat.openai.com/*"] });
  for (const tab of tabs) {
    if (!tab?.id || tab.id === preferred?.id) continue;
    const status = await getBatchStatusFromChatTab(tab.id, currentBatchId);
    if (status?.matchesBatch) return tab;
  }

  return null;
}

function normalizeChatLaunchUrl(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";

  try {
    const url = new URL(text);
    if (url.protocol !== "https:") return "";
    if (url.hostname !== "chatgpt.com" && url.hostname !== "chat.openai.com") return "";
    return url.href;
  } catch {
    return "";
  }
}

function normalizeBatchModel(value) {
  const text = String(value || "").toLowerCase();
  if (text === BATCH_MODEL_INSTANT) return BATCH_MODEL_INSTANT;
  if (text === BATCH_MODEL_THINKING) return BATCH_MODEL_THINKING;
  if (text === BATCH_MODEL_PRO) return BATCH_MODEL_PRO;
  return BATCH_MODEL_DEFAULT;
}

function isChatTabUrl(url) {
  const text = String(url || "");
  return text.startsWith("https://chatgpt.com/") || text.startsWith("https://chat.openai.com/");
}

async function closeRetrySourceTab(sourceTabId, retryTabId) {
  if (!Number.isInteger(sourceTabId) || sourceTabId === retryTabId) return;

  try {
    const sourceTab = await chrome.tabs.get(sourceTabId);
    if (sourceTab && isChatTabUrl(sourceTab.url)) {
      await chrome.tabs.remove(sourceTabId);
    }
  } catch {}
}

async function waitForTabComplete(tabId, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    function cleanup(listener, timerId) {
      chrome.tabs.onUpdated.removeListener(listener);
      clearInterval(timerId);
    }

    function listener(updatedTabId, info) {
      if (updatedTabId !== tabId || info.status !== "complete") return;
      cleanup(listener, timerId);
      resolve();
    }

    chrome.tabs.onUpdated.addListener(listener);

    const timerId = setInterval(async () => {
      if (Date.now() - startedAt > timeoutMs) {
        cleanup(listener, timerId);
        reject(new Error("页面加载超时。"));
        return;
      }

      try {
        const tab = await chrome.tabs.get(tabId);
        if (tab.status === "complete") {
          cleanup(listener, timerId);
          resolve();
        }
      } catch {}
    }, 300);
  });
}

async function bringToFront(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    await chrome.windows.update(tab.windowId, { focused: true });
    await chrome.tabs.update(tabId, { active: true });
  } catch {}
}

function parseStateTime(value) {
  const time = Date.parse(String(value || ""));
  return Number.isFinite(time) ? time : 0;
}

function getLatestBatchSignalTime(state) {
  return Math.max(
    parseStateTime(state?.lastActivityAt),
    parseStateTime(state?.lastHeartbeatAt),
    parseStateTime(state?.startedAt)
  );
}

function getBatchProgressKey(state) {
  return [
    Number(state?.completed) || 0,
    Number(state?.failed) || 0
  ].join(":");
}

async function syncBatchFocusAlarm(state) {
  if (!chrome.alarms) return;
  if (state && state.running && state.batchId) {
    await chrome.alarms.create(BATCH_FOCUS_ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 1
    });
    return;
  }
  await chrome.alarms.clear(BATCH_FOCUS_ALARM_NAME);
}

async function handleBatchFocusAlarm() {
  const current = await getBatchState();
  if (!current.running || !current.batchId) {
    await syncBatchFocusAlarm(current);
    return;
  }

  const now = Date.now();
  const latestSignalAt = getLatestBatchSignalTime(current);
  const lastStuckRefreshAt = parseStateTime(current.lastStuckRefreshAt);
  const currentProgressKey = getBatchProgressKey(current);
  const stuckRefreshProgressKey = String(current.lastStuckRefreshProgressKey || "");
  const lastFocusAt = parseStateTime(current.lastFocusAt);

  const chatTab = await findBatchChatTab(current.batchId, current.batchTabId);
  const controlTab = chatTab || (current.controlMode ? await getChatTabById(current.batchTabId) : null);

  if (current.controlMode && controlTab?.id) {
    const lastControlFocusAt = parseStateTime(current.lastControlFocusAt);
    if (!lastControlFocusAt || now - lastControlFocusAt >= BATCH_CONTROL_FOCUS_INTERVAL_MS) {
      await bringToFront(controlTab.id);
      const latest = await getBatchState();
      if (!isCurrentBatchMessage(latest, current.batchId)) return;
      await saveBatchState({
        ...latest,
        batchTabId: controlTab.id,
        lastControlFocusAt: new Date().toISOString()
      });
      if (getBatchProgressKey(latest) !== currentProgressKey || getLatestBatchSignalTime(latest) !== latestSignalAt) {
        return;
      }
    }
  }

  if (!chatTab?.id) return;

  if (lastStuckRefreshAt && stuckRefreshProgressKey) {
    if (currentProgressKey !== stuckRefreshProgressKey) {
      await saveBatchState({
        ...current,
        batchTabId: chatTab.id,
        lastStuckRefreshAt: "",
        lastStuckRefreshProgressKey: "",
        refreshRecoveryFailureCount: 0,
        lastRefreshRecoveryFailureAt: ""
      });
      return;
    }

    if (now - lastStuckRefreshAt < BATCH_FOCUS_AFTER_REFRESH_MS) return;
    if (!current.focusWhenStuck) return;
    if (lastFocusAt && now - lastFocusAt < BATCH_FOCUS_COOLDOWN_MS) return;

    await bringToFront(chatTab.id);

    const latest = await getBatchState();
    if (!isCurrentBatchMessage(latest, current.batchId)) return;
    await saveBatchState({
      ...latest,
      message: "刷新后任务仍没有推进，已激活 ChatGPT 网页。",
      batchTabId: chatTab.id,
      lastFocusAt: new Date().toISOString(),
      logs: latest.logs.concat({
        time: new Date().toISOString(),
        level: "info",
        message: "刷新后任务仍没有推进，已激活 ChatGPT 网页。"
      }).slice(-60)
    });
    return;
  }

  if (!latestSignalAt || now - latestSignalAt < BATCH_FOCUS_STUCK_MS) return;

  let refreshError = null;
  try {
    await sendMessageToChatTabSafely(chatTab.id, "EXT_REFRESH_STUCK_BATCH", {
      batchId: current.batchId
    });
    const latest = await getBatchState();
    if (!isCurrentBatchMessage(latest, current.batchId)) return;
    await saveBatchState({
      ...latest,
      message: "任务心跳长时间没有更新，已刷新 ChatGPT 网页恢复任务。",
      batchTabId: chatTab.id,
      lastStuckRefreshAt: new Date().toISOString(),
      lastStuckRefreshProgressKey: getBatchProgressKey(latest),
      refreshRecoveryFailureCount: 0,
      lastRefreshRecoveryFailureAt: "",
      logs: latest.logs.concat({
        time: new Date().toISOString(),
        level: "info",
        message: "任务心跳长时间没有更新，已刷新 ChatGPT 网页恢复任务。"
      }).slice(-60)
    });
    return;
  } catch (error) {
    refreshError = error;
  }

  if (!current.focusWhenStuck) {
    const latest = await getBatchState();
    if (!isCurrentBatchMessage(latest, current.batchId)) return;
    const failureCount = (Number(latest.refreshRecoveryFailureCount) || 0) + 1;
    const failureTime = new Date().toISOString();
    const refreshErrorText = refreshError && refreshError.message ? refreshError.message : String(refreshError || "");
    const refreshErrorSuffix = refreshErrorText ? ` 错误：${refreshErrorText}` : "";
    const focusMessage = current.controlMode
      ? "调控模式已启用，会按间隔激活当前批量标签页。请查看 ChatGPT 标签页。"
      : "保持网页焦点未开启，未激活 ChatGPT 网页。请查看 ChatGPT 标签页。";
    const message = failureCount >= 10
      ? `刷新恢复请求连续失败 ${failureCount} 次。${focusMessage}${refreshErrorSuffix}`
      : `刷新恢复请求失败。${focusMessage}${refreshErrorSuffix}`;
    await saveBatchState({
      ...latest,
      message,
      batchTabId: chatTab.id,
      refreshRecoveryFailureCount: failureCount,
      lastRefreshRecoveryFailureAt: failureTime,
      logs: latest.logs.concat({
        time: failureTime,
        level: "error",
        message
      }).slice(-60)
    });
    return;
  }

  if (lastFocusAt && now - lastFocusAt < BATCH_FOCUS_COOLDOWN_MS) return;
  await bringToFront(chatTab.id);

  const latest = await getBatchState();
  if (!isCurrentBatchMessage(latest, current.batchId)) return;
  await saveBatchState({
    ...latest,
    message: "刷新恢复请求失败，已激活 ChatGPT 网页。",
    batchTabId: chatTab.id,
    lastFocusAt: new Date().toISOString(),
    refreshRecoveryFailureCount: 0,
    lastRefreshRecoveryFailureAt: "",
    logs: latest.logs.concat({
      time: new Date().toISOString(),
      level: "info",
      message: "刷新恢复请求失败，已激活 ChatGPT 网页。"
    }).slice(-60)
  });
}

async function ensureChatTab(newChat, newChatUrl = "", options = {}) {
  const normalizedNewChatUrl = normalizeChatLaunchUrl(newChatUrl);
  const launchUrl = normalizedNewChatUrl || CHAT_HOME;
  const activate = options.active !== false;
  if (newChat) {
    const existing = await findChatTab();
    if (existing) {
      const updateProperties = activate
        ? { url: launchUrl, active: true }
        : { url: launchUrl };
      await chrome.tabs.update(existing.id, updateProperties);
      await waitForTabComplete(existing.id);
      return existing;
    }

    const created = await chrome.tabs.create({ url: launchUrl, active: activate });
    await waitForTabComplete(created.id);
    return created;
  }

  const existing = await findChatTab();
  if (existing) {
    if (normalizedNewChatUrl) {
      const updateProperties = activate
        ? { url: launchUrl, active: true }
        : { url: launchUrl };
      await chrome.tabs.update(existing.id, updateProperties);
      await waitForTabComplete(existing.id);
    }
    return existing;
  }

  const created = await chrome.tabs.create({ url: launchUrl, active: activate });
  await waitForTabComplete(created.id);
  return created;
}

function getChatLaunchKey(value) {
  try {
    const url = new URL(String(value || ""));
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return "";
  }
}

async function findChatMaintenanceTab(launchUrl = "") {
  const tabs = await chrome.tabs.query({ url: ["https://chatgpt.com/*", "https://chat.openai.com/*"] });
  if (!tabs.length) return null;
  const launchKey = getChatLaunchKey(launchUrl);
  if (launchKey) {
    return tabs.find((tab) => getChatLaunchKey(tab.url) === launchKey) || null;
  }
  return tabs.find((tab) => tab.active) || tabs[0] || null;
}

async function getChatMaintenanceTab(newChatUrl = "", options = {}) {
  const launchUrl = normalizeChatLaunchUrl(newChatUrl) || CHAT_HOME;
  const requestedTabId = Number(options.tabId) || 0;
  if (requestedTabId > 0) {
    try {
      const tab = await chrome.tabs.get(requestedTabId);
      if (tab && isChatTabUrl(tab.url)) {
        return { tab, temporary: false };
      }
    } catch {}
  }

  const existing = await findChatMaintenanceTab(launchUrl);
  if (existing) {
    return { tab: existing, temporary: false };
  }

  throw new Error(newChatUrl
    ? "没有找到指定对话创建位置对应的 ChatGPT 标签页。请打开或刷新这个项目页后再清理。"
    : "没有找到可用的 ChatGPT 标签页。请打开需要清理的 ChatGPT 页面后再清理。");
}

async function closeTabIfExists(tabId) {
  const id = Number(tabId) || 0;
  if (id <= 0) return;
  try {
    await chrome.tabs.remove(id);
  } catch {}
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

function sendMessageToChatTab(tabId, type, payload) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { type, payload }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (response && response.ok) {
        resolve(response);
        return;
      }
      reject(new Error(response && response.error ? response.error : "内容脚本没有正确响应。"));
    });
  });
}

function isMissingReceiverError(error) {
  const message = String(error && error.message ? error.message : error || "");
  return /Receiving end does not exist/i.test(message) || /Could not establish connection/i.test(message);
}

async function ensureChatContentScript(tabId) {
  await waitForTabComplete(tabId);
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["chatgpt_content.js"]
  });
  await sleep(120);
}

async function sendMessageToChatTabSafely(tabId, type, payload) {
  let lastError = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await sendMessageToChatTab(tabId, type, payload);
    } catch (error) {
      lastError = error;
      if (!isMissingReceiverError(error)) {
        throw error;
      }

      await ensureChatContentScript(tabId);
    }
  }

  throw lastError || new Error("内容脚本连接失败。");
}

function composePromptText(prefix, text) {
  const cleanPrefix = typeof prefix === "string" ? prefix.trimEnd() : "";
  const cleanText = typeof text === "string" ? text : "";
  if (!cleanPrefix) return cleanText;
  return `${cleanPrefix}\n${cleanText}`;
}

function getHotkeyPresetConfig(settings, presetIndex) {
  const index = [1, 2, 3, 4].includes(Number(presetIndex)) ? Number(presetIndex) : 1;
  return {
    index,
    prefix: settings[`prefix${index}`],
    autoSend: Boolean(settings[`autoSend${index}`]),
    newChat: Boolean(settings[`newChat${index}`])
  };
}

function getPresetIndexFromCommand(command) {
  const match = String(command || "").match(/send_to_gpt_(\d)$/);
  const index = match ? Number(match[1]) : 1;
  return [1, 2, 3, 4].includes(index) ? index : 1;
}

async function sendQuickSelectionStatus(tabId, payload) {
  if (!tabId) return;
  try {
    await sendMessageToTab(tabId, {
      type: "GPT_QUICK_SEARCH_STATUS",
      payload
    });
  } catch {}
}

async function handleSelectionQuickMessage(payload, sender) {
  const text = typeof payload?.text === "string" ? payload.text.trim() : "";
  const sourceTabId = sender?.tab?.id || 0;
  const requestId = typeof payload?.requestId === "string" && payload.requestId
    ? payload.requestId
    : crypto.randomUUID();
  const action = payload?.action === "explain" || payload?.action === "translate"
    ? payload.action
    : "";
  const presetIndex = [1, 2, 3, 4].includes(Number(payload?.presetIndex))
    ? Number(payload.presetIndex)
    : 1;

  if (!text) {
    return { ok: false, requestId, error: "没有可发送的选中文本。" };
  }

  const settings = await getHotkeySettings();
  const quickMessageProjectUrl = settings.quickMessageProjectUrl || "";
  const config = action
    ? {
        prefix: action === "explain" ? EXPLAIN_PREFIX : DEFAULT_PREFIX,
        newChat: settings.selectionBubbleUseCurrentChat === false
      }
    : getHotkeyPresetConfig(settings, presetIndex);

  try {
    await sendQuickSelectionStatus(sourceTabId, {
      requestId,
      status: "sending",
      message: "正在打开或连接 ChatGPT 页面..."
    });

    const chatTab = await ensureChatTab(config.newChat, quickMessageProjectUrl, { active: false });
    await sendQuickSelectionStatus(sourceTabId, {
      requestId,
      status: "answering",
      message: "GPT 正在回答..."
    });

    const result = await sendMessageToChatTabSafely(chatTab.id, "EXT_SEND_TO_GPT_AND_READ_REPLY", {
      text,
      prefix: config.prefix,
      newChat: config.newChat,
      progressTargetTabId: sourceTabId,
      requestId
    });

    const reply = result?.reply || "";
    await sendQuickSelectionStatus(sourceTabId, {
      requestId,
      status: "done",
      reply
    });

    return { ok: true, requestId, reply };
  } catch (error) {
    const errorMessage = String(error && error.message ? error.message : error);
    await sendQuickSelectionStatus(sourceTabId, {
      requestId,
      status: "error",
      error: errorMessage
    });
    return { ok: false, requestId, error: errorMessage };
  }
}

function normalizeEnglishGlobalPromptFormatRule(value) {
  const oldNumberedRule = /5 The first time a person appears, use English \(Chinese\)\. After that, use the English name\. The first time a relevant term appears, include the Chinese translation in parentheses\. Do not use footnotes; links may be included at the end of paragraphs\./g;
  const oldInlineRule = /The first time a person appears, use English \(Chinese\)\. After that, use the English name\. The first time a relevant term appears, include the Chinese translation in parentheses\. Do not use footnotes; links may be included at the end of paragraphs\./g;
  const oldSplitRule = /The first time a person appears, use English \(Chinese\)\. After that, use the English name\.\nThe first time a relevant term appears, include the Chinese translation in parentheses\. Do not use footnotes; links may be included at the end of paragraphs\./g;
  const oldNumberedSourceRule = /1 Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text\. Avoid Chinese sources\. Do not explicitly name website sources while writing; you may name the specific texts, scholars, or arguments that support a point\./g;
  const oldUseSourceRule = /Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text\. Use Chinese-language sources as little as possible\. Do not name websites as sources while writing; you may name the specific texts, scholars, or viewpoints that support a point\./g;
  const oldSearchSourceRule = /Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text\. Search Chinese-language sources as little as possible\. Do not name websites as sources while writing; you may name the specific texts, scholars, or viewpoints that support a point\./g;
  const newRule = "When a relevant term has an established original-language name, include that original name in parentheses the first time the term appears. Do not use footnotes; links may be included at the end of paragraphs.";
  const newNumberedSourceRule = "1 Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Prefer English-language sources and reliable original-language sources. Do not explicitly name website sources while writing; you may name the specific texts, scholars, or arguments that support a point.";
  const newSourceRule = "Prioritize Stanford Encyclopedia of Philosophy, Wikipedia, Britannica, and information related to the original text. Prefer English-language sources and reliable original-language sources. Do not name websites as sources while writing; you may name the specific texts, scholars, or viewpoints that support a point.";
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(oldNumberedSourceRule, newNumberedSourceRule)
    .replace(oldUseSourceRule, newSourceRule)
    .replace(oldSearchSourceRule, newSourceRule)
    .replace(oldNumberedRule, `5 ${newRule}`)
    .replace(oldSplitRule, newRule)
    .replace(oldInlineRule, newRule);
}

function normalizePromptText(text) {
  return normalizeEnglishGlobalPromptFormatRule(text)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeRegExp(text) {
  return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripLeadingPrompt(text, prompt) {
  const normalizedText = normalizePromptText(text);
  const normalizedPrompt = normalizePromptText(prompt);
  if (!normalizedText || !normalizedPrompt) {
    return normalizedText;
  }

  const promptPattern = new RegExp(`^${escapeRegExp(normalizedPrompt)}(?:\\s*\\n+|\\s+)`, "i");
  if (promptPattern.test(normalizedText)) {
    return normalizedText.replace(promptPattern, "").trim();
  }

  return normalizedText;
}

function isGlobalPromptQuestion(text, prompt) {
  const normalizedText = normalizePromptText(text);
  const normalizedPrompt = normalizePromptText(prompt);
  return Boolean(normalizedText && normalizedPrompt && normalizedText === normalizedPrompt);
}

async function getBatchPromptConfig() {
  const items = await getSync(BATCH_CONFIG_DEFAULTS);
  return {
    globalPrompts: [
      items.batchGlobalPrompt,
      BATCH_DEFAULT_GLOBAL_PROMPT,
      BATCH_EN_GLOBAL_PROMPT,
      SOCIOLOGY_STANDALONE_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
      SOCIOLOGY_SUBJECT_TITLE_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
      SOCIOLOGY_TITLE_RULES_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
      SOCIOLOGY_LAST_BATCH_DEFAULT_GLOBAL_PROMPT,
      SOCIOLOGY_LAST_BATCH_EN_GLOBAL_PROMPT,
      SOCIOLOGY_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
      SOCIOLOGY_PREVIOUS_BATCH_EN_GLOBAL_PROMPT,
      LITERARY_THEORY_BATCH_DEFAULT_GLOBAL_PROMPT,
      LITERARY_THEORY_BATCH_EN_GLOBAL_PROMPT,
      ETHICS_BATCH_DEFAULT_GLOBAL_PROMPT,
      ETHICS_BATCH_EN_GLOBAL_PROMPT,
      LAST_BATCH_DEFAULT_GLOBAL_PROMPT,
      PRIOR_BATCH_DEFAULT_GLOBAL_PROMPT,
      CURRENT_BATCH_DEFAULT_GLOBAL_PROMPT,
      RECENT_BATCH_DEFAULT_GLOBAL_PROMPT,
      PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
      LEGACY_BATCH_DEFAULT_GLOBAL_PROMPT
    ].map(normalizePromptText).filter(Boolean),
    messagePrompts: [
      items.batchPrompt,
      BATCH_DEFAULT_PROMPT,
      BATCH_EN_PROMPT,
      LEGACY_BATCH_EN_PROMPT,
      RECENT_BATCH_DEFAULT_PROMPT,
      LEGACY_BATCH_DEFAULT_PROMPT
    ].map(normalizePromptText).filter(Boolean)
  };
}

function sanitizeExportedQuestion(question, config) {
  let normalizedQuestion = normalizePromptText(question);
  if (!normalizedQuestion) {
    return "";
  }

  if (config.globalPrompts.some((prompt) => isGlobalPromptQuestion(normalizedQuestion, prompt))) {
    return "";
  }

  for (const prompt of config.messagePrompts) {
    normalizedQuestion = stripLeadingPrompt(normalizedQuestion, prompt);
  }

  return normalizePromptText(normalizedQuestion);
}

const EXPORT_TOOL_PAYLOAD_KEYS = new Set([
  "search_query",
  "image_query",
  "open",
  "click",
  "find",
  "screenshot",
  "finance",
  "weather",
  "sports",
  "time",
  "response_length"
]);

function stripCitationArtifacts(text) {
  return String(text || "")
    .replace(/\s*[\uE000-\uF8FF]*cite[\uE000-\uF8FF]*(?:turn\d+(?:search|view|open|click|find|image|finance|weather|sports|time)\d+[\uE000-\uF8FF]*)+[\uE000-\uF8FF]*\s*/giu, " ")
    .replace(/\s*NciteÖturn\d+(?:search|view|open|click|find|image|finance|weather|sports|time)\d+(?:Öturn\d+(?:search|view|open|click|find|image|finance|weather|sports|time)\d+)*\s*/giu, " ")
    .replace(/[ \t]{2,}/g, " ");
}

function isLikelyToolPayloadBlock(block) {
  const normalized = String(block || "").trim();
  if (!normalized) {
    return false;
  }

  const looksLikeToolPayloadText =
    /"(?:search_query|image_query|open|click|find|screenshot|finance|weather|sports|time|response_length)"\s*:/i.test(normalized) &&
    /turn\d+(?:search|view|open|click|find|image|finance|weather|sports|time)\d+/i.test(normalized);

  if (looksLikeToolPayloadText) {
    return true;
  }

  if (!(normalized.startsWith("{") && normalized.endsWith("}"))) {
    return false;
  }

  try {
    const parsed = JSON.parse(normalized);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return false;
    }

    const keys = Object.keys(parsed);
    return Boolean(keys.length) && keys.every((key) => EXPORT_TOOL_PAYLOAD_KEYS.has(key));
  } catch {
    return false;
  }
}

function isLikelyReasoningArtifactBlock(block) {
  const normalized = String(block || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized || normalized.length > 220) {
    return false;
  }

  return /^(我先|先核对|然后对照|重点会放在|已经确认到|接下来|先看|我会先|I(?:'ll| will) first|Next, I(?:'ll| will)|I found|I've found|I've confirmed)/i.test(normalized) ||
    /(关键线索|核对|对照|整理|确认到|重点会放在|接下来|I(?:'ll| will) first|I found a key clue|I've confirmed)/i.test(normalized);
}

function extractLeadingJsonObject(text) {
  const normalized = String(text || "").trimStart();
  if (!normalized.startsWith("{")) {
    return "";
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") {
      depth += 1;
      continue;
    }
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return normalized.slice(0, index + 1);
      }
    }
  }

  return "";
}

function stripLeadingToolPayload(text) {
  let normalized = String(text || "").replace(/\r\n?/g, "\n").trim();

  while (normalized) {
    const leadingJson = extractLeadingJsonObject(normalized);
    if (!leadingJson || !isLikelyToolPayloadBlock(leadingJson)) {
      break;
    }

    normalized = normalized.slice(leadingJson.length).replace(/^\s+/, "");
  }

  return normalized.trim();
}

function stripToolArtifactBlocks(text) {
  const normalizedText = stripLeadingToolPayload(String(text || "").replace(/\r\n?/g, "\n"));
  const blocks = normalizedText
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return "";
  }

  const removedIndexes = new Set();
  for (let index = 0; index < blocks.length; index += 1) {
    if (!isLikelyToolPayloadBlock(blocks[index])) {
      continue;
    }

    removedIndexes.add(index);
    if (index > 0 && isLikelyReasoningArtifactBlock(blocks[index - 1])) {
      removedIndexes.add(index - 1);
    }
    if (index + 1 < blocks.length && isLikelyReasoningArtifactBlock(blocks[index + 1])) {
      removedIndexes.add(index + 1);
    }
  }

  return blocks
    .filter((_, index) => !removedIndexes.has(index))
    .join("\n\n")
    .trim();
}

function stripMarkdownLinksForSignal(text) {
  return String(text || "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\(https?:\/\/[^)]+\)/gi, " ")
    .replace(/https?:\/\/[^\s)]+/gi, " ");
}

function isReferenceOnlyMarkdownLine(line) {
  const normalized = String(line || "").replace(/\s+/g, " ").trim();
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

function isSourceArtifactLine(line) {
  const normalized = String(line || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return false;
  }
  if (/^参考链接$/u.test(normalized)) {
    return true;
  }
  if (/^[-*]\s*\[[^\]]+]\(https?:\/\/[^)]+\)\s*$/i.test(normalized)) {
    return true;
  }

  const sourceLikeWords = normalized.match(/\b(?:Stanford Encyclopedia of Philosophy|Encyclopedia Britannica|Britannica|Wikipedia|Internet Archive|Sources?|History of Economic Thought|dokumen\.pub|JSTOR|Project Gutenberg|Gutenberg)\b/gi) || [];
  const plusCount = (normalized.match(/\+\d+/g) || []).length;
  const urlCount = (normalized.match(/https?:\/\//gi) || []).length;
  return plusCount >= 2 || urlCount >= 2 || (sourceLikeWords.length >= 2 && plusCount >= 1);
}

function isSourceSummaryArtifactLine(line) {
  const normalized = String(line || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return false;
  }

  const sourceLikeWords = normalized.match(/\b(?:Stanford Encyclopedia of Philosophy|Encyclopedia Britannica|Britannica|Wikipedia|Internet Archive|Sources?|History of Economic Thought|dokumen\.pub|JSTOR|Project Gutenberg|Gutenberg)\b/gi) || [];
  const plusCount = (normalized.match(/\+\d+/g) || []).length;
  const urlCount = (normalized.match(/https?:\/\//gi) || []).length;
  return plusCount >= 2 || urlCount >= 2 || (sourceLikeWords.length >= 2 && plusCount >= 1);
}

function stripSourceSummaryArtifactLines(text) {
  return String(text || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter((line) => !isSourceSummaryArtifactLine(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function hasAnswerBodyText(text) {
  const bodyCandidate = String(text || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter((line) => {
      const normalized = String(line || "").replace(/\s+/g, " ").trim();
      return normalized &&
        !isReferenceOnlyMarkdownLine(normalized) &&
        !isSourceArtifactLine(normalized) &&
        !/^Thought for\b/i.test(normalized) &&
        !/^思考/.test(normalized) &&
        !/^Sources$/i.test(normalized);
    })
    .join("\n");

  const signal = stripMarkdownLinksForSignal(bodyCandidate)
    .replace(/[`*_#>\-|()[\]{}.,;:!?，。！？、；：（）【】《》“”‘’·]/g, " ")
    .replace(/\s+/g, "");
  return signal.length >= 20 && /[\p{L}\p{N}]/u.test(signal);
}

function isTransientChatGptErrorAnswer(answer) {
  const normalized = String(answer || "")
    .replace(/\s+/g, " ")
    .trim();
  return /^Something went wrong while processing your request\. Please try again\.?$/i.test(normalized) ||
    /message (?:send|sending) timed out/i.test(normalized) ||
    /timed out[^\n.。]*try again/i.test(normalized) ||
    /request timed out/i.test(normalized) ||
    /network error/i.test(normalized) ||
    /there was an error generating (?:a )?response/i.test(normalized) ||
    (/please retry/i.test(normalized) && /message|send|sending|request|response|generation|error|timeout/i.test(normalized)) ||
    (/please try again/i.test(normalized) && /message|send|sending|request|response|generation|error|timeout/i.test(normalized)) ||
    /消息发送超时/u.test(normalized) ||
    /发送超时/u.test(normalized) ||
    /请求超时/u.test(normalized) ||
    /网络错误/u.test(normalized) ||
    /请再试一次/u.test(normalized) ||
    (/请重试/u.test(normalized) && /消息|发送|请求|回答|响应|生成|错误|超时/u.test(normalized)) ||
    (/重试/u.test(normalized) && /已停止思考|发送失败|生成失败/u.test(normalized));
}

function sanitizeExportedAnswer(answer) {
  const withoutCitations = stripCitationArtifacts(answer);
  const withoutToolArtifacts = stripToolArtifactBlocks(withoutCitations);
  const withoutSourceArtifacts = stripSourceSummaryArtifactLines(withoutToolArtifacts);
  const cleaned = withoutSourceArtifacts
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return hasAnswerBodyText(cleaned) ? cleaned : "";
}

function sanitizeExportedChatPairs(pairs, config) {
  const sanitizedPairs = [];

  for (const pair of Array.isArray(pairs) ? pairs : []) {
    const question = sanitizeExportedQuestion(pair?.question, config);
    const answer = sanitizeExportedAnswer(pair?.answer);
    if (!question || !answer) {
      continue;
    }

    sanitizedPairs.push({
      question,
      answer
    });
  }

  return sanitizedPairs;
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

function sanitizeBatchInputText(text) {
  return extractBatchInputText(text)
    .replace(/(\d)\.(?=\d)/g, "$1_")
    .replace(/[◆◇]/g, " ")
    .replace(/[│┃┆┇┊┋├┝┞┟┠┡┢┣└┕┖┗┘┙┚┛─━╴╵╶╷╸╹╺╻╼╽╾╿]+/g, " ")
    .replace(/^[\s|\\/]+/g, " ")
    .replace(/\.(md|txt|markdown|rtf|doc|docx|pdf)\b/gi, " ")
    .replace(/[\\/:*?"<>|`~!@#$%^&*()+=[\]{};,.''，。！？、；：（）【】《》“”‘’·\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.+$/, "");
}

function normalizeBatchSendText(value) {
  return extractBatchInputText(value)
    .replace(/\s+/g, " ")
    .trim();
}

function formatMarkdownBody(answer) {
  const normalized = String(answer || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return normalizeMarkdownContentForSave(normalized);
}

function convertMarkdownEmphasisToHtml(text) {
  let inFence = false;
  return String(text || "")
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;

      return line
        .split(/(`[^`]*`)/g)
        .map((part) => {
          if (/^`[^`]*`$/.test(part)) return part;
          return part
            .replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>")
            .replace(/(^|[^\w*])\*([^*\n]+?)\*(?=$|[^\w*])/g, "$1<em>$2</em>")
            .replace(/(^|[^\w_])_([^_\n]+?)_(?=$|[^\w_])/g, "$1<em>$2</em>");
        })
        .join("");
    })
    .join("\n");
}

function getMarkdownLinkPattern() {
  return /!?\[([^\]]*)]\((https?:\/\/[^\s)]+(?:\([^\s)]*\)[^\s)]*)?)(?:\s+["'][^"']*["'])?\)/gi;
}

function stripTrailingUrlPunctuation(url) {
  let normalized = String(url || "").trim().replace(/[.,;:!?，。！？、；：]+$/u, "");
  const count = (text, pattern) => (text.match(pattern) || []).length;
  while (
    normalized.endsWith(")") &&
    count(normalized, /\(/g) < count(normalized, /\)/g)
  ) {
    normalized = normalized.slice(0, -1).trim();
  }
  return normalized;
}

function formatReferenceLinkText(label, url) {
  const cleanUrl = stripTrailingUrlPunctuation(url);
  const cleanLabel = String(label || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleanLabel || /^https?:\/\//i.test(cleanLabel) || cleanLabel === cleanUrl) {
    return cleanUrl;
  }
  return `${cleanLabel} ${cleanUrl}`;
}

function stripReferenceBacklinks(text) {
  return String(text || "")
    .replace(/\s*\[\[#\^[^\]|]+(?:\|[^\]]*)?]]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeReferenceTarget(text) {
  const normalized = stripReferenceBacklinks(text)
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "";

  const linkOnly = new RegExp(`^${getMarkdownLinkPattern().source}$`, "i").exec(normalized);
  if (linkOnly) {
    return formatReferenceLinkText(linkOnly[1], linkOnly[2]);
  }

  return normalized
    .replace(getMarkdownLinkPattern(), (_match, label, url) => formatReferenceLinkText(label, url))
    .replace(/https?:\/\/[^\s<>\]\[，。！？、；：]+/gi, (match) => stripTrailingUrlPunctuation(match))
    .replace(/\s+/g, " ")
    .trim();
}

function extractTrailingBlockId(line) {
  const match = String(line || "").match(/^(.*?)(?:\s+\^([A-Za-z0-9_-]+))\s*$/u);
  if (!match) {
    return { text: String(line || ""), blockId: "" };
  }
  return {
    text: match[1],
    blockId: match[2]
  };
}

function parseFootnoteDefinitionLine(line) {
  const match = String(line || "").trim().match(/^\[\^([^\]]+)\]\s*:\s*(.+)$/u);
  if (!match) return null;
  return {
    label: match[1].trim(),
    target: normalizeReferenceTarget(match[2])
  };
}

function isReferenceHeadingLine(line) {
  return /^#{0,6}\s*(?:Footnotes?|参考链接)\s*$/iu.test(String(line || "").trim());
}

function isStandaloneReferenceLine(line) {
  const normalized = String(line || "").trim();
  if (!normalized) return false;
  if (parseFootnoteDefinitionLine(normalized)) return true;
  if (/^\[\d+\]\s*:?\s+.+$/u.test(normalized)) return true;
  if (/^(?:[-*]|\d+\.)\s+.+$/u.test(normalized) && /https?:\/\//i.test(normalized)) return true;
  if (new RegExp(`^${getMarkdownLinkPattern().source}$`, "i").test(normalized)) return true;
  return /^https?:\/\/\S+$/i.test(normalized);
}

function collectReferenceTargetsFromLine(line, footnoteDefs, targets) {
  let normalized = String(line || "").trim();
  if (!normalized) return;

  const footnote = parseFootnoteDefinitionLine(normalized);
  if (footnote && footnote.label && footnote.target) {
    footnoteDefs.set(footnote.label, footnote.target);
    return;
  }

  normalized = normalized
    .replace(/^(?:[-*]|\d+\.)\s+/u, "")
    .replace(/^\[\d+\]\s*:?\s+/u, "")
    .trim();

  const target = normalizeReferenceTarget(normalized);
  if (target) targets.push(target);
}

function convertPlainTextLinksToEndnotes(text, footnoteDefs, addReference, markFootnoteUsed) {
  const pattern = new RegExp(`${getMarkdownLinkPattern().source}|\\[\\^([^\\]]+)\\]|(https?:\\/\\/[^\\s<>\\]\\[，。！？、；：]+)`, "gi");
  return String(text || "").replace(pattern, (match, markdownLabel, markdownUrl, footnoteLabel, rawUrl) => {
    if (markdownUrl) {
      return addReference(formatReferenceLinkText(markdownLabel, markdownUrl));
    }
    if (footnoteLabel) {
      const cleanLabel = String(footnoteLabel || "").trim();
      const target = footnoteDefs.get(cleanLabel);
      if (target && typeof markFootnoteUsed === "function") {
        markFootnoteUsed(cleanLabel);
      }
      return target ? addReference(target) : match;
    }
    if (rawUrl) {
      const url = stripTrailingUrlPunctuation(rawUrl);
      const suffix = match.slice(url.length);
      return `${addReference(url)}${suffix}`;
    }
    return match;
  });
}

function convertMarkdownLinksToEndnotes(content) {
  const footnoteDefs = new Map();
  const usedFootnoteLabels = new Set();
  const numericReferenceDefs = new Map();
  const usedNumericReferenceLabels = new Set();
  const pendingReferenceTargets = [];
  const referenceTargets = [];
  const bodyLines = [];
  let inFence = false;
  let inReferenceSection = false;

  const addReference = (target) => {
    const normalized = normalizeReferenceTarget(target);
    if (!normalized) return "";
    referenceTargets.push(normalized);
    return `[${referenceTargets.length}]`;
  };

  for (const line of String(content || "").replace(/\r\n?/g, "\n").split("\n")) {
    const isFenceLine = /^\s*(```|~~~)/.test(line);
    if (isFenceLine && !inReferenceSection) {
      bodyLines.push(line);
      inFence = !inFence;
      continue;
    }

    if (!inFence && isReferenceHeadingLine(line)) {
      inReferenceSection = true;
      continue;
    }

    if (inReferenceSection) {
      const numericDef = String(line || "").trim().match(/^\[(\d+)\]\s*:?\s+(.+)$/u);
      if (numericDef) {
        numericReferenceDefs.set(numericDef[1], normalizeReferenceTarget(numericDef[2]));
        continue;
      }
      collectReferenceTargetsFromLine(line, footnoteDefs, pendingReferenceTargets);
      continue;
    }

    if (!inFence) {
      const footnote = parseFootnoteDefinitionLine(line);
      if (footnote && footnote.label && footnote.target) {
        footnoteDefs.set(footnote.label, footnote.target);
        continue;
      }
    }

    bodyLines.push(line);
  }

  while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) {
    bodyLines.pop();
  }
  const trailingReferenceLines = [];
  while (bodyLines.length && isStandaloneReferenceLine(bodyLines[bodyLines.length - 1])) {
    trailingReferenceLines.push(bodyLines.pop());
    while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) {
      bodyLines.pop();
    }
  }
  trailingReferenceLines.reverse().forEach((line) => {
    const numericDef = String(line || "").trim().match(/^\[(\d+)\]\s*:?\s+(.+)$/u);
    if (numericDef) {
      numericReferenceDefs.set(numericDef[1], normalizeReferenceTarget(numericDef[2]));
      return;
    }
    collectReferenceTargetsFromLine(line, footnoteDefs, pendingReferenceTargets);
  });

  inFence = false;
  const convertedBody = bodyLines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return line;
    }
    if (inFence) return line;

    const lineBlock = extractTrailingBlockId(line);
    const convertedLine = lineBlock.text
      .split(/(`[^`]*`)/g)
      .map((part) => {
        if (/^`[^`]*`$/.test(part)) return part;
        const numericConverted = part
          .replace(/\[(\d+)\]/g, (match, label) => {
            const target = numericReferenceDefs.get(label);
            if (!target) return match;
            usedNumericReferenceLabels.add(label);
            return addReference(target);
          });
        return convertPlainTextLinksToEndnotes(
          numericConverted,
          footnoteDefs,
          addReference,
          (label) => usedFootnoteLabels.add(label)
        );
      })
      .join("")
      .replace(/\(\s*(\[\d+\])\s*\)/g, "$1")
      .replace(/（\s*(\[\d+\])\s*）/g, "$1");

    return convertedLine;
  }).join("\n").trimEnd();

  for (const [label, target] of footnoteDefs) {
    if (!usedFootnoteLabels.has(label)) {
      addReference(target);
    }
  }
  for (const [label, target] of numericReferenceDefs) {
    if (!usedNumericReferenceLabels.has(label)) {
      addReference(target);
    }
  }
  pendingReferenceTargets.forEach(addReference);
  if (!referenceTargets.length) return convertedBody;

  const referenceLines = referenceTargets.map((reference, index) => `[${index + 1}] ${reference}`);
  return `${convertedBody}\n\n## Footnotes\n\n参考链接\n\n${referenceLines.join("\n")}\n`;
}

function normalizeMarkdownContentForSave(content) {
  return convertMarkdownLinksToEndnotes(convertMarkdownEmphasisToHtml(content));
}

async function normalizeSavedMarkdownContent(fileHandle) {
  const file = await fileHandle.getFile();
  const content = await file.text();
  const normalized = normalizeMarkdownContentForSave(content);
  if (normalized === content) return;

  const writable = await fileHandle.createWritable();
  await writable.write(normalized);
  await writable.close();
}

function buildMarkdownContent(text, answer) {
  const body = formatMarkdownBody(answer);
  return body ? `${body}\n` : "";
}

function normalizeChatExportMode(value) {
  return value === CHAT_EXPORT_MODE_SINGLE ? CHAT_EXPORT_MODE_SINGLE : CHAT_EXPORT_MODE_SEPARATE;
}

function buildSingleChatExportContent(pairs) {
  const normalized = Array.isArray(pairs)
    ? pairs
      .map((pair) => ({
        question: String(pair?.question || "").trim(),
        answer: formatMarkdownBody(pair?.answer || "")
      }))
      .filter((pair) => pair.question && pair.answer)
    : [];

  const sections = normalized.map((pair, index) => [
    `## ${index + 1}. ${pair.question}`,
    pair.answer
  ].join("\n\n"));

  return `# 当前对话导出\n\n${sections.join("\n\n")}\n`;
}

function buildTermIndexContent(terms) {
  const normalized = Array.isArray(terms)
    ? terms.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  const lines = normalized.map((item, index) => `${index + 1}. ${item}`);
  if (!lines.length) {
    return "# 对话导出-词条清单\n";
  }
  return `# 对话导出-词条清单\n\n${lines.join("\n\n")}\n`;
}

function createFilenameBase(text) {
  const sanitized = sanitizeBatchInputText(text);

  return (sanitized || "chatgpt-回答").slice(0, 120);
}

function normalizeDirectoryPath(directoryPath) {
  if (!Array.isArray(directoryPath)) return [];
  return directoryPath
    .map((item) => createFilenameBase(item))
    .filter(Boolean)
    .slice(0, 20);
}

function normalizeBatchItem(item) {
  if (item && typeof item === "object") {
    const text = sanitizeBatchInputText(item);
    if (!text) return null;
    const sendText = normalizeBatchSendText(item.sendText) || text;
    return {
      text,
      sendText,
      itemNumber: normalizeBatchItemNumber(item.itemNumber),
      directoryPath: normalizeDirectoryPath(item.directoryPath)
    };
  }

  const text = sanitizeBatchInputText(item);
  if (!text) return null;
  return { text, sendText: text, itemNumber: "", directoryPath: [] };
}

function normalizeExistingMarkdownBase(filename) {
  const baseName = String(filename || "")
    .replace(/\.md$/i, "")
    .replace(/\s+\(\d+\)$/u, "")
    .trim();
  return createFilenameBase(baseName);
}

function createBatchDuplicateKey(text, directoryPath = []) {
  const pathKey = normalizeDirectoryPath(directoryPath)
    .map((item) => item.toLowerCase())
    .join("/");
  const fileKey = createFilenameBase(text)
    .replace(/(\d)[\s_]+(?=\d)/g, "$1_")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return `${pathKey}::${fileKey}`;
}

function createBatchGlobalDuplicateKey(text) {
  const fileKey = createFilenameBase(text)
    .replace(/(\d)[\s_]+(?=\d)/g, "$1_")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return `::${fileKey}`;
}

async function listExistingMarkdownBaseNames(directoryHandle, directoryPath = []) {
  const names = new Set();
  if (!directoryHandle || typeof directoryHandle.values !== "function") {
    return names;
  }

  for await (const entry of directoryHandle.values()) {
    if (!entry) {
      continue;
    }
    if (entry.kind === "directory") {
      const childNames = await listExistingMarkdownBaseNames(entry, directoryPath.concat(entry.name || ""));
      for (const childName of childNames) {
        names.add(childName);
      }
      continue;
    }
    if (entry.kind === "file" && /\.md$/i.test(entry.name || "")) {
      const baseName = normalizeExistingMarkdownBase(entry.name);
      const scopedKey = createBatchDuplicateKey(baseName, directoryPath);
      const globalKey = createBatchGlobalDuplicateKey(baseName);
      if (scopedKey) {
        names.add(scopedKey);
      }
      if (globalKey) {
        names.add(globalKey);
      }
    }
  }

  return names;
}

async function getReadableOutputDirectoryHandle() {
  const directoryHandle = await getOutputDirectoryHandle();
  if (!directoryHandle) {
    throw new Error("保存目录不存在，请重新选择目录。");
  }

  if (typeof directoryHandle.queryPermission === "function") {
    const permission = await directoryHandle.queryPermission({ mode: "read" });
    if (permission !== "granted") {
      throw new Error("保存目录没有读取权限，请重新选择目录。");
    }
  }

  return directoryHandle;
}

function splitBatchItemsByExistingFiles(items, existingBaseNames) {
  const pendingItems = [];
  const pendingIndexes = [];
  const skippedItems = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const scopedKey = createBatchDuplicateKey(item.text, item.directoryPath);
    const globalKey = createBatchGlobalDuplicateKey(item.text);
    if (existingBaseNames.has(scopedKey) || existingBaseNames.has(globalKey)) {
      skippedItems.push(item.text);
      continue;
    }
    pendingItems.push(item);
    pendingIndexes.push(index + 1);
  }

  return { pendingItems, pendingIndexes, skippedItems };
}

async function createUniqueFileHandle(directoryHandle, baseName) {
  for (let index = 0; index < 1000; index += 1) {
    const filename = index === 0 ? `${baseName}.md` : `${baseName} (${index + 1}).md`;
    try {
      await directoryHandle.getFileHandle(filename);
    } catch (error) {
      if (error && error.name === "NotFoundError") {
        const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
        return fileHandle;
      }
      throw error;
    }
  }

  throw new Error("目录中存在过多同名文件。");
}

async function getNestedDirectoryHandle(rootHandle, directoryPath) {
  let currentHandle = rootHandle;
  for (const folderName of normalizeDirectoryPath(directoryPath)) {
    currentHandle = await currentHandle.getDirectoryHandle(folderName, { create: true });
  }
  return currentHandle;
}

function getSaveErrorText(error) {
  return String(error && error.message ? error.message : error || "");
}

function isFileSystemPathUnavailableError(error) {
  const text = getSaveErrorText(error);
  return error?.name === "NotFoundError" ||
    text.includes("requested file or directory could not be found") ||
    text.includes("file or directory could not be found") ||
    text.includes("系统找不到指定的路径");
}

function formatSaveTargetText(directoryHandle, directoryPath, baseName) {
  const parts = [
    directoryHandle?.name || "",
    ...normalizeDirectoryPath(directoryPath),
    `${baseName}.md`
  ].filter(Boolean);
  return parts.join("\\");
}

async function writeMarkdownFileToDirectory(text, content, directoryPath = []) {
  const directoryHandle = await getOutputDirectoryHandle();
  if (!directoryHandle) {
    throw new Error("保存目录不存在，请重新选择目录。");
  }

  if (typeof directoryHandle.queryPermission === "function") {
    const permission = await directoryHandle.queryPermission({ mode: "readwrite" });
    if (permission !== "granted") {
      throw new Error("保存目录没有写入权限，请重新选择目录。");
    }
  }

  const baseName = createFilenameBase(text);
  const normalizedPath = normalizeDirectoryPath(directoryPath);
  let fileHandle = null;
  try {
    const targetDirectoryHandle = await getNestedDirectoryHandle(directoryHandle, normalizedPath);
    fileHandle = await createUniqueFileHandle(targetDirectoryHandle, baseName);
    const normalizedContent = normalizeMarkdownContentForSave(content);
    const writable = await fileHandle.createWritable();
    await writable.write(normalizedContent);
    await writable.close();
    await normalizeSavedMarkdownContent(fileHandle);
  } catch (error) {
    if (isFileSystemPathUnavailableError(error)) {
      const targetText = formatSaveTargetText(directoryHandle, normalizedPath, baseName);
      throw new Error(`保存路径不可用，请重新选择保存目录，或缩短保存目录/标题：${targetText}。${getSaveErrorText(error)}`);
    }
    throw error;
  }

  const pathText = normalizedPath.join("\\");
  return {
    locationText: pathText
      ? `已选目录：${directoryHandle.name ? `${directoryHandle.name}\\${pathText}` : pathText}`
      : directoryHandle.name ? `已选目录：${directoryHandle.name}` : "已选目录",
    filename: fileHandle.name
  };
}

async function saveMarkdownResult(text, content, directoryPath = []) {
  const result = await writeMarkdownFileToDirectory(text, content, directoryPath);
  return {
    savedBy: "directory",
    locationText: result.locationText,
    filename: result.filename
  };
}

async function handleHotkeyCommand(command) {
  const selection = await getSelectedTextOnActiveTab();
  const selectedText = selection.text || "";
  if (!selectedText.trim()) return;

  const settings = await getHotkeySettings();
  const presetIndex = getPresetIndexFromCommand(command);
  const presetConfig = getHotkeyPresetConfig(settings, presetIndex);
  const quickMessageProjectUrl = settings.quickMessageProjectUrl || "";

  if (selection.canDisplayInPage && selection.tabId) {
    try {
      const response = await sendMessageToTab(selection.tabId, {
        type: "GPT_QUICK_SEARCH_START_FROM_COMMAND",
        payload: {
          requestId: crypto.randomUUID(),
          presetIndex,
          text: selectedText
        }
      });
      if (response && response.ok) return;
    } catch {}
  }

  const payload = {
    text: selectedText,
    prefix: presetConfig.prefix,
    autoSend: presetConfig.autoSend,
    newChat: presetConfig.newChat
  };

  const chatTab = await ensureChatTab(presetConfig.newChat, quickMessageProjectUrl);
  await bringToFront(chatTab.id);
  await sendMessageToChatTabSafely(chatTab.id, "EXT_SEND_TO_GPT", payload);
}

async function handleStartBatch(payload) {
  const globalPrompt = typeof payload?.globalPrompt === "string" ? payload.globalPrompt : "";
  const prompt = typeof payload?.prompt === "string" ? payload.prompt : "";
  const items = Array.isArray(payload?.items)
    ? payload.items.map((item) => normalizeBatchItem(item)).filter(Boolean)
    : [];
  const newChat = payload?.newChat !== false;
  const newChatUrl = normalizeChatLaunchUrl(payload?.newChatUrl);
  const batchModel = normalizeBatchModel(payload?.batchModel);
  const delaySeconds = BATCH_DEFAULT_DELAY_SECONDS;
  const focusWhenStuck = payload?.focusWhenStuck === true;
  const controlMode = payload?.controlMode === true;
  const directoryName = typeof payload?.directoryName === "string" ? payload.directoryName : "";
  const currentState = await getBatchState();
  const batchId = crypto.randomUUID();

  if (!items.length) {
    return { ok: false, error: "请输入至少一条待处理文本。" };
  }

  if (!directoryName) {
    return { ok: false, error: "请先选择目录。" };
  }

  if (currentState.running) {
    return { ok: false, error: "已有批量任务正在执行中。", state: currentState };
  }

  let pendingItems = items;
  let pendingIndexes = items.map((_, index) => index + 1);
  let skippedItems = [];
  try {
    const directoryHandle = await getReadableOutputDirectoryHandle();
    const existingBaseNames = await listExistingMarkdownBaseNames(directoryHandle);
    ({ pendingItems, pendingIndexes, skippedItems } = splitBatchItemsByExistingFiles(items, existingBaseNames));
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }

  const startedAt = new Date().toISOString();
  const lastActivityAt = startedAt;
  const skippedLogs = skippedItems.length
    ? [{
      time: startedAt,
      level: "info",
      message: `已跳过 ${skippedItems.length} 条已存在标题。`
    }]
    : [];
  const initialState = {
    running: Boolean(pendingItems.length),
    batchId: pendingItems.length ? batchId : "",
    total: items.length,
    completed: 0,
    failed: 0,
    skipped: skippedItems.length,
    currentIndex: skippedItems.length,
    currentText: "",
    message: pendingItems.length
      ? "正在打开 ChatGPT 页面……"
      : "所有标题都已经保存过，本次没有发送新消息。",
    startedAt,
    finishedAt: pendingItems.length ? "" : startedAt,
    delaySeconds,
    directoryName,
    failedItems: [],
    retryAttempt: 0,
    maxRefreshRetries: BATCH_DEFAULT_MAX_REFRESH_RETRIES,
    focusWhenStuck,
    controlMode,
    batchTabId: 0,
    lastActivityAt,
    lastHeartbeatAt: lastActivityAt,
    lastStuckRefreshAt: "",
    lastStuckRefreshProgressKey: "",
    lastFocusAt: "",
    lastControlFocusAt: "",
    refreshRecoveryFailureCount: 0,
    lastRefreshRecoveryFailureAt: "",
    logs: [
      {
        time: startedAt,
        level: "info",
        message: `批量任务已开始，共 ${items.length} 条。`
      },
      ...skippedLogs
    ]
  };

  await saveBatchState(initialState);
  if (!pendingItems.length) {
    return { ok: true, state: initialState };
  }

  (async () => {
    try {
      const chatTab = await ensureChatTab(newChat, newChat ? newChatUrl : "");
      await bringToFront(chatTab.id);
      const latest = await getBatchState();
      if (isCurrentBatchMessage(latest, batchId)) {
        await saveBatchState({
          ...latest,
          batchTabId: chatTab.id,
          lastControlFocusAt: controlMode ? new Date().toISOString() : latest.lastControlFocusAt
        });
      }
      await sendMessageToChatTabSafely(chatTab.id, "EXT_START_BATCH_EXPORT", {
        batchId,
        globalPrompt,
        prompt,
        items: pendingItems,
        itemIndexes: pendingIndexes,
        totalCount: items.length,
        completedOffset: skippedItems.length,
        newChat,
        newChatUrl: newChat ? newChatUrl : "",
        batchModel,
        delaySeconds,
        controlMode,
        directoryName
      });

      await appendBatchLogIfCurrent(batchId, "ChatGPT 页面已接收批量任务。");
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      const current = await getBatchState();
      if (!isCurrentBatchMessage(current, batchId)) {
        return;
      }

      await saveBatchState({
        ...current,
        running: false,
        batchId: "",
        message,
        finishedAt: new Date().toISOString(),
        logs: current.logs.concat({
          time: new Date().toISOString(),
          level: "error",
          message
        }).slice(-60)
      });
    }
  })();

  return { ok: true, state: initialState };
}

async function handleStartChatExport(payload) {
  const directoryName = typeof payload?.directoryName === "string" ? payload.directoryName : "";
  const exportMode = normalizeChatExportMode(payload?.exportMode);
  const currentState = await getChatExportState();
  const exportId = crypto.randomUUID();

  if (!directoryName) {
    return { ok: false, error: "请先选择目录。" };
  }

  if (currentState.running) {
    return { ok: false, error: "当前已有对话导出任务正在执行中。", state: currentState };
  }

  const startedAt = new Date().toISOString();
  const initialState = {
    running: true,
    exportId,
    total: 0,
    completed: 0,
    failed: 0,
    currentIndex: 0,
    currentText: "",
    message: "正在读取当前对话……",
    startedAt,
    finishedAt: "",
    directoryName,
    exportMode,
    logs: [{
      time: startedAt,
      level: "info",
      message: exportMode === CHAT_EXPORT_MODE_SINGLE
        ? "当前对话导出已开始：同一个 MD。"
        : "当前对话导出已开始：逐条 MD。"
    }]
  };

  await saveChatExportState(initialState);

  (async () => {
    try {
      const chatTab = await findChatTab();
      if (!chatTab || !chatTab.id) {
        throw new Error("没有找到已打开的 ChatGPT 对话页面。");
      }

      const response = await sendMessageToChatTabSafely(chatTab.id, "EXT_EXPORT_CURRENT_CONVERSATION", {
        exportId
      });
      const batchPromptConfig = await getBatchPromptConfig();
      const pairs = sanitizeExportedChatPairs(response?.pairs, batchPromptConfig);
      const terms = pairs.map((pair) => pair.question).filter(Boolean);
      if (!pairs.length) {
        throw new Error(response && response.error ? response.error : "当前对话没有可导出的问答内容。");
      }

      let runningState = await getChatExportState();
      if (!isCurrentChatExportMessage(runningState, exportId)) {
        return;
      }

      const readAt = new Date().toISOString();
      const titleSummary = terms.length
        ? `已识别标题：${terms.join("；")}`
        : "";
      runningState = await saveChatExportState({
        ...runningState,
        total: pairs.length,
        message: `已读取 ${pairs.length} 组问答，正在保存……`,
        logs: runningState.logs.concat([
          ...(titleSummary
            ? [{
              time: readAt,
              level: "info",
              message: titleSummary
            }]
            : []),
          {
            time: readAt,
            level: "info",
            message: `当前对话共读取到 ${pairs.length} 组问答。`
          }
        ]).slice(-80)
      });

      if (exportMode === CHAT_EXPORT_MODE_SINGLE) {
        let completed = 0;
        let failed = 0;
        let logLevel = "info";
        let logMessage = "";

        try {
          const content = buildSingleChatExportContent(pairs);
          const saveResult = await saveMarkdownResult("当前对话导出", content);
          completed = pairs.length;
          logLevel = "success";
          logMessage = `已保存同一个 MD 文件，共 ${pairs.length} 组问答。${saveResult.locationText}`;
        } catch (error) {
          failed = pairs.length;
          logLevel = "error";
          logMessage = `同一个 MD 文件保存失败：${error && error.message ? error.message : String(error)}`;
        }

        runningState = await getChatExportState();
        if (!isCurrentChatExportMessage(runningState, exportId)) {
          return;
        }

        const finishedAt = new Date().toISOString();
        const message = failed
          ? `当前对话导出结束，成功 ${completed} 组，失败 ${failed} 组。`
          : `当前对话导出结束，已保存同一个 MD 文件，共 ${completed} 组问答。`;

        await saveChatExportState({
          ...runningState,
          running: false,
          exportId: "",
          total: pairs.length,
          completed,
          failed,
          currentIndex: pairs.length,
          currentText: "当前对话导出",
          message,
          finishedAt,
          logs: runningState.logs.concat(
            {
              time: finishedAt,
              level: logLevel,
              message: logMessage
            },
            {
              time: finishedAt,
              level: failed ? "error" : "info",
              message
            }
          ).slice(-80)
        });
        return;
      }

      if (terms.length) {
        const indexContent = buildTermIndexContent(terms);
        const indexResult = await saveMarkdownResult("对话导出-词条清单", indexContent);
        runningState = await getChatExportState();
        if (!isCurrentChatExportMessage(runningState, exportId)) {
          return;
        }
        runningState = await saveChatExportState({
          ...runningState,
          logs: runningState.logs.concat({
            time: new Date().toISOString(),
            level: "info",
            message: `已记录词条清单，共 ${terms.length} 条。${indexResult.locationText}`
          }).slice(-80)
        });
      }

      let completed = 0;
      let failed = 0;

      for (let index = 0; index < pairs.length; index += 1) {
        const question = typeof pairs[index]?.question === "string" ? pairs[index].question.trim() : "";
        const answer = typeof pairs[index]?.answer === "string" ? pairs[index].answer : "";

        runningState = await getChatExportState();
        if (!isCurrentChatExportMessage(runningState, exportId)) {
          return;
        }

        let logLevel = "info";
        let logMessage = "";
        if (!question || !answer) {
          failed += 1;
          logLevel = "error";
          logMessage = `第 ${index + 1}/${pairs.length} 组失败：问答内容不完整。`;
        } else {
          try {
            const content = buildMarkdownContent(question, answer);
            const saveResult = await saveMarkdownResult(question, content);
            completed += 1;
            logLevel = "success";
            logMessage = `第 ${index + 1}/${pairs.length} 组已保存：${question}。${saveResult.locationText}`;
          } catch (error) {
            failed += 1;
            logLevel = "error";
            logMessage = `第 ${index + 1}/${pairs.length} 组保存失败：${question}。${error && error.message ? error.message : String(error)}`;
          }
        }

        const logAt = new Date().toISOString();
        runningState = await getChatExportState();
        if (!isCurrentChatExportMessage(runningState, exportId)) {
          return;
        }

        await saveChatExportState({
          ...runningState,
          total: pairs.length,
          completed,
          failed,
          currentIndex: index + 1,
          currentText: question,
          message: `正在导出第 ${index + 1}/${pairs.length} 组问答……`,
          logs: runningState.logs.concat({
            time: logAt,
            level: logLevel,
            message: logMessage
          }).slice(-80)
        });
      }

      runningState = await getChatExportState();
      if (!isCurrentChatExportMessage(runningState, exportId)) {
        return;
      }

      const finishedAt = new Date().toISOString();
      const message = failed
        ? `当前对话导出结束，成功 ${completed} 组，失败 ${failed} 组。`
        : `当前对话导出结束，共保存 ${completed} 组问答。`;

      await saveChatExportState({
        ...runningState,
        running: false,
        exportId: "",
        completed,
        failed,
        message,
        finishedAt,
        logs: runningState.logs.concat({
          time: finishedAt,
          level: "info",
          message
        }).slice(-80)
      });
    } catch (error) {
      const failedState = await getChatExportState();
      if (!isCurrentChatExportMessage(failedState, exportId)) {
        return;
      }

      const finishedAt = new Date().toISOString();
      const message = error && error.message ? error.message : String(error);
      await saveChatExportState({
        ...failedState,
        running: false,
        exportId: "",
        message,
        finishedAt,
        logs: failedState.logs.concat({
          time: finishedAt,
          level: "error",
          message
        }).slice(-80)
      });
    }
  })();

  return { ok: true, state: initialState };
}

async function handleBatchProgress(payload, senderTabId = 0) {
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, payload?.batchId)) {
    return current;
  }

  const patch = {};
  const progressTabId = Number(senderTabId) || 0;

  if (typeof payload?.running === "boolean") patch.running = payload.running;
  if (typeof payload?.total === "number") patch.total = payload.total;
  if (typeof payload?.currentIndex === "number") patch.currentIndex = payload.currentIndex;
  if (typeof payload?.currentText === "string") patch.currentText = payload.currentText;
  if (typeof payload?.itemNumber === "string") patch.currentItemNumber = normalizeBatchItemNumber(payload.itemNumber);
  if (typeof payload?.sentText === "string") patch.sentText = payload.sentText;
  if (typeof payload?.message === "string") patch.message = payload.message;
  if (typeof payload?.startedAt === "string") patch.startedAt = payload.startedAt;
  if (Number.isFinite(Number(payload?.retryAttempt))) {
    patch.retryAttempt = Math.max(0, Number(payload.retryAttempt));
  }
  if (Number.isFinite(Number(payload?.maxRefreshRetries))) {
    patch.maxRefreshRetries = Math.max(0, Number(payload.maxRefreshRetries));
  }
  if (progressTabId > 0) patch.batchTabId = progressTabId;
  patch.lastActivityAt = new Date().toISOString();

  const progressMoved = typeof patch.currentIndex === "number" && patch.currentIndex > current.currentIndex;
  return saveBatchState({
    ...current,
    ...patch,
    ...(progressMoved ? {
      lastStuckRefreshAt: "",
      lastStuckRefreshProgressKey: "",
      refreshRecoveryFailureCount: 0,
      lastRefreshRecoveryFailureAt: ""
    } : {})
  });
}

async function handleBatchHeartbeat(payload, senderTabId = 0) {
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, payload?.batchId)) {
    return current;
  }

  const heartbeatTabId = Number(senderTabId) || 0;
  return saveBatchState({
    ...current,
    ...(heartbeatTabId > 0 ? { batchTabId: heartbeatTabId } : {}),
    lastHeartbeatAt: new Date().toISOString()
  });
}

async function handleBatchItemResult(payload) {
  const index = typeof payload?.index === "number" ? payload.index : 0;
  const total = typeof payload?.total === "number" ? payload.total : 0;
  const text = typeof payload?.text === "string" ? payload.text : `item-${index}`;
  const directoryPath = normalizeDirectoryPath(payload?.directoryPath);
  const itemNumber = normalizeBatchItemNumber(payload?.itemNumber);
  const errorMessage = typeof payload?.error === "string" ? payload.error : "";
  const answer = typeof payload?.answer === "string" ? payload.answer : "";
  const retryAttempt = Number.isFinite(Number(payload?.retryAttempt)) ? Math.max(0, Number(payload.retryAttempt)) : 0;
  const maxRetries = Number.isFinite(Number(payload?.maxRetries))
    ? Math.max(0, Number(payload.maxRetries))
    : BATCH_DEFAULT_MAX_REFRESH_RETRIES;
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, payload?.batchId)) {
    return { ok: false, saved: false, retry: false, state: current };
  }

  let nextCompleted = current.completed;
  let nextFailed = current.failed;
  let logMessage = "";
  let logLevel = "info";
  let failedItem = null;
  let retry = false;
  let retryReason = "";

  if (errorMessage) {
    if (retryAttempt < maxRetries && isRetryableBatchItemError(errorMessage)) {
      retry = true;
      retryReason = errorMessage;
      logMessage = `第 ${index}/${total} 条保存失败，${formatBatchRetryAction(retryAttempt + 1, maxRetries)}：${text}。${errorMessage}`;
    } else {
      nextFailed += 1;
      logLevel = "error";
      logMessage = `第 ${index}/${total} 条失败：${text}。${errorMessage}`;
      failedItem = {
        time: new Date().toISOString(),
        index,
        total,
        text,
        itemNumber,
        directoryPath,
        reason: errorMessage
      };
    }
  } else {
    try {
      if (isTransientChatGptErrorAnswer(answer)) {
        throw new Error("ChatGPT 返回临时错误，请刷新页面后重试。");
      }
      const cleanedAnswer = sanitizeExportedAnswer(answer);
      if (!cleanedAnswer) {
        throw new Error("回答内容为空。");
      }
      const content = buildMarkdownContent(text, cleanedAnswer);
      const saveResult = await saveMarkdownResult(text, content, directoryPath);
      nextCompleted += 1;
      logLevel = "success";
      logMessage = `第 ${index}/${total} 条已保存：${formatBatchLogTitle(text, directoryPath, itemNumber)}`;
    } catch (error) {
      const reason = error && error.message ? error.message : String(error);
      if (retryAttempt < maxRetries && isRetryableBatchItemError(reason)) {
        retry = true;
        retryReason = reason;
        logMessage = `第 ${index}/${total} 条保存失败，${formatBatchRetryAction(retryAttempt + 1, maxRetries)}：${text}。${reason}`;
      } else {
        nextFailed += 1;
        logLevel = "error";
        logMessage = `第 ${index}/${total} 条保存失败：${text}。${reason}`;
        failedItem = {
          time: new Date().toISOString(),
          index,
          total,
          text,
          itemNumber,
          directoryPath,
          reason
        };
      }
    }
  }

  const logs = current.logs.concat({
    time: new Date().toISOString(),
    level: logLevel,
    message: logMessage
  }).slice(-60);
  const failedItems = failedItem
    ? (current.failedItems || []).concat(failedItem).slice(-100)
    : (current.failedItems || []);

  const state = await saveBatchState({
    ...current,
    completed: nextCompleted,
    failed: nextFailed,
    currentIndex: index,
    currentText: text,
    currentItemNumber: itemNumber,
    retryAttempt: retry ? retryAttempt + 1 : 0,
    maxRefreshRetries: maxRetries,
    message: logMessage,
    lastActivityAt: new Date().toISOString(),
    lastStuckRefreshAt: "",
    lastStuckRefreshProgressKey: "",
    refreshRecoveryFailureCount: 0,
    lastRefreshRecoveryFailureAt: "",
    logs,
    failedItems
  });
  return {
    ok: true,
    saved: Boolean(logLevel === "success"),
    retry,
    error: retryReason,
    state
  };
}

async function handleBatchRetryInNewTab(payload, sourceTabId) {
  const batchId = typeof payload?.batchId === "string" ? payload.batchId : "";
  const retryPayload = payload?.retryPayload && typeof payload.retryPayload === "object"
    ? { ...payload.retryPayload }
    : null;
  const index = typeof payload?.index === "number" ? payload.index : 0;
  const total = typeof payload?.total === "number" ? payload.total : 0;
  const text = typeof payload?.text === "string" ? payload.text : "";
  const sentText = typeof payload?.sentText === "string" ? payload.sentText : text;
  const retryAttempt = Number.isFinite(Number(payload?.retryAttempt)) ? Math.max(0, Number(payload.retryAttempt)) : 0;
  const maxRetries = Number.isFinite(Number(payload?.maxRetries))
    ? Math.max(0, Number(payload.maxRetries))
    : BATCH_DEFAULT_MAX_REFRESH_RETRIES;
  const reason = typeof payload?.reason === "string" ? payload.reason.trim() : "";
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, batchId)) {
    return { ok: true, ignored: true, state: current };
  }
  if (!retryPayload) {
    return { ok: false, error: "新标签页重试参数缺失。", state: current };
  }

  const message = `第 ${index}/${total} 条刷新后仍失败，正在第 ${retryAttempt}/${maxRetries} 次新标签页重试。${reason || ""}`.trim();
  const now = new Date().toISOString();
  await saveBatchState({
    ...current,
    running: true,
    currentIndex: index,
    currentText: text,
    sentText,
    retryAttempt,
    maxRefreshRetries: maxRetries,
    message,
    logs: current.logs.concat({
      time: now,
      level: "info",
      message
    }).slice(-60)
  });

  const launchUrl = normalizeChatLaunchUrl(retryPayload.newChatUrl) || CHAT_HOME;
  const chatTab = await chrome.tabs.create({ url: launchUrl, active: true });
  await waitForTabComplete(chatTab.id, 20000);
  await ensureChatContentScript(chatTab.id);
  const latest = await getBatchState();
  if (isCurrentBatchMessage(latest, batchId)) {
    await saveBatchState({
      ...latest,
      batchTabId: chatTab.id,
      lastControlFocusAt: latest.controlMode ? new Date().toISOString() : latest.lastControlFocusAt
    });
  }
  await sendMessageToChatTabSafely(chatTab.id, "EXT_START_BATCH_EXPORT", {
    ...retryPayload,
    batchId,
    newChat: true,
    newChatUrl: launchUrl,
    resumeNeedsGlobalPrompt: true
  });
  await appendBatchLogIfCurrent(batchId, `第 ${index}/${total} 条已在新标签页继续重试。`);
  closeRetrySourceTab(sourceTabId, chatTab.id).catch(() => {});
  return { ok: true, state: await getBatchState(), tabId: chatTab.id };
}

async function handleBatchContinueInNewTab(payload, sourceTabId) {
  const batchId = typeof payload?.batchId === "string" ? payload.batchId : "";
  const resumePayload = payload?.resumePayload && typeof payload.resumePayload === "object"
    ? { ...payload.resumePayload }
    : null;
  const index = typeof payload?.index === "number" ? payload.index : 0;
  const total = typeof payload?.total === "number" ? payload.total : 0;
  const message = typeof payload?.message === "string" && payload.message.trim()
    ? payload.message.trim()
    : `已处理 ${Math.max(0, index - 1)} 条，正在打开新的项目对话……`;
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, batchId)) {
    return { ok: true, ignored: true, state: current };
  }
  if (!resumePayload) {
    return { ok: false, error: "新对话续跑参数缺失。", state: current };
  }

  const launchUrl = normalizeChatLaunchUrl(payload?.newChatUrl || resumePayload.newChatUrl) || CHAT_HOME;
  const now = new Date().toISOString();
  await saveBatchState({
    ...current,
    running: true,
    currentIndex: index,
    retryAttempt: 0,
    message,
    logs: current.logs.concat({
      time: now,
      level: "info",
      message
    }).slice(-60)
  });

  const chatTab = await chrome.tabs.create({ url: launchUrl, active: true });
  await waitForTabComplete(chatTab.id, 20000);
  await ensureChatContentScript(chatTab.id);
  const latest = await getBatchState();
  if (isCurrentBatchMessage(latest, batchId)) {
    await saveBatchState({
      ...latest,
      batchTabId: chatTab.id,
      lastControlFocusAt: latest.controlMode ? new Date().toISOString() : latest.lastControlFocusAt
    });
  }
  await sendMessageToChatTabSafely(chatTab.id, "EXT_START_BATCH_EXPORT", {
    ...resumePayload,
    batchId,
    newChat: true,
    newChatUrl: launchUrl
  });
  await appendBatchLogIfCurrent(batchId, `第 ${index}/${total} 条已在新项目对话继续。`);
  closeRetrySourceTab(sourceTabId, chatTab.id).catch(() => {});
  return { ok: true, state: await getBatchState(), tabId: chatTab.id };
}

async function handleDeleteProgressConversationsProgress(payload) {
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (!message) return await getBatchState();

  const level = typeof payload?.level === "string" ? payload.level : "info";
  const current = await getBatchState();
  const logs = current.logs.concat({
    time: new Date().toISOString(),
    level,
    message
  }).slice(-60);

  return saveBatchState({
    ...current,
    message,
    logs
  });
}

async function handleDeleteProgressConversations(payload) {
  let maintenanceTab = null;
  let closeMaintenanceTab = false;
  const current = await getBatchState();
  if (current.running) {
    return { ok: false, error: "批量任务仍在执行中。" };
  }

  const mode = payload?.mode === "delete" ? "delete" : "list";
  const actionText = mode === "delete" ? "删除已确认的进度标题对话" : "读取进度标题对话列表";
  const launchUrl = normalizeChatLaunchUrl(payload?.newChatUrl);
  const locationText = launchUrl ? "指定位置已有" : "已有 ChatGPT";

  try {
    await handleDeleteProgressConversationsProgress({ message: `正在使用${locationText}标签页，用于${actionText}……` });
    const maintenance = await getChatMaintenanceTab(launchUrl, {
      tabId: payload?.maintenanceTabId
    });
    maintenanceTab = maintenance.tab;
    closeMaintenanceTab = false;
    await handleDeleteProgressConversationsProgress({ message: `${locationText}标签页已找到，正在注入脚本……` });
    await ensureChatContentScript(maintenanceTab.id);
    await handleDeleteProgressConversationsProgress({ message: `脚本已注入，正在${actionText}……` });
    const result = await sendMessageToChatTabSafely(maintenanceTab.id, "EXT_DELETE_PROGRESS_CONVERSATIONS", payload || {});
    return result;
  } finally {
    if (maintenanceTab?.id && closeMaintenanceTab) {
      await closeTabIfExists(maintenanceTab.id);
    }
  }
}

async function handleBatchFinished(payload) {
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, payload?.batchId)) {
    return current;
  }
  const finishedAt = new Date().toISOString();
  const message = typeof payload?.message === "string"
    ? payload.message
    : `任务结束，成功 ${current.completed} 条，失败 ${current.failed} 条。`;

  const logs = current.logs.concat({
    time: finishedAt,
    level: "info",
    message
  }).slice(-60);

  return saveBatchState({
    ...current,
    running: false,
    batchId: "",
    retryAttempt: 0,
    message,
    finishedAt,
    refreshRecoveryFailureCount: 0,
    lastRefreshRecoveryFailureAt: "",
    logs
  });
}

async function handleBatchFailed(payload) {
  const current = await getBatchState();
  if (!isCurrentBatchMessage(current, payload?.batchId)) {
    return current;
  }
  const finishedAt = new Date().toISOString();
  const errorMessage = typeof payload?.error === "string" ? payload.error : "批量任务执行失败。";

  const logs = current.logs.concat({
    time: finishedAt,
    level: "error",
    message: errorMessage
  }).slice(-60);
  const failedItems = (current.failedItems || []).concat({
    time: finishedAt,
    index: current.currentIndex || 0,
    total: current.total || 0,
    text: current.currentText || "批量任务",
    directoryPath: [],
    reason: errorMessage
  }).slice(-100);

  return saveBatchState({
    ...current,
    running: false,
    batchId: "",
    retryAttempt: 0,
    message: errorMessage,
    finishedAt,
    refreshRecoveryFailureCount: 0,
    lastRefreshRecoveryFailureAt: "",
    logs,
    failedItems
  });
}

async function handleStopBatch() {
  const current = await getBatchState();
  if (!current.running || !current.batchId) {
    return { ok: false, error: "当前没有正在执行的批量任务。", state: current };
  }

  const batchId = current.batchId;
  const finishedAt = new Date().toISOString();
  const logs = current.logs.concat({
    time: finishedAt,
    level: "info",
    message: "批量任务已停止。"
  }).slice(-60);

  const state = await saveBatchState({
    ...current,
    running: false,
    batchId: "",
    retryAttempt: 0,
    message: "任务已停止。",
    finishedAt,
    refreshRecoveryFailureCount: 0,
    lastRefreshRecoveryFailureAt: "",
    logs
  });

  (async () => {
    try {
      const tabs = await chrome.tabs.query({ url: ["https://chatgpt.com/*", "https://chat.openai.com/*"] });
      await Promise.all(tabs
        .filter((tab) => tab && tab.id)
        .map((tab) => sendMessageToChatTabSafely(tab.id, "EXT_STOP_BATCH_EXPORT", { batchId }).catch(() => null)));
    } catch {}
  })();

  return { ok: true, state };
}

chrome.commands.onCommand.addListener((command) => {
  if (!["send_to_gpt_1", "send_to_gpt_2", "send_to_gpt_3", "send_to_gpt_4"].includes(command)) return;
  handleHotkeyCommand(command).catch(() => {});
});

if (chrome.alarms) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm && alarm.name === BATCH_FOCUS_ALARM_NAME) {
      handleBatchFocusAlarm().catch(() => {});
    }
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type) return;

  if (message.type === "SELECTION_BUBBLE_SEND_TO_GPT") {
    handleSelectionQuickMessage(message.payload, _sender)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "SELECTION_REPLY_PROGRESS") {
    const targetTabId = Number(message.payload?.targetTabId);
    if (Number.isInteger(targetTabId) && targetTabId > 0) {
      sendQuickSelectionStatus(targetTabId, {
        requestId: message.payload?.requestId || "",
        status: "answering",
        message: "GPT 正在回答...",
        reply: message.payload?.reply || ""
      }).then(() => sendResponse({ ok: true }))
        .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
      return true;
    }
    sendResponse({ ok: false, error: "缺少目标标签页。" });
    return true;
  }

  if (message.type === "GET_BATCH_STATE") {
    getBatchState()
      .then((state) => sendResponse({ ok: true, state }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "GET_CHAT_EXPORT_STATE") {
    getChatExportState()
      .then((state) => sendResponse({ ok: true, state }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "START_BATCH_EXPORT") {
    handleStartBatch(message.payload)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "START_CHAT_EXPORT") {
    handleStartChatExport(message.payload)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "CHAT_EXPORT_PROGRESS") {
    handleChatExportProgress(message.payload)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "STOP_CHAT_EXPORT") {
    handleStopChatExport()
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "STOP_BATCH_EXPORT") {
    handleStopBatch()
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "BATCH_PROGRESS") {
    handleBatchProgress(message.payload, _sender?.tab?.id)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "BATCH_HEARTBEAT") {
    handleBatchHeartbeat(message.payload, _sender?.tab?.id)
      .then((state) => sendResponse({ ok: true, state }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "DELETE_PROGRESS_CONVERSATIONS_PROGRESS") {
    handleDeleteProgressConversationsProgress(message.payload)
      .then((state) => sendResponse({ ok: true, state }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "BATCH_ITEM_RESULT") {
    handleBatchItemResult(message.payload)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "BATCH_RETRY_IN_NEW_TAB") {
    handleBatchRetryInNewTab(message.payload, _sender?.tab?.id)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "BATCH_CONTINUE_IN_NEW_TAB") {
    handleBatchContinueInNewTab(message.payload, _sender?.tab?.id)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "DELETE_PROGRESS_CONVERSATIONS") {
    handleDeleteProgressConversations(message.payload)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "CLOSE_DELETE_PROGRESS_TAB") {
    closeTabIfExists(message.payload?.tabId)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "BATCH_FINISHED") {
    handleBatchFinished(message.payload)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }

  if (message.type === "BATCH_FAILED") {
    handleBatchFailed(message.payload)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error && error.message ? error.message : error) }));
    return true;
  }
});
