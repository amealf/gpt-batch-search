const HOTKEY_DEFAULT_PREFIX = "请将下列文本翻译成中文：";
const HOTKEY_LEGACY_EXPLAIN_PREFIX = "请展开解释以下文本";
const HOTKEY_EXPLAIN_PREFIX = "请展开解释以下文本：";
const HOTKEY_PRESET_VERSION_KEY = "hotkeyPresetVersion";
const HOTKEY_PRESET_VERSION = 3;
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
const BATCH_DEFAULT_INPUTS = `├─ 1. 古典诗学时期（Classical Poetics）
│  ├─ 1_1 Debates, Paradigm Shifts, and Contexts（论战、范式更新与时代背景）
│  │  ├─ ◆ 1_1_1 Plato on Poetry in Republic Book X（柏拉图《理想国》第十卷中的诗歌问题）
│  │  ├─ ◆ 1_1_2 Plato versus Aristotle on Mimesis（柏拉图与亚里士多德的模仿论之争）
│  │  ├─ ◆ 1_1_3 Homeric Poetry and Civic Education（荷马史诗与城邦教育）`;
const DISCIPLINE_MAP_PROMPT = `# 核心任务

我想用obsidian梳理「xxx当前热门领域/议题」的思想地图，请设计一个文件夹的架构。 不用解释原因，不用专门给我文字的回答。我只要一个详细的文件夹的架构。包括所有我应该了解的内容。用code框输出答案。 

包含领域/议题介绍、重要学者、重要文本（影响力最大的导论/教科书/论文）三个部分。搜索各培养计划、主流信息源、学科顶级刊物后回答。  
我的设计思路是：如果是初步了解，阅读「介绍」是最高效的。在读者希望深入了解时，可以再看其他部分。 

# 内容与结构要求

各级标题使用中文（英文）格式

作品/文章名的中文需要加书名号

文本是「人名」、「书名」（或论文）、「概念名」时，取一个概括全文的标题，格式如下：
《自我的根源》 1989 Sources of the Self：泰勒：现代身份与道德来源
查尔斯 泰勒 1931– Charles Taylor：承认政治与现代自我理论

标题偏向学术地位、理论贡献、研究对象、方法贡献、具体内容概括。标题要求书面、简洁，避免完整口语句、疑问句、讲解。尤其避免「如何」「怎样」「为什么」「把」「了」「一门」「一种」「不是……而是……」「写成」「让……」
# 架构规范

框架分成三个等级：

大章节：1. 2. 3.

二级章节： 1_1 1_2

三级标题： 1_2_1

具体的正文内容： 最后一级标题+符号◆， 比如如果这个正文在三级标题下面，就写成 1_2_1 ◆ + 正文`;
const DISCIPLINE_MAP_EN_PROMPT = `# Core Task

I want to use Obsidian to organize a discipline map for "xxx current popular field/topic". Design a folder structure. Do not explain the reasons or give a separate prose answer. I only need a detailed folder structure that includes everything I should know. Output the answer in a code block.

Include three parts: an introduction to the field/topic, important scholars, and important texts (the most influential introductions, textbooks, and papers). Search degree programs, mainstream information sources, and top journals in the discipline before answering.
The design idea is this: when someone wants an initial overview, reading the "Introduction" section is the most efficient. When readers want to go deeper, they can then read the other sections.

# Content and Structure Requirements

Use English for all heading levels. When a relevant non-English original name matters, include the original name in parentheses on first appearance.

Works originally written in a non-English language may include the original title in parentheses.

When the text is a person name, book title (or paper), or concept name, create a title that summarizes the full entry. Use this format:
The Protestant Ethic and the Spirit of Capitalism 1905 (Die protestantische Ethik und der Geist des Kapitalismus): Weber: Religion and the Formation of Modern Capitalism
Max Weber 1864-1920: Interpretive Sociology and Rationalization Theory

Titles should lean toward academic status, theoretical contribution, research object, methodological contribution, or a concise summary of specific content. Titles should be written and concise. Avoid full conversational sentences, questions, or explanations. Especially avoid "how", "why", "how to", "turn into", "make...", "a field", "a kind of", and "not...but...".

# Structure Rules

The framework has three levels:

Major sections: 1. 2. 3.

Second-level sections: 1_1 1_2

Third-level headings: 1_2_1

Body items: final-level heading + symbol ◆. For example, if the body item is under a third-level heading, write 1_2_1 ◆ + body text`;
const BATCH_PROMPT_LANGUAGE_CN = "cn";
const BATCH_PROMPT_LANGUAGE_EN = "en";
const LEGACY_BATCH_DEFAULT_GLOBAL_PROMPT = "接下来会逐条发送一些词条标题。请每次只围绕当前这一条进行介绍，使用中文回答，不要重复说明规则。";
const LEGACY_BATCH_DEFAULT_PROMPT = "解释下列名词的概念：";
const LEGACY_BATCH_EN_PROMPT = "Please introduce:";
const RECENT_BATCH_DEFAULT_PROMPT = "请介绍：";
const LEGACY_BATCH_DEFAULT_DELAY_SECONDS = 2;
const BATCH_DEFAULT_DELAY_SECONDS = 1;
const BATCH_CONVERSATION_MODE_NEW = "new";
const BATCH_CONVERSATION_MODE_CURRENT = "current";
const CHAT_EXPORT_MODE_SEPARATE = "separate";
const CHAT_EXPORT_MODE_SINGLE = "single";
const BATCH_MODEL_DEFAULT = "default";
const BATCH_MODEL_INSTANT = "instant";
const BATCH_MODEL_THINKING = "thinking";
const BATCH_MODEL_PRO = "pro";
const BATCH_DEFAULT_MAX_REFRESH_RETRIES = 5;
const HOTKEY_DEFAULTS = {
  prefix1: HOTKEY_DEFAULT_PREFIX,
  prefix2: HOTKEY_DEFAULT_PREFIX,
  prefix3: HOTKEY_EXPLAIN_PREFIX,
  prefix4: HOTKEY_EXPLAIN_PREFIX,
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
const BATCH_CONFIG_DEFAULTS = {
  batchGlobalPrompt: BATCH_DEFAULT_GLOBAL_PROMPT,
  batchPrompt: BATCH_DEFAULT_PROMPT,
  batchPromptLanguage: BATCH_PROMPT_LANGUAGE_CN,
  batchInputs: BATCH_DEFAULT_INPUTS,
  batchConversationMode: BATCH_CONVERSATION_MODE_NEW,
  batchNewChatUrl: "",
  batchModel: BATCH_MODEL_DEFAULT,
  batchIncludeNearestHeading: true,
  batchDelaySeconds: BATCH_DEFAULT_DELAY_SECONDS,
  batchFocusWhenStuck: false,
  batchControlMode: false,
  chatExportMode: CHAT_EXPORT_MODE_SEPARATE,
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
  currentItemNumber: "",
  sentText: "",
  message: "等待任务开始。",
  startedAt: "",
  finishedAt: "",
  logs: [],
  failedItems: [],
  retryAttempt: 0,
  maxRefreshRetries: BATCH_DEFAULT_MAX_REFRESH_RETRIES,
  focusWhenStuck: false,
  controlMode: false,
  batchTabId: 0,
  lastActivityAt: "",
  lastHeartbeatAt: "",
  lastFocusAt: "",
  lastControlFocusAt: "",
  refreshRecoveryFailureCount: 0,
  lastRefreshRecoveryFailureAt: ""
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
  logs: [],
  exportMode: CHAT_EXPORT_MODE_SEPARATE
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
let hotkeySaveTimer = null;
let startPending = false;
let stopPending = false;
let exportPending = false;
let exportStopPending = false;
let deleteProgressPending = false;
let chatExportRequestToken = 0;
let currentBatchState = { ...BATCH_STATE_DEFAULT };
let currentChatExportState = { ...CHAT_EXPORT_STATE_DEFAULT };
let currentBatchDirectoryName = "";
let currentSelectionFilterUrls = [];

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
  next.currentItemNumber = extractBatchItemNumber(next.currentItemNumber || "");
  next.retryAttempt = Number.isFinite(Number(next.retryAttempt)) ? Math.max(0, Number(next.retryAttempt)) : 0;
  next.maxRefreshRetries = Number.isFinite(Number(next.maxRefreshRetries))
    ? Math.max(0, Number(next.maxRefreshRetries))
    : BATCH_DEFAULT_MAX_REFRESH_RETRIES;
  next.refreshRecoveryFailureCount = Number.isFinite(Number(next.refreshRecoveryFailureCount))
    ? Math.max(0, Number(next.refreshRecoveryFailureCount))
    : 0;
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

function setBatchDirectoryAlert(show) {
  document.getElementById("batchDirectoryGroup")?.classList.toggle("is-directory-alert", Boolean(show));
}

function updateBatchActionButtons() {
  const startButton = document.getElementById("batchStart");
  const stopButton = document.getElementById("batchStop");
  const clearButton = document.getElementById("batchClearInputs");
  const deleteProgressButton = document.getElementById("deleteProgressChats");
  const batchModelSelect = document.getElementById("batchModelSelect");
  const batchModelButton = document.getElementById("batchModelSelectButton");
  if (!startButton || !stopButton || !clearButton) return;
  startButton.disabled = startPending || currentBatchState.running;
  stopButton.disabled = stopPending || !currentBatchState.running;
  clearButton.disabled = startPending || stopPending || currentBatchState.running;
  if (batchModelSelect) {
    batchModelSelect.disabled = startPending || currentBatchState.running;
  }
  if (batchModelButton) {
    batchModelButton.disabled = startPending || currentBatchState.running;
  }
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
    listSeparator: "，",
    promptLanguage: "Prompt 语言",
    settingsPageLabel: "设置页面",
    settings: "设置",
    themeToggleTitle: "切换日间/夜间模式",
    tabBatch: "批量消息",
    tabExport: "对话导出",
    tabHotkeys: "快捷消息",
    globalPrompt: "全局 Prompt",
    globalPromptTip: "每次批量任务开始时会先发送一次这一段，然后再逐条处理下面的文本。",
    messagePrompt: "消息 Prompt",
    messagePromptTip: "每条文本都会附在这个消息 Prompt 后面发送。",
    pendingText: "待处理文本",
    pendingTextPlaceholder: "每行一条文本",
    pendingTextTip: "这里粘贴批量任务要处理的文本。带有 ◆ 的行会作为正文任务发送给 ChatGPT；没有 ◆ 的标题行会作为保存目录路径。任务开始后，插件会按层级解析目录，逐条发送带 ◆ 的内容，并将回答保存为 Markdown 文件。没有 ◆ 的标题行默认不会作为任务发送。开启「发送最近两级标题」后，最近的两级标题会和文本一起发送；可在设置页面关闭。",
    copyDisciplineMapPrompt: "生成学科地图 Prompt",
    copyDisciplineMapPromptCopyAction: "点击可复制。",
    copyDisciplineMapPromptCopyNote: "需要自行粘贴到 AI 对话，推荐使用 GPT Pro 模型。",
    copyDisciplineMapPromptTitle: "点击可复制。需要自行粘贴到 AI 对话，推荐使用 GPT Pro 模型。",
    copyDisciplineMapPromptCopied: "已复制",
    copyDisciplineMapPromptCopyFailed: "复制失败，请手动复制。",
    clearPendingText: "清除待处理文本",
    saveDirectory: "保存目录",
    selectDirectory: "选择目录",
    selectDirectoryTitle: "导出的 Markdown 文件会保存到这里。",
    required: "必选",
    requiredTitle: "请选择目录",
    batchModelTitle: "选择批量发送前尝试切换的 ChatGPT 模型。",
    batchModelDefault: "当前模型",
    batchModelInstant: "Instant",
    batchModelThinking: "Thinking",
    batchModelPro: "Pro",
    start: "开始",
    stop: "停止",
    deleteProgressChats: "清理进度对话",
    deleteProgressChatsDesc: "删除标题里带有进度的 ChatGPT 对话。",
    deleteProgressChatsTitle: "删除所有标题里带有进度的 ChatGPT 对话，例如「CPTSD 4/70」或「当前进度 256/321」。",
    deleteProgressReadingProject: "正在指定对话创建位置读取进度标题对话……",
    deleteProgressReadingRecent: "正在读取最近 3 页进度标题对话……",
    deleteProgressReadFailed: "读取进度标题对话失败。",
    deleteProgressNoProject: "指定对话创建位置没有找到进度标题对话，扫描 {scanned} 个。",
    deleteProgressNoRecent: "最近 3 页没有找到进度标题对话，扫描 {scanned} 个。",
    deleteProgressCancelledProject: "已取消删除，指定对话创建位置匹配 {count} 个进度标题对话。",
    deleteProgressCancelledRecent: "已取消删除，最近 3 页匹配 {count} 个进度标题对话。",
    deleteProgressConfirmed: "已确认删除 {count} 个进度标题对话，正在执行……",
    deleteProgressDeleteFailed: "删除进度标题对话失败。",
    deleteProgressFailedCount: "，失败 {failed} 个",
    deleteProgressDeleted: "已删除 {deleted} 个进度标题对话，确认 {matched} 个{failedText}。",
    deleteProgressConfirmTitle: "清理 {count} 个进度标题对话",
    deleteProgressConfirmDesc: "以下对话会从 ChatGPT 列表中隐藏。",
    deleteProgressConfirmCancel: "取消",
    deleteProgressConfirmDelete: "确定删除",
    focusWhenStuck: "保持网页焦点",
    focusWhenStuckDesc: "实验性功能。任务卡住时抢占屏幕焦点回到网页。",
    focusWhenStuckLabel: "",
    focusWhenStuckTip: "实验性功能。任务卡住时抢占屏幕焦点回到网页。自动刷新会始终进行，不需要开启这个选项。",
    controlMode: "调控模式",
    controlModeDesc: "任务运行期间定期激活正在执行批量任务的 ChatGPT 标签页，帮助 Chrome/Edge 保持焦点。",
    controlModeLabel: "",
    controlModeTip: "开启后会在批量任务运行期间定期激活当前批量标签页。适合浏览器容易降低后台页面活动时使用。",
    saved: "已保存",
    runStatus: "运行状态",
    failureTitle: "保存失败",
    noBatchTask: "当前没有批量任务。",
    idleStatus: "等待任务开始。",
    batchRunning: "任务执行中，共 {total} 条",
    batchFinished: "任务已结束，共 {total} 条",
    batchResultCompleted: "成功 {completed} 条",
    batchResultSkipped: "跳过 {skipped} 条",
    batchResultFailed: "失败 {failed} 条",
    batchStartedAt: "开始时间：{time}",
    batchFinishedAt: "结束时间：{time}",
    batchProgress: "当前进度：{current}/{total}",
    batchRefreshRetry: "刷新重试：{retry}/{max}",
    batchRecoveryWarning: "刷新恢复连续失败：{count} 次。请查看 ChatGPT 标签页。",
    batchCurrentText: "当前文本：{text}",
    batchStopped: "任务已停止。",
    hotkeyGuideTitle: "快捷消息使用说明",
    openShortcutSettings: "快捷键设置",
    saveHotkeySettings: "",
    hotkeyGuideStep1: "给四个预设分别写好消息 Prompt，并决定是否自动发送、是否新建会话。",
    hotkeyGuideStep2: "在任意预设右上角点击「快捷键设置」进入浏览器快捷键页面。",
    hotkeyGuideStep3: "给四个命令设置按键后，回到任意网页选中文本，按对应快捷键就会发送到 ChatGPT。",
    hotkeyGuideNote1: "修改 Prompt、自动发送、新建会话时会自动保存。设置完成以后，不需要一直停留在这个页面。",
    hotkeyGuideNote2: "四个预设彼此独立。下面的两个勾选决定的是：是否自动发送、是否打开新会话。",
    selectionBubbleEnabled: "选中文本提示按钮",
    selectionBubbleUseCurrentChat: "使用现有 GPT 页面（推荐）",
    selectionBubbleDesc: "开启后，在普通网页选中文本时会显示翻译和解释按钮，并在当前网页显示回答。",
    quickMessageProjectUrlTitle: "快捷消息项目链接",
    quickMessageProjectUrlDesc: "填写 ChatGPT Project 链接后，快捷消息和选中文本按钮会在这个项目里提问。留空时使用 GPT 主页面。",
    quickMessageProjectUrlPlaceholder: "https://chatgpt.com/g/.../project",
    quickMessageProjectUrlInputTitle: "用于快捷消息和选中文本按钮的 ChatGPT Project 链接。",
    selectionFilterButton: "过滤网址",
    selectionFilterNone: "未设置过滤网址",
    selectionFilterCount: "已过滤 {count} 个网址",
    selectionFilterTitle: "过滤网址",
    selectionFilterDesc: "在这些网址里，选中文本后不会显示发送按钮，快捷键也不会发送文本。",
    selectionFilterPlaceholder: "notion.so",
    selectionFilterAdd: "添加",
    selectionFilterRemove: "移除",
    hotkeyPreset: "预设",
    hotkeyDefaultShortcut: "默认快捷键",
    hotkeyUsage: "使用方式：选中文本后按下快捷键",
    hotkeyAutoSend: "完成后自动发送",
    hotkeyNewChat: "新建会话页",
    exportTitle: "当前对话导出",
    exportHint: "读取当前已打开的 ChatGPT 对话页面，从第一条到最后一条问答导出。可整页保存到同一个 MD 文件，也可逐条保存为多个 MD 文件。",
    exportCurrentChat: "导出当前对话",
    exportStop: "停止（重置）",
    exportModeTitle: "选择当前对话导出为一个 Markdown 文件，或逐条导出为多个 Markdown 文件。",
    exportModeSingle: "整页保存",
    exportModeSeparate: "逐条保存",
    exportNoTask: "当前没有导出任务。",
    exportRunning: "导出执行中，共 {total} 组问答",
    exportFinished: "导出已结束，共 {total} 组问答",
    exportResult: "成功 {completed} 组，失败 {failed} 组",
    exportStartedAt: "开始时间：{time}",
    exportFinishedAt: "结束时间：{time}",
    exportIdleStatus: "等待任务开始。",
    exportSaveProgress: "保存进度：{saved}/{total}",
    exportCurrentQuestion: "当前问题：{question}",
    batchSettingsTitle: "批量信息相关设置项",
    taskModeTitle: "任务模式",
    taskModeDesc: "批量任务的对话使用方式。",
    taskModeSelectTitle: "选择任务开始时是新建对话，还是沿用当前窗口。",
    taskModeNew: "新建对话",
    taskModeCurrent: "当前窗口",
    newChatUrlTitle: "指定对话创建位置",
    newChatUrlDesc: "这个链接决定新建对话在哪里创建。留空时，默认在 GPT 主页面新建对话；填写 ChatGPT 项目链接时，会在该项目里新建对话。建议新建一个项目，再使用这个项目链接。",
    newChatUrlPlaceholder: "https://chatgpt.com/g/.../project",
    newChatUrlInputTitle: "这个链接决定新建对话在哪里创建。留空时默认在 GPT 主页面新建对话。",
    includeNearestHeadingTitle: "发送最近两级标题",
    includeNearestHeadingDesc: "发送正文时附加最近两级上级标题，并用「—」连接。",
    includeNearestHeadingLabel: ""
  },
  [BATCH_PROMPT_LANGUAGE_EN]: {
    languageCn: "中文",
    languageEn: "EN",
    listSeparator: ", ",
    promptLanguage: "Prompt Language",
    settingsPageLabel: "Settings Page",
    settings: "Settings",
    themeToggleTitle: "Switch light/dark mode",
    tabBatch: "Batch Messages",
    tabExport: "Chat Export",
    tabHotkeys: "Quick Messages",
    globalPrompt: "Global Prompt",
    globalPromptTip: "This prompt is sent once at the beginning of each batch task, before the items are processed one by one.",
    messagePrompt: "Message Prompt",
    messagePromptTip: "Each item is appended after this message prompt before sending.",
    pendingText: "Pending Text",
    pendingTextPlaceholder: "One item per line",
    pendingTextTip: "Paste the batch text structure here. Lines with ◆ become body items sent to ChatGPT; heading lines without ◆ are used as folder paths. When the task starts, the extension parses the hierarchy, sends ◆ items one by one, and saves each answer as a Markdown file. Heading lines without ◆ are not sent as tasks by default. When “Send Nearest Two Headings” is enabled, the nearest two headings are sent together with the item text; this can be turned off in Settings.",
    copyDisciplineMapPrompt: "Generate Discipline Map Prompt",
    copyDisciplineMapPromptCopyAction: "Click to copy.",
    copyDisciplineMapPromptCopyNote: "Paste it into an AI chat. GPT Pro is recommended.",
    copyDisciplineMapPromptTitle: "Click to copy. Paste it into an AI chat. GPT Pro is recommended.",
    copyDisciplineMapPromptCopied: "Copied",
    copyDisciplineMapPromptCopyFailed: "Copy failed. Please copy it manually.",
    clearPendingText: "Clear pending text",
    saveDirectory: "Save Folder",
    selectDirectory: "Select Folder",
    selectDirectoryTitle: "Markdown files will be saved here.",
    required: "Required",
    requiredTitle: "Select a folder",
    batchModelTitle: "Choose the ChatGPT model to switch to before batch sending.",
    batchModelDefault: "Current Model",
    batchModelInstant: "Instant",
    batchModelThinking: "Thinking",
    batchModelPro: "Pro",
    start: "Start",
    stop: "Stop",
    deleteProgressChats: "Clear Progress Chats",
    deleteProgressChatsDesc: "Delete ChatGPT conversations whose titles contain progress.",
    deleteProgressChatsTitle: "Delete ChatGPT conversations whose titles contain progress, for example “CPTSD 4/70” or “Current progress 256/321”.",
    deleteProgressReadingProject: "Reading progress-title conversations in the configured chat location...",
    deleteProgressReadingRecent: "Reading progress-title conversations from the most recent 3 pages...",
    deleteProgressReadFailed: "Failed to read progress-title conversations.",
    deleteProgressNoProject: "No progress-title conversations were found in the configured chat location. Scanned {scanned}.",
    deleteProgressNoRecent: "No progress-title conversations were found in the most recent 3 pages. Scanned {scanned}.",
    deleteProgressCancelledProject: "Deletion canceled. {count} progress-title conversations matched in the configured chat location.",
    deleteProgressCancelledRecent: "Deletion canceled. {count} progress-title conversations matched in the most recent 3 pages.",
    deleteProgressConfirmed: "Deletion confirmed for {count} progress-title conversations. Running...",
    deleteProgressDeleteFailed: "Failed to delete progress-title conversations.",
    deleteProgressFailedCount: ", {failed} failed",
    deleteProgressDeleted: "Deleted {deleted} progress-title conversations. Confirmed {matched}{failedText}.",
    deleteProgressConfirmTitle: "Clear {count} Progress Chats",
    deleteProgressConfirmDesc: "These conversations will be hidden from the ChatGPT list.",
    deleteProgressConfirmCancel: "Cancel",
    deleteProgressConfirmDelete: "Delete",
    focusWhenStuck: "Keep Web Page Focus",
    focusWhenStuckDesc: "Experimental feature. Brings the web page back to the screen when a task stalls.",
    focusWhenStuckLabel: "",
    focusWhenStuckTip: "Experimental feature. Brings the web page back to the screen when a task stalls. Auto-refresh always runs without enabling this option.",
    controlMode: "Control Mode",
    controlModeDesc: "Periodically activates the ChatGPT tab that is running the batch task to help Chrome/Edge keep focus.",
    controlModeLabel: "",
    controlModeTip: "When enabled, the extension periodically activates the current batch tab while the task is running. Use this when the browser reduces background page activity.",
    saved: "Saved",
    runStatus: "Run Status",
    failureTitle: "Save Failed",
    noBatchTask: "No batch task is running.",
    idleStatus: "Waiting for task start.",
    batchRunning: "Batch task running, {total} items",
    batchFinished: "Batch task finished, {total} items",
    batchResultCompleted: "{completed} succeeded",
    batchResultSkipped: "{skipped} skipped",
    batchResultFailed: "{failed} failed",
    batchStartedAt: "Started: {time}",
    batchFinishedAt: "Finished: {time}",
    batchProgress: "Current progress: {current}/{total}",
    batchRefreshRetry: "Refresh retry: {retry}/{max}",
    batchRecoveryWarning: "Refresh recovery has failed {count} times in a row. Check the ChatGPT tab.",
    batchCurrentText: "Current text: {text}",
    batchStopped: "Task stopped.",
    hotkeyGuideTitle: "Quick Message Guide",
    openShortcutSettings: "Shortcut Settings",
    saveHotkeySettings: "",
    hotkeyGuideStep1: "Write a message prompt for each of the four presets, then decide whether each preset sends automatically and opens a new chat.",
    hotkeyGuideStep2: "Click “Shortcut Settings” in the top-right corner of any preset to open the browser shortcut settings page.",
    hotkeyGuideStep3: "Assign keys to the four commands. Then select text on any web page and press the corresponding shortcut to send it to ChatGPT.",
    hotkeyGuideNote1: "Prompts, auto-send, and new-chat options are saved automatically. After setup, this page does not need to stay open.",
    hotkeyGuideNote2: "The four presets are independent. The two checkboxes below control whether the message is sent automatically and whether a new chat opens.",
    selectionBubbleEnabled: "Selection Send Button",
    selectionBubbleUseCurrentChat: "Use Existing GPT Page (Recommended)",
    selectionBubbleDesc: "When enabled, selecting text on regular web pages shows translate and explain buttons, then displays the answer on the current page.",
    quickMessageProjectUrlTitle: "Quick Message Project URL",
    quickMessageProjectUrlDesc: "Enter a ChatGPT Project URL to ask quick messages and selection-button prompts inside that project. Leave it blank to use the main GPT page.",
    quickMessageProjectUrlPlaceholder: "https://chatgpt.com/g/.../project",
    quickMessageProjectUrlInputTitle: "ChatGPT Project URL for quick messages and the selection buttons.",
    selectionFilterButton: "Filter URLs",
    selectionFilterNone: "No filtered URLs",
    selectionFilterCount: "{count} filtered URLs",
    selectionFilterTitle: "Filter URLs",
    selectionFilterDesc: "On these URLs, selecting text will not show the send button, and shortcuts will not send text.",
    selectionFilterPlaceholder: "notion.so",
    selectionFilterAdd: "Add",
    selectionFilterRemove: "Remove",
    hotkeyPreset: "Preset",
    hotkeyDefaultShortcut: "Default shortcut",
    hotkeyUsage: "Usage: select text, then press the shortcut",
    hotkeyAutoSend: "Auto-send after completion",
    hotkeyNewChat: "Open a new chat",
    exportTitle: "Current Chat Export",
    exportHint: "Read the currently open ChatGPT conversation and export question-answer pairs from first to last. Save the whole page in one Markdown file, or save each pair separately.",
    exportCurrentChat: "Export Current Chat",
    exportStop: "Stop (Reset)",
    exportModeTitle: "Choose whether the current chat is exported as one Markdown file or as separate Markdown files.",
    exportModeSingle: "Whole Page",
    exportModeSeparate: "Item by Item",
    exportNoTask: "No export task is running.",
    exportRunning: "Export running, {total} question-answer pairs",
    exportFinished: "Export finished, {total} question-answer pairs",
    exportResult: "{completed} saved, {failed} failed",
    exportStartedAt: "Started: {time}",
    exportFinishedAt: "Finished: {time}",
    exportIdleStatus: "Waiting for task start.",
    exportSaveProgress: "Save progress: {saved}/{total}",
    exportCurrentQuestion: "Current question: {question}",
    batchSettingsTitle: "Batch Information Settings",
    taskModeTitle: "Task Mode",
    taskModeDesc: "How batch tasks use ChatGPT chats.",
    taskModeSelectTitle: "Choose whether the task starts in a new chat or uses the current window.",
    taskModeNew: "New Chat",
    taskModeCurrent: "Current Window",
    newChatUrlTitle: "Chat Creation Location",
    newChatUrlDesc: "This link controls where new chats are created. Leave it blank to create chats on the main GPT page. Enter a ChatGPT project link to create chats inside that project. Creating a dedicated project for this workflow is recommended.",
    newChatUrlPlaceholder: "https://chatgpt.com/g/.../project",
    newChatUrlInputTitle: "This link controls where new chats are created. Leave it blank to use the main GPT page.",
    includeNearestHeadingTitle: "Send Nearest Two Headings",
    includeNearestHeadingDesc: "Adds the nearest two parent headings before each item, joined with “—”.",
    includeNearestHeadingLabel: ""
  }
};

function getBatchUiText(language = getSelectedBatchPromptLanguage()) {
  return BATCH_UI_TEXT[normalizeBatchPromptLanguage(language)] || BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_CN];
}

function setElementText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function bindElementEvent(element, eventName, handler) {
  if (element) element.addEventListener(eventName, handler);
}

function runStartupStep(stepName, action) {
  try {
    return Promise.resolve(action());
  } catch (error) {
    console.warn(`初始化失败：${stepName}`, error);
    return Promise.resolve();
  }
}

function setElementTitle(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.title = text;
}

function formatHelpTipText(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s*([。！？；])\s*/gu, "$1\n\n")
    .replace(/([.!?])\s+(?=[A-Z“"(\[])/g, "$1\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function setHelpTip(element, text) {
  if (element) element.dataset.tip = formatHelpTipText(text);
}

function setElementAriaLabel(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute("aria-label", text);
}

function formatUiText(template, values = {}) {
  return String(template || "").replace(/\{(\w+)\}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
  ));
}

function updateHotkeyGroupsUiText(text) {
  document.querySelectorAll(".hotkey-preset-title").forEach((element, index) => {
    element.textContent = `${text.hotkeyPreset} ${GROUPS[index] || index + 1}`;
  });
  document.querySelectorAll("[data-hotkey-meta='shortcut']").forEach((element) => {
    element.textContent = `${text.hotkeyDefaultShortcut}: ${element.dataset.shortcut || ""}`;
  });
  document.querySelectorAll("[data-hotkey-meta='usage']").forEach((element) => {
    element.textContent = text.hotkeyUsage;
  });
  document.querySelectorAll(".hotkey-auto-send-label").forEach((element) => {
    element.textContent = text.hotkeyAutoSend;
  });
  document.querySelectorAll(".hotkey-new-chat-label").forEach((element) => {
    element.textContent = text.hotkeyNewChat;
  });
  document.querySelectorAll(".open-shortcuts-btn").forEach((element) => {
    element.textContent = text.openShortcutSettings;
  });
}

function applyBatchUiLanguage(language) {
  const text = getBatchUiText(language);

  document.querySelector('[data-batch-language="cn"]')?.replaceChildren(document.createTextNode(text.languageCn));
  document.querySelector('[data-batch-language="en"]')?.replaceChildren(document.createTextNode(text.languageEn));
  setElementAriaLabel(".header-language-toggle", text.promptLanguage);
  setElementAriaLabel(".tabs", text.settingsPageLabel);
  setElementTitle("#themeToggle", text.themeToggleTitle);
  setElementAriaLabel("#themeToggle", text.themeToggleTitle);
  setElementTitle("#settingsToggle", text.settings);
  setElementAriaLabel("#settingsToggle", text.settings);

  setElementText('[data-page="batch"]', text.tabBatch);
  setElementText('[data-page="export"]', text.tabExport);
  setElementText('[data-page="hotkeys"]', text.tabHotkeys);

  setElementText('label[for="batchGlobalPrompt"]', text.globalPrompt);
  const globalPromptHelp = document.querySelector('label[for="batchGlobalPrompt"] ~ .panel-tools .help-button');
  setHelpTip(globalPromptHelp, text.globalPromptTip);
  setElementText('label[for="batchPrompt"]', text.messagePrompt);
  const messagePromptHelp = document.querySelector('label[for="batchPrompt"] ~ .panel-tools .help-button');
  setHelpTip(messagePromptHelp, text.messagePromptTip);
  const batchPrompt = document.getElementById("batchPrompt");
  if (batchPrompt) batchPrompt.placeholder = getBatchPromptDefaults(language).prompt;
  setElementText('label[for="batchInputs"]', text.pendingText);
  setElementText("#copyDisciplineMapPromptLabel", text.copyDisciplineMapPrompt);
  setElementText("#disciplineMapPromptTooltipAction", text.copyDisciplineMapPromptCopyAction);
  setElementText("#disciplineMapPromptTooltipNote", text.copyDisciplineMapPromptCopyNote);
  setElementAriaLabel("#copyDisciplineMapPrompt", text.copyDisciplineMapPromptTitle);
  renderDisciplineMapPromptTooltip(language);
  const copyDisciplineMapPrompt = document.getElementById("copyDisciplineMapPrompt");
  if (copyDisciplineMapPrompt) copyDisciplineMapPrompt.removeAttribute("title");
  const pendingTextHelp = document.getElementById("batchInputsHelp");
  setHelpTip(pendingTextHelp, text.pendingTextTip);

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
  setElementTitle("#batchModelSelectButton", text.batchModelTitle);
  setElementText("#batchModelDefault", text.batchModelDefault);
  setElementText("#batchModelInstant", text.batchModelInstant);
  setElementText("#batchModelThinking", text.batchModelThinking);
  setElementText("#batchModelPro", text.batchModelPro);
  setElementText("#batchModelMenuDefault", text.batchModelDefault);
  setElementText("#batchModelMenuInstant", text.batchModelInstant);
  setElementText("#batchModelMenuThinking", text.batchModelThinking);
  setElementText("#batchModelMenuPro", text.batchModelPro);
  updateBatchModelSelectText();
  setElementText("#batchStart", text.start);
  setElementText("#batchStop", text.stop);
  setElementText("#deleteProgressChats", text.deleteProgressChats);
  setElementTitle("#deleteProgressChats", text.deleteProgressChatsTitle);
  setElementText("#focusWhenStuckTitle", text.focusWhenStuck);
  setElementText("#focusWhenStuckDesc", text.focusWhenStuckDesc);
  setElementText("#batchFocusWhenStuckLabel", text.focusWhenStuckLabel);
  const focusWhenStuckHelp = document.getElementById("batchFocusWhenStuckHelp");
  setHelpTip(focusWhenStuckHelp, text.focusWhenStuckTip);
  setElementText("#controlModeTitle", text.controlMode);
  setElementText("#controlModeDesc", text.controlModeDesc);
  setElementText("#batchControlModeLabel", text.controlModeLabel);
  const controlModeHelp = document.getElementById("batchControlModeHelp");
  setHelpTip(controlModeHelp, text.controlModeTip);
  setElementText("#batchSaved", text.saved);
  setElementText("#batchFailureTitle", text.failureTitle);
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

  setElementText("#hotkeyGuideTitle", text.hotkeyGuideTitle);

  setElementText("#save", text.saveHotkeySettings);
  setElementText("#saved", text.saved);
  setElementText("#hotkeyGuideStep1", text.hotkeyGuideStep1);
  setElementText("#hotkeyGuideStep2", text.hotkeyGuideStep2);
  setElementText("#hotkeyGuideStep3", text.hotkeyGuideStep3);
  setElementText("#hotkeyGuideNote1", text.hotkeyGuideNote1);
  setElementText("#hotkeyGuideNote2", text.hotkeyGuideNote2);
  setElementText("#selectionBubbleEnabledLabel", text.selectionBubbleEnabled);
  setElementText("#selectionBubbleUseCurrentChatLabel", text.selectionBubbleUseCurrentChat);
  setElementText("#selectionBubbleDesc", text.selectionBubbleDesc);
  setElementText("#quickMessageProjectUrlTitle", text.quickMessageProjectUrlTitle);
  setElementTitle("#quickMessageProjectUrl", text.quickMessageProjectUrlInputTitle);
  const quickMessageProjectUrlInput = document.getElementById("quickMessageProjectUrl");
  if (quickMessageProjectUrlInput) quickMessageProjectUrlInput.placeholder = text.quickMessageProjectUrlPlaceholder;
  const quickMessageProjectUrlHelp = document.getElementById("quickMessageProjectUrlHelp");
  setHelpTip(quickMessageProjectUrlHelp, text.quickMessageProjectUrlDesc);
  setElementText("#openSelectionFilterDialog", text.selectionFilterButton);
  setElementText("#selectionFilterTitle", text.selectionFilterTitle);
  setElementText("#selectionFilterDesc", text.selectionFilterDesc);
  setElementText("#addSelectionFilterUrl", text.selectionFilterAdd);
  const selectionFilterInput = document.getElementById("selectionFilterInput");
  if (selectionFilterInput) selectionFilterInput.placeholder = text.selectionFilterPlaceholder;
  renderSelectionFilterUrls();
  updateHotkeyGroupsUiText(text);

  setElementText("#exportTitle", text.exportTitle);
  setElementText("#exportHint", text.exportHint);
  setElementText("#exportCurrentChat", text.exportCurrentChat);
  setElementText("#exportStop", text.exportStop);
  setElementTitle("#chatExportMode", text.exportModeTitle);
  setElementText("#chatExportModeSingle", text.exportModeSingle);
  setElementText("#chatExportModeSeparate", text.exportModeSeparate);
  setElementText("#exportRunStatusTitle", text.runStatus);

  setElementText("#batchSettingsTitle", text.batchSettingsTitle);
  setElementText("#taskModeTitle", text.taskModeTitle);
  setElementText("#taskModeDesc", text.taskModeDesc);
  setElementTitle("#batchConversationMode", text.taskModeSelectTitle);
  setElementText("#batchConversationModeNew", text.taskModeNew);
  setElementText("#batchConversationModeCurrent", text.taskModeCurrent);
  setElementText("#newChatUrlTitle", text.newChatUrlTitle);
  setElementText("#newChatUrlDesc", text.newChatUrlDesc);
  setElementTitle("#batchNewChatUrl", text.newChatUrlInputTitle);
  const newChatUrlInput = document.getElementById("batchNewChatUrl");
  if (newChatUrlInput) newChatUrlInput.placeholder = text.newChatUrlPlaceholder;
  const newChatUrlHelp = document.getElementById("batchNewChatUrlHelp");
  setHelpTip(newChatUrlHelp, text.newChatUrlDesc);
  setElementText("#includeNearestHeadingTitle", text.includeNearestHeadingTitle);
  setElementText("#includeNearestHeadingDesc", text.includeNearestHeadingDesc);
  setElementText("#batchIncludeNearestHeadingLabel", text.includeNearestHeadingLabel);
  renderBatchState(currentBatchState);
  renderChatExportState(currentChatExportState);
  renderBatchDirectoryText();
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

function normalizeKnownPromptText(value) {
  return normalizeEnglishGlobalPromptFormatRule(value).trim();
}

function isKnownBatchDefaultGlobalPrompt(value) {
  const normalizedValue = normalizeKnownPromptText(value);
  return [
    BATCH_DEFAULT_GLOBAL_PROMPT,
    SOCIOLOGY_STANDALONE_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
    SOCIOLOGY_SUBJECT_TITLE_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
    SOCIOLOGY_TITLE_RULES_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
    BATCH_EN_GLOBAL_PROMPT,
    SOCIOLOGY_LAST_BATCH_DEFAULT_GLOBAL_PROMPT,
    SOCIOLOGY_LAST_BATCH_EN_GLOBAL_PROMPT,
    SOCIOLOGY_PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT,
    SOCIOLOGY_PREVIOUS_BATCH_EN_GLOBAL_PROMPT,
    LITERARY_THEORY_BATCH_DEFAULT_GLOBAL_PROMPT,
    LITERARY_THEORY_BATCH_EN_GLOBAL_PROMPT,
    ETHICS_BATCH_DEFAULT_GLOBAL_PROMPT,
    ETHICS_BATCH_EN_GLOBAL_PROMPT,
    LEGACY_BATCH_DEFAULT_GLOBAL_PROMPT,
    PRIOR_BATCH_DEFAULT_GLOBAL_PROMPT,
    CURRENT_BATCH_DEFAULT_GLOBAL_PROMPT,
    RECENT_BATCH_DEFAULT_GLOBAL_PROMPT,
    LAST_BATCH_DEFAULT_GLOBAL_PROMPT,
    PREVIOUS_BATCH_DEFAULT_GLOBAL_PROMPT
  ].some((prompt) => normalizeKnownPromptText(prompt) === normalizedValue);
}

function isKnownBatchDefaultPrompt(value) {
  return [
    BATCH_DEFAULT_PROMPT,
    BATCH_EN_PROMPT,
    LEGACY_BATCH_EN_PROMPT,
    RECENT_BATCH_DEFAULT_PROMPT,
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
  document.querySelectorAll("#chatExportMode [data-chat-export-mode]").forEach((button) => {
    button.disabled = exportPending || exportStopPending || currentChatExportState.running;
  });
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
  const activeButton = document.querySelector("#batchConversationMode [data-batch-conversation-mode].is-active");
  return normalizeBatchConversationMode(activeButton?.dataset.batchConversationMode);
}

function setBatchConversationMode(mode) {
  const normalized = normalizeBatchConversationMode(mode);
  document.querySelectorAll("#batchConversationMode [data-batch-conversation-mode]").forEach((button) => {
    const active = button.dataset.batchConversationMode === normalized;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function normalizeBatchModel(value) {
  const text = String(value || "").toLowerCase();
  if (text === BATCH_MODEL_INSTANT) return BATCH_MODEL_INSTANT;
  if (text === BATCH_MODEL_THINKING) return BATCH_MODEL_THINKING;
  if (text === BATCH_MODEL_PRO) return BATCH_MODEL_PRO;
  return BATCH_MODEL_DEFAULT;
}

function getSelectedBatchModel() {
  return normalizeBatchModel(document.getElementById("batchModelSelect")?.value);
}

function updateBatchModelSelectText() {
  const select = document.getElementById("batchModelSelect");
  const label = document.getElementById("batchModelSelectText");
  if (!select || !label) return;
  label.textContent = select.selectedOptions?.[0]?.textContent || getBatchUiText().batchModelDefault;
  document.querySelectorAll("[data-batch-model-option]").forEach((button) => {
    const active = button.dataset.batchModelOption === select.value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function closeBatchModelMenu() {
  const menu = document.getElementById("batchModelMenu");
  const button = document.getElementById("batchModelSelectButton");
  if (menu) menu.hidden = true;
  if (button) button.setAttribute("aria-expanded", "false");
}

function toggleBatchModelMenu() {
  const menu = document.getElementById("batchModelMenu");
  const button = document.getElementById("batchModelSelectButton");
  if (!menu || !button || button.disabled) return;
  const nextOpen = menu.hidden;
  menu.hidden = !nextOpen;
  button.setAttribute("aria-expanded", nextOpen ? "true" : "false");
}

function normalizeChatExportMode(value) {
  return value === CHAT_EXPORT_MODE_SINGLE ? CHAT_EXPORT_MODE_SINGLE : CHAT_EXPORT_MODE_SEPARATE;
}

function getSelectedChatExportMode() {
  const activeButton = document.querySelector("#chatExportMode [data-chat-export-mode].is-active");
  return normalizeChatExportMode(activeButton?.dataset.chatExportMode);
}

function setChatExportMode(mode) {
  const normalized = normalizeChatExportMode(mode);
  document.querySelectorAll("#chatExportMode [data-chat-export-mode]").forEach((button) => {
    const active = button.dataset.chatExportMode === normalized;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function shouldIgnoreBatchLine(line) {
  const text = stripBatchTreePrefix(line);
  if (!text) return true;
  if (/^#{1,6}\s+/u.test(text)) return true;
  if (/^(?:\d+[._])+\d+\b/u.test(text)) return true;
  if (/^\d+\.\s*/u.test(text)) return true;
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

function cleanBatchPromptPart(value) {
  return String(value || "")
    .replace(/[◆◇]/g, " ")
    .replace(/^#+\s*/u, "")
    .replace(/^\+\s*/u, "")
    .replace(/^(?:\d+(?:[._]\d+)*|[IVXLC]+)$/iu, "")
    .replace(/^(?:\d+(?:[._]\d+)*|[IVXLC]+)[\s._-]+/iu, "")
    .replace(/\s*\.(?:md|markdown|txt|rtf|docx?|pdf|html?|epub)\s*$/iu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getNearestBatchHeadings(stack, inlineHeading = "", maxCount = 2) {
  const headings = [];
  for (const value of stack) {
    const heading = cleanBatchPromptPart(value);
    if (heading) headings.push(heading);
  }

  const lineHeading = cleanBatchPromptPart(inlineHeading);
  if (lineHeading) headings.push(lineHeading);

  const result = [];
  for (let index = headings.length - 1; index >= 0 && result.length < maxCount; index -= 1) {
    const heading = headings[index];
    if (!result.includes(heading)) {
      result.unshift(heading);
    }
  }
  return result;
}

function buildBatchSendText(text, stack, includeNearestHeading, inlineHeading = "") {
  const itemText = cleanBatchPromptPart(text) || String(text || "").trim();
  if (!includeNearestHeading) return itemText;

  const parts = getNearestBatchHeadings(stack, inlineHeading);
  if (itemText) parts.push(itemText);
  return parts.join("—") || itemText;
}

function parseBatchTreeItems(rawText, includeNearestHeading) {
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
        sendText: buildBatchSendText(text, stack, includeNearestHeading, textForDepth),
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

function parseBatchItems(rawText, includeNearestHeading) {
  if (String(rawText || "").includes("◆")) {
    return parseBatchTreeItems(rawText, includeNearestHeading);
  }

  return String(rawText || "")
    .split(/\r?\n/)
    .map((item) => extractBatchInputText(item))
    .filter((item) => item && !shouldIgnoreBatchLine(item));
}

function renderHotkeyGroups() {
  const container = document.getElementById("groups");
  container.replaceChildren();
  const text = getBatchUiText();

  for (const index of GROUPS) {
    const suggestedKey = HOTKEY_RECOMMENDED_KEYS[index] || "";
    const group = document.createElement("div");
    group.className = "group";

    const titleRow = document.createElement("div");
    titleRow.className = "preset-title-row";
    const title = document.createElement("strong");
    title.className = "hotkey-preset-title";
    title.textContent = `${text.hotkeyPreset} ${index}`;
    titleRow.appendChild(title);

    const shortcutBtn = document.createElement("button");
    shortcutBtn.type = "button";
    shortcutBtn.className = "secondary-button open-shortcuts-btn";
    shortcutBtn.textContent = text.openShortcutSettings;
    shortcutBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: getShortcutSettingsUrl() });
    });
    titleRow.appendChild(shortcutBtn);

    const meta = document.createElement("div");
    meta.className = "preset-meta";
    const shortcutChip = document.createElement("span");
    shortcutChip.className = "meta-chip";
    shortcutChip.dataset.hotkeyMeta = "shortcut";
    shortcutChip.dataset.shortcut = suggestedKey;
    shortcutChip.textContent = `${text.hotkeyDefaultShortcut}: ${suggestedKey}`;
    const usageChip = document.createElement("span");
    usageChip.className = "meta-chip";
    usageChip.dataset.hotkeyMeta = "usage";
    usageChip.textContent = text.hotkeyUsage;
    meta.append(shortcutChip, usageChip);

    const promptRow = document.createElement("div");
    promptRow.className = "row";
    const promptLabel = document.createElement("label");
    promptLabel.htmlFor = `prefix${index}`;
    promptLabel.textContent = "Prompt";
    const promptInput = document.createElement("textarea");
    promptInput.id = `prefix${index}`;
    promptInput.className = "hotkey-prompt";
    promptInput.placeholder = HOTKEY_DEFAULTS[`prefix${index}`] || HOTKEY_DEFAULT_PREFIX;
    promptRow.append(promptLabel, promptInput);

    const inlineRow = document.createElement("div");
    inlineRow.className = "row inline";

    const autoSendLabel = document.createElement("label");
    autoSendLabel.className = "toggle-label option-box";
    const autoSendText = document.createElement("span");
    autoSendText.className = "hotkey-auto-send-label";
    autoSendText.textContent = text.hotkeyAutoSend;
    const autoSendInput = document.createElement("input");
    autoSendInput.type = "checkbox";
    autoSendInput.id = `autoSend${index}`;
    autoSendLabel.append(autoSendText, autoSendInput);

    const newChatLabel = document.createElement("label");
    newChatLabel.className = "toggle-label option-box";
    const newChatText = document.createElement("span");
    newChatText.className = "hotkey-new-chat-label";
    newChatText.textContent = text.hotkeyNewChat;
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

function formatTime(isoText, language = getSelectedBatchPromptLanguage()) {
  if (!isoText) return "";
  const value = new Date(isoText);
  if (Number.isNaN(value.getTime())) return "";
  const locale = normalizeBatchPromptLanguage(language) === BATCH_PROMPT_LANGUAGE_EN ? "en-US" : "zh-CN";
  return value.toLocaleString(locale, { hour12: false });
}

function localizeBatchRuntimeMessage(message) {
  const text = String(message || "");
  if (normalizeBatchPromptLanguage(getSelectedBatchPromptLanguage()) !== BATCH_PROMPT_LANGUAGE_EN) {
    return text;
  }

  const exactMessages = new Map([
    ["等待任务开始。", "Waiting for task start."],
    ["正在打开 ChatGPT 页面……", "Opening ChatGPT page..."],
    ["所有标题都已经保存过，本次没有发送新消息。", "All titles have already been saved. No new messages were sent."],
    ["ChatGPT 页面已接收批量任务。", "ChatGPT page received the batch task."],
    ["任务心跳长时间没有更新，已刷新 ChatGPT 网页恢复任务。", "Task heartbeat did not update for a long time. ChatGPT page was refreshed to recover the task."],
    ["刷新后任务仍没有推进，已激活 ChatGPT 网页。", "The task still did not progress after refresh. ChatGPT page was activated."],
    ["刷新恢复请求失败，已激活 ChatGPT 网页。", "Refresh recovery request failed. ChatGPT page was activated."],
    ["正在检查当前页面输入框和回答状态……", "Checking the current page input box and answer status..."],
    ["正在新建对话……", "Creating a new chat..."],
    ["正在发送全局 Prompt……", "Sending Global Prompt..."],
    ["全局 Prompt 已收到回答，正在进入批量文本处理……", "Global Prompt answered. Starting batch text processing..."],
    ["全局 Prompt 已收到回答，正在准备第一条文本……", "Global Prompt answered. Preparing the first item..."],
    ["新对话已打开，正在准备全局 Prompt……", "New chat opened. Preparing Global Prompt..."],
    ["新对话已打开，正在准备第一条文本……", "New chat opened. Preparing the first item..."],
    ["新对话已打开，正在准备本段第一条文本……", "New chat opened. Preparing the first item in this segment..."],
    ["刷新后仍未继续。", "Still did not continue after refresh."],
    ["已找到上一轮提问，但没有读取到对应回答。", "Previous prompt was found, but the matching answer could not be read."],
    ["刷新重试状态保存失败，任务已停止。", "Refresh retry state could not be saved. Task stopped."],
    ["重试状态保存失败。", "Retry state could not be saved."],
    ["回答内容为空。", "Answer content is empty."],
    ["ChatGPT 返回临时错误，请刷新页面后重试。", "ChatGPT returned a temporary error. Refresh the page and try again."],
    ["没有找到输入框。", "Input box was not found."],
    ["当前页面没有对应的批量任务。", "Current page does not have the matching batch task."],
    ["当前批量任务没有可恢复的续跑状态。", "Current batch task has no recoverable resume state."],
    ["续跑状态保存失败。", "Resume state could not be saved."],
    ["正在读取当前对话……", "Reading the current chat..."],
    ["当前对话导出已开始：同一个 MD。", "Current chat export started: single Markdown file."],
    ["当前对话导出已开始：逐条 MD。", "Current chat export started: separate Markdown files."],
    ["Deep Research 正文已提取，正在保存……", "Deep Research body extracted, saving..."],
    ["已采用 Deep Research 正文导出。", "Deep Research body was used for export."],
    ["对话导出已停止。", "Chat export stopped."],
    ["当前对话没有可导出的问答内容。", "The current chat has no exportable question-answer pairs."]
  ]);
  if (exactMessages.has(text)) return exactMessages.get(text);

  const localizeFragment = (value) => {
    const fragment = String(value || "").trim();
    return exactMessages.get(fragment) || fragment;
  };
  const retryMethodText = (value) => (
    String(value || "") === "新标签页重试" ? "new-tab retry" : "refresh retry"
  );

  const patterns = [
    [/^已跳过\s*(\d+)\s*条已存在标题。$/u, "Skipped $1 existing titles."],
    [/^已选目录[：:]\s*(.+)$/u, "Selected folder: $1"],
    [/^已选目录$/u, "Selected folder"],
    [/^批量任务已开始，共\s*(\d+)\s*条。$/u, "Batch task started, $1 items."],
    [/^批量任务开始执行，共\s*(\d+)\s*条。$/u, "Batch task started, $1 items."],
    [/^批量任务开始执行，共\s*(\d+)\s*条，已跳过\s*(\d+)\s*条。$/u, "Batch task started, $1 items, $2 skipped."],
    [/^页面已刷新，正在第\s*(\d+)\/(\d+)\s*次重试第\s*(\d+)\/(\d+)\s*条……$/u, "Page refreshed. Retry $1/$2 for item $3/$4..."],
    [/^页面已刷新，正在继续第\s*(\d+)\/(\d+)\s*条……$/u, "Page refreshed. Continuing item $1/$2..."],
    [/^正在切换模型[：:]\s*(.+)……$/u, "Switching model: $1..."],
    [/^模型已准备[：:]\s*(.+)。$/u, "Model ready: $1."],
    [/^模型切换未完成[：:]\s*(.+)\s+将沿用当前模型继续。$/u, "Model switch did not finish: $1 Continuing with the current model."],
    [/^正在修改对话标题[：:]\s*(.+)$/u, "Updating chat title: $1"],
    [/^对话标题已改为[：:]\s*(.+)$/u, "Chat title updated to: $1"],
    [/^对话标题暂未改成[：:]\s*(.+)，稍后会再次尝试。$/u, "Chat title has not changed to: $1. Will try again later."],
    [/^已处理\s*(\d+)\s*条，正在新建对话……$/u, "$1 items processed. Creating a new chat..."],
    [/^已处理\s*(\d+)\s*条，正在打开新的项目对话……$/u, "$1 items processed. Opening a new project chat..."],
    [/^正在准备第\s*(\d+)\/(\d+)\s*条[：:]\s*(.+)$/u, "Preparing item $1/$2: $3"],
    [/^正在发送第\s*(\d+)\/(\d+)\s*条[：:]\s*(.+)$/u, "Sending item $1/$2: $3"],
    [/^第\s*(\d+)\/(\d+)\s*条回答已读取，正在保存[：:]\s*(.+)$/u, "Item $1/$2 answer read, saving: $3"],
    [/^第\s*(\d+)\/(\d+)\s*条已有回答已读取，正在保存[：:]\s*(.+)$/u, "Existing answer for item $1/$2 read, saving: $3"],
    [/^第\s*(\d+)\/(\d+)\s*条已保存[：:]\s*(.+)$/u, "Item $1/$2 saved: $3"],
    [/^已发送[：:]\s*(.+)，正在等待回答……$/u, "Sent: $1, waiting for the answer..."],
    [/^页面已刷新，正在读取第\s*(\d+)\/(\d+)\s*条已有回答……$/u, "Page refreshed. Reading existing answer for item $1/$2..."],
    [/^第\s*(\d+)\/(\d+)\s*条刷新后回答仍在生成或更新，继续等待稳定后再判断。$/u, "After refresh, item $1/$2 is still generating or updating. Waiting for it to settle..."],
    [/^第\s*(\d+)\/(\d+)\s*条刷新重试已达到\s*(\d+)\s*次，任务已停止。?(.*)$/u, (_match, item, total, retries, reason) => {
      const suffix = localizeFragment(reason);
      return `Item ${item}/${total} reached ${retries} refresh retries. Task stopped.${suffix ? ` ${suffix}` : ""}`;
    }],
    [/^第\s*(\d+)\/(\d+)\s*条刷新后仍未继续，正在第\s*(\d+)\/(\d+)\s*次刷新重试。$/u, "Item $1/$2 still did not continue after refresh. Running refresh retry $3/$4."],
    [/^第\s*(\d+)\/(\d+)\s*条保存失败，正在第\s*(\d+)\/(\d+)\s*次(新标签页重试|刷新重试)。?(.*)$/u, (_match, item, total, retry, max, method, reason) => {
      const suffix = localizeFragment(reason);
      return `Item ${item}/${total} save failed. Running ${retryMethodText(method)} ${retry}/${max}.${suffix ? ` ${suffix}` : ""}`;
    }],
    [/^第\s*(\d+)\/(\d+)\s*条保存失败，准备第\s*(\d+)\/(\d+)\s*次重试[：:]\s*(.+?)。(.+)$/u, (_match, item, total, retry, max, title, reason) => (
      `Item ${item}/${total} save failed. Preparing retry ${retry}/${max}: ${title}. ${localizeFragment(reason)}`
    )],
    [/^第\s*(\d+)\/(\d+)\s*条保存失败[：:]\s*(.+?)。(.+)$/u, (_match, item, total, title, reason) => (
      `Item ${item}/${total} save failed: ${title}. ${localizeFragment(reason)}`
    )],
    [/^第\s*(\d+)\/(\d+)\s*条失败[：:]\s*(.+?)。(.+)$/u, (_match, item, total, title, reason) => (
      `Item ${item}/${total} failed: ${title}. ${localizeFragment(reason)}`
    )],
    [/^第\s*(\d+)\/(\d+)\s*条发送、读取或保存前处理失败，正在记录结果[：:]\s*(.+)$/u, "Item $1/$2 failed before sending, reading, or saving. Recording result: $3"],
    [/^第\s*(\d+)\/(\d+)\s*条已在新标签页继续重试。$/u, "Item $1/$2 continued retrying in a new tab."],
    [/^第\s*(\d+)\/(\d+)\s*条已在新项目对话继续。$/u, "Item $1/$2 continued in a new project chat."],
    [/^任务结束，跳过\s*(\d+)\s*条，成功\s*(\d+)\s*条，失败\s*(\d+)\s*条。$/u, "Task finished, $1 skipped, $2 succeeded, $3 failed."],
    [/^任务结束，跳过\s*(\d+)\s*条，成功\s*(\d+)\s*条。$/u, "Task finished, $1 skipped, $2 succeeded."],
    [/^任务结束，成功\s*(\d+)\s*条，失败\s*(\d+)\s*条。$/u, "Task finished, $1 succeeded, $2 failed."],
    [/^任务结束，成功\s*(\d+)\s*条。$/u, "Task finished, $1 succeeded."],
    [/^刷新恢复请求连续失败\s*(\d+)\s*次。(.+)$/u, (_match, count, rest) => (
      `Refresh recovery request failed ${count} times in a row. ${localizeBatchRuntimeMessage(rest)}`
    )],
    [/^刷新恢复请求失败。(.+)$/u, (_match, rest) => (
      `Refresh recovery request failed. ${localizeBatchRuntimeMessage(rest)}`
    )],
    [/^调控模式已启用，会按间隔激活当前批量标签页。请查看 ChatGPT 标签页。?(.*)$/u, (_match, suffix) => {
      const errorText = String(suffix || "").trim().replace(/^错误[：:]\s*/u, "").trim();
      const localizedError = localizeFragment(errorText);
      return `Control Mode is enabled and will activate the current batch tab at intervals. Check the ChatGPT tab.${localizedError ? ` Error: ${localizedError}` : ""}`;
    }],
    [/^保持网页焦点未开启，未激活 ChatGPT 网页。请查看 ChatGPT 标签页。?(.*)$/u, (_match, suffix) => {
      const errorText = String(suffix || "").trim().replace(/^错误[：:]\s*/u, "").trim();
      const localizedError = localizeFragment(errorText);
      return `Keep Web Page Focus is off, so the ChatGPT page was not activated. Check the ChatGPT tab.${localizedError ? ` Error: ${localizedError}` : ""}`;
    }],
    [/^已识别标题[：:]\s*(.+)$/u, "Recognized titles: $1"],
    [/^完整对话接口已整理出\s*(\d+)\s*组问答，正在保存……$/u, "Full chat API parsed $1 question-answer pairs, saving..."],
    [/^已读取\s*(\d+)\s*组问答，正在保存……$/u, "$1 question-answer pairs read, saving..."],
    [/^已保存同一个 MD 文件，共\s*(\d+)\s*组问答。?(.*)$/u, (_match, count, suffix) => (
      `Saved one Markdown file with ${count} question-answer pairs.${suffix ? ` ${localizeBatchRuntimeMessage(suffix)}` : ""}`
    )],
    [/^同一个 MD 文件保存失败[：:]\s*(.+)$/u, "Single Markdown file save failed: $1"],
    [/^当前对话导出结束，成功\s*(\d+)\s*组，失败\s*(\d+)\s*组。$/u, "Current chat export finished, $1 succeeded, $2 failed."],
    [/^当前对话导出结束，已保存同一个 MD 文件，共\s*(\d+)\s*组问答。$/u, "Current chat export finished. Saved one Markdown file with $1 question-answer pairs."],
    [/^当前对话导出结束，共保存\s*(\d+)\s*组问答。$/u, "Current chat export finished. Saved $1 question-answer pairs."],
    [/^已记录词条清单，共\s*(\d+)\s*条。?(.*)$/u, (_match, count, suffix) => (
      `Term index recorded, ${count} entries.${suffix ? ` ${localizeBatchRuntimeMessage(suffix)}` : ""}`
    )],
    [/^第\s*(\d+)\/(\d+)\s*组已保存[：:]\s*(.+?)。?(.*)$/u, (_match, item, total, title, suffix) => (
      `Pair ${item}/${total} saved: ${title}.${suffix ? ` ${localizeBatchRuntimeMessage(suffix)}` : ""}`
    )],
    [/^第\s*(\d+)\/(\d+)\s*组保存失败[：:]\s*(.+?)。(.+)$/u, "Pair $1/$2 save failed: $3. $4"],
    [/^第\s*(\d+)\/(\d+)\s*组失败[：:]\s*问答内容不完整。$/u, "Pair $1/$2 failed: question or answer is incomplete."],
    [/^正在导出第\s*(\d+)\/(\d+)\s*组问答……$/u, "Exporting pair $1/$2..."],
    [/^正在读取项目页对话列表[：:]\s*已扫描\s*(\d+)\s*个，匹配\s*(\d+)\s*个进度标题对话。$/u, "Reading project chat list: $1 scanned, $2 progress-title chats matched."],
    [/^项目页列表读取完成[：:]\s*扫描\s*(\d+)\s*个，匹配\s*(\d+)\s*个进度标题对话，等待确认。$/u, "Project list read: $1 scanned, $2 progress-title chats matched. Waiting for confirmation."],
    [/^已读取第\s*(\d+)\/3\s*页，累计扫描\s*(\d+)\s*个，匹配\s*(\d+)\s*个进度标题对话。$/u, "Read page $1/3, $2 scanned, $3 progress-title chats matched."],
    [/^列表读取完成[：:]\s*扫描\s*(\d+)\s*个，匹配\s*(\d+)\s*个进度标题对话，等待确认。$/u, "List read: $1 scanned, $2 progress-title chats matched. Waiting for confirmation."],
    [/^用户已确认，开始删除\s*(\d+)\s*个进度标题对话。$/u, "Confirmed. Deleting $1 progress-title chats."],
    [/^清理进度标题对话失败[：:]\s*(.+)$/u, "Failed to clear progress-title chats: $1"]
  ];

  for (const [pattern, replacement] of patterns) {
    if (pattern.test(text)) {
      return text.replace(pattern, replacement);
    }
  }

  return text;
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

function formatCurrentBatchText(state) {
  const text = String(state && state.currentText ? state.currentText : "").trim();
  if (!text) return "";
  const itemNumber = extractBatchItemNumber(state && state.currentItemNumber ? state.currentItemNumber : "");
  return itemNumber ? `${itemNumber} ${text}` : text;
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
    element.classList.toggle("is-selected", hasDirectory);
  });
  if (hasDirectory) setBatchDirectoryAlert(false);
}

function renderBatchState(state) {
  currentBatchState = createBatchState(state);
  updateBatchActionButtons();
  const uiText = getBatchUiText();

  const summary = [];
  if (currentBatchState.running) {
    summary.push(formatUiText(uiText.batchRunning, { total: currentBatchState.total }));
  } else if (currentBatchState.total) {
    summary.push(formatUiText(uiText.batchFinished, { total: currentBatchState.total }));
  } else {
    summary.push(uiText.noBatchTask);
  }

  if (currentBatchState.total) {
    const resultParts = [formatUiText(uiText.batchResultCompleted, { completed: currentBatchState.completed })];
    if (currentBatchState.skipped) {
      resultParts.push(formatUiText(uiText.batchResultSkipped, { skipped: currentBatchState.skipped }));
    }
    resultParts.push(formatUiText(uiText.batchResultFailed, { failed: currentBatchState.failed }));
    summary.push(resultParts.join(uiText.listSeparator));
  }

  const startedAt = formatTime(currentBatchState.startedAt);
  const finishedAt = formatTime(currentBatchState.finishedAt);
  if (startedAt) summary.push(formatUiText(uiText.batchStartedAt, { time: startedAt }));
  if (finishedAt) summary.push(formatUiText(uiText.batchFinishedAt, { time: finishedAt }));

  document.getElementById("batchSummary").textContent = summary.join(uiText.listSeparator);

  const lines = [];
  const knownIdleMessages = [
    BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_CN].idleStatus,
    BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_EN].idleStatus
  ];
  lines.push(
    !currentBatchState.message || knownIdleMessages.includes(currentBatchState.message)
      ? uiText.idleStatus
      : localizeBatchRuntimeMessage(currentBatchState.message)
  );
  if (currentBatchState.total) {
    lines.push(formatUiText(uiText.batchProgress, {
      current: currentBatchState.currentIndex,
      total: currentBatchState.total
    }));
  }
  if (currentBatchState.running && currentBatchState.retryAttempt > 0) {
    lines.push(formatUiText(uiText.batchRefreshRetry, {
      retry: currentBatchState.retryAttempt,
      max: currentBatchState.maxRefreshRetries || BATCH_DEFAULT_MAX_REFRESH_RETRIES
    }));
  }
  const recoveryWarning = currentBatchState.running && currentBatchState.refreshRecoveryFailureCount >= 10;
  if (recoveryWarning) {
    lines.push(formatUiText(uiText.batchRecoveryWarning, {
      count: currentBatchState.refreshRecoveryFailureCount
    }));
  }
  const currentText = formatCurrentBatchText(currentBatchState);
  if (currentText) {
    lines.push(formatUiText(uiText.batchCurrentText, { text: currentText }));
  }
  const batchStatus = document.getElementById("batchStatus");
  batchStatus.textContent = lines.join("\n");
  batchStatus.classList.toggle("is-recovery-warning", recoveryWarning);

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
    const messageText = localizeBatchRuntimeMessage(item.message);
    if (timeText && item.level === "success" && String(item.message || "").includes("已保存：")) {
      li.textContent = `${messageText} ${timeText}`;
    } else {
      li.textContent = timeText ? `［${timeText}］${messageText}` : messageText;
    }
    logs.appendChild(li);
  }
}

function renderChatExportState(state) {
  currentChatExportState = createChatExportState(state);
  updateChatExportActionButtons();
  const text = getBatchUiText();

  const summary = [];
  if (currentChatExportState.running) {
    summary.push(formatUiText(text.exportRunning, { total: currentChatExportState.total || 0 }));
  } else if (currentChatExportState.total) {
    summary.push(formatUiText(text.exportFinished, { total: currentChatExportState.total }));
  } else {
    summary.push(text.exportNoTask);
  }

  if (currentChatExportState.total) {
    summary.push(formatUiText(text.exportResult, {
      completed: currentChatExportState.completed,
      failed: currentChatExportState.failed
    }));
  }

  const startedAt = formatTime(currentChatExportState.startedAt);
  const finishedAt = formatTime(currentChatExportState.finishedAt);
  if (startedAt) summary.push(formatUiText(text.exportStartedAt, { time: startedAt }));
  if (finishedAt) summary.push(formatUiText(text.exportFinishedAt, { time: finishedAt }));

  document.getElementById("exportSummary").textContent = summary.join(text.listSeparator);

  const lines = [];
  const knownIdleMessages = [
    BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_CN].exportIdleStatus,
    BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_EN].exportIdleStatus,
    BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_CN].idleStatus,
    BATCH_UI_TEXT[BATCH_PROMPT_LANGUAGE_EN].idleStatus
  ];
  lines.push(
    !currentChatExportState.message || knownIdleMessages.includes(currentChatExportState.message)
      ? text.exportIdleStatus
      : localizeBatchRuntimeMessage(currentChatExportState.message)
  );
  if (currentChatExportState.total) {
    const savedCount = Math.min(
      currentChatExportState.total,
      currentChatExportState.completed + currentChatExportState.failed
    );
    lines.push(formatUiText(text.exportSaveProgress, {
      saved: savedCount,
      total: currentChatExportState.total
    }));
  }
  if (currentChatExportState.currentText) {
    lines.push(formatUiText(text.exportCurrentQuestion, { question: currentChatExportState.currentText }));
  }
  document.getElementById("exportStatus").textContent = lines.join("\n");

  const logs = document.getElementById("exportLogs");
  logs.replaceChildren();
  const items = currentChatExportState.logs.length ? currentChatExportState.logs.slice().reverse() : [];
  for (const item of items) {
    const li = document.createElement("li");
    li.className = "log-item";
    const timeText = formatTime(item.time);
    const messageText = localizeBatchRuntimeMessage(item.message);
    li.textContent = timeText ? `［${timeText}］${messageText}` : messageText;
    logs.appendChild(li);
  }
}

async function forceStopBatchState(message = "") {
  const nextMessage = message || getBatchUiText().batchStopped;
  const finishedAt = new Date().toISOString();
  const nextState = createBatchState({
    ...currentBatchState,
    running: false,
    batchId: "",
    message: nextMessage,
    finishedAt,
    logs: (currentBatchState.logs || []).concat({
      time: finishedAt,
      level: "info",
      message: nextMessage
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

function normalizeHotkeyDefaultText(value) {
  return String(value || "").replace(/\r\n?/g, "\n").trim();
}

function createHotkeySettings(items = {}) {
  const settings = { ...HOTKEY_DEFAULTS, ...(items || {}) };
  const patch = {};
  const oldPresetVersion = Number(items?.[HOTKEY_PRESET_VERSION_KEY] || 0) < HOTKEY_PRESET_VERSION;
  const translatePrefix = normalizeHotkeyDefaultText(HOTKEY_DEFAULT_PREFIX);
  const explainPrefixes = new Set([
    normalizeHotkeyDefaultText(HOTKEY_LEGACY_EXPLAIN_PREFIX),
    normalizeHotkeyDefaultText(HOTKEY_EXPLAIN_PREFIX)
  ]);

  if (oldPresetVersion) {
    const prefix2 = normalizeHotkeyDefaultText(items.prefix2);
    const prefix3 = normalizeHotkeyDefaultText(items.prefix3);
    const prefix4 = normalizeHotkeyDefaultText(items.prefix4);

    if (!prefix2 || prefix2 === translatePrefix || explainPrefixes.has(prefix2)) {
      settings.prefix2 = HOTKEY_DEFAULT_PREFIX;
      settings.newChat2 = false;
      patch.prefix2 = HOTKEY_DEFAULT_PREFIX;
      patch.newChat2 = false;
    }

    if (!prefix3 || prefix3 === translatePrefix || explainPrefixes.has(prefix3)) {
      settings.prefix3 = HOTKEY_EXPLAIN_PREFIX;
      settings.newChat3 = true;
      patch.prefix3 = HOTKEY_EXPLAIN_PREFIX;
      patch.newChat3 = true;
    }

    if (!prefix4 || prefix4 === translatePrefix || explainPrefixes.has(prefix4)) {
      settings.prefix4 = HOTKEY_EXPLAIN_PREFIX;
      settings.newChat4 = false;
      patch.prefix4 = HOTKEY_EXPLAIN_PREFIX;
      patch.newChat4 = false;
    }

    patch[HOTKEY_PRESET_VERSION_KEY] = HOTKEY_PRESET_VERSION;
  }

  return { settings, patch };
}

async function loadHotkeySettings() {
  const stored = await getSyncItems([...Object.keys(HOTKEY_DEFAULTS), HOTKEY_PRESET_VERSION_KEY]);
  const { settings: config, patch } = createHotkeySettings(stored);
  if (Object.keys(patch).length) {
    chrome.storage.sync.set(patch);
  }
  config.selectionBubbleUseCurrentChat = true;
  for (const key of Object.keys(HOTKEY_DEFAULTS)) {
    const element = document.getElementById(key);
    if (!element) continue;
    if (typeof HOTKEY_DEFAULTS[key] === "boolean") {
      element.checked = Boolean(config[key]);
    } else if (Array.isArray(HOTKEY_DEFAULTS[key])) {
      continue;
    } else {
      element.value = config[key] || HOTKEY_DEFAULTS[key];
    }
  }
  currentSelectionFilterUrls = normalizeSelectionFilterUrls(config.selectionBubbleExcludedUrls);
  renderSelectionFilterUrls();
}

function saveHotkeySettings(showTip = false) {
  const data = {};
  for (const key of Object.keys(HOTKEY_DEFAULTS)) {
    const element = document.getElementById(key);
    if (!element) continue;
    if (typeof HOTKEY_DEFAULTS[key] === "boolean") {
      data[key] = Boolean(element.checked);
    } else if (Array.isArray(HOTKEY_DEFAULTS[key])) {
      continue;
    } else {
      data[key] = element.value || HOTKEY_DEFAULTS[key];
    }
  }

  data.selectionBubbleUseCurrentChat = true;

  chrome.storage.sync.set(data, () => {
    if (showTip) flashTip("saved");
  });
}

function scheduleHotkeySettingsSave() {
  clearTimeout(hotkeySaveTimer);
  hotkeySaveTimer = setTimeout(() => {
    saveHotkeySettings(false);
  }, 350);
}

function normalizeSelectionFilterUrl(value) {
  return String(value || "").trim().replace(/\/+$/u, "");
}

function normalizeSelectionFilterUrls(values) {
  const seen = new Set();
  const result = [];
  for (const value of Array.isArray(values) ? values : []) {
    const text = normalizeSelectionFilterUrl(value);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }
  return result;
}

function renderSelectionFilterUrls() {
  const text = getBatchUiText();
  const summary = document.getElementById("selectionFilterSummary");
  if (summary) {
    summary.textContent = currentSelectionFilterUrls.length
      ? formatUiText(text.selectionFilterCount, { count: currentSelectionFilterUrls.length })
      : text.selectionFilterNone;
  }

  const list = document.getElementById("selectionFilterList");
  if (!list) return;
  list.replaceChildren();

  for (const urlText of currentSelectionFilterUrls) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.className = "filter-url-text";
    label.textContent = urlText;
    label.title = urlText;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "secondary-button";
    removeButton.textContent = text.selectionFilterRemove;
    removeButton.addEventListener("click", () => {
      currentSelectionFilterUrls = currentSelectionFilterUrls.filter((itemUrl) => itemUrl !== urlText);
      renderSelectionFilterUrls();
      saveSelectionFilterUrls();
    });

    item.append(label, removeButton);
    list.appendChild(item);
  }
}

function saveSelectionFilterUrls() {
  chrome.storage.sync.set({
    selectionBubbleExcludedUrls: currentSelectionFilterUrls
  });
}

function addSelectionFilterUrl() {
  const input = document.getElementById("selectionFilterInput");
  if (!input) return;

  const nextUrl = normalizeSelectionFilterUrl(input.value);
  if (!nextUrl) return;

  currentSelectionFilterUrls = normalizeSelectionFilterUrls(currentSelectionFilterUrls.concat(nextUrl));
  input.value = "";
  renderSelectionFilterUrls();
  saveSelectionFilterUrls();
  input.focus();
}

async function persistBatchConfig(showTip = false) {
  const focusWhenStuck = document.getElementById("batchFocusWhenStuck");
  const controlMode = document.getElementById("batchControlMode");
  const includeNearestHeading = document.getElementById("batchIncludeNearestHeading");
  const payload = {
    batchGlobalPrompt: document.getElementById("batchGlobalPrompt").value,
    batchPrompt: document.getElementById("batchPrompt").value,
    batchPromptLanguage: getSelectedBatchPromptLanguage(),
    batchInputs: document.getElementById("batchInputs").value,
    batchConversationMode: getSelectedBatchConversationMode(),
    batchNewChatUrl: document.getElementById("batchNewChatUrl").value.trim(),
    batchModel: getSelectedBatchModel(),
    batchIncludeNearestHeading: Boolean(includeNearestHeading && includeNearestHeading.checked),
    batchDelaySeconds: BATCH_DEFAULT_DELAY_SECONDS,
    batchFocusWhenStuck: Boolean(focusWhenStuck && focusWhenStuck.checked),
    batchControlMode: Boolean(controlMode && controlMode.checked),
    chatExportMode: getSelectedChatExportMode(),
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
  const chatExportMode = normalizeChatExportMode(config.chatExportMode);
  const batchModel = normalizeBatchModel(config.batchModel);
  const batchIncludeNearestHeading = config.batchIncludeNearestHeading !== false;
  const batchPrompt = !config.batchPrompt || isKnownBatchDefaultPrompt(config.batchPrompt)
    ? languageDefaults.prompt
    : config.batchPrompt;
  document.getElementById("batchGlobalPrompt").value = batchGlobalPrompt;
  document.getElementById("batchPrompt").value = batchPrompt;
  setBatchPromptLanguage(batchPromptLanguage);
  document.getElementById("batchInputs").value = config.batchInputs || "";
  setBatchConversationMode(batchConversationMode);
  setChatExportMode(chatExportMode);
  document.getElementById("batchModelSelect").value = batchModel;
  updateBatchModelSelectText();
  document.getElementById("batchNewChatUrl").value = typeof config.batchNewChatUrl === "string" ? config.batchNewChatUrl : "";
  document.getElementById("batchIncludeNearestHeading").checked = batchIncludeNearestHeading;
  const batchFocusWhenStuck = config.batchFocusWhenStuck === true;
  document.getElementById("batchFocusWhenStuck").checked = batchFocusWhenStuck;
  const batchControlMode = config.batchControlMode === true;
  document.getElementById("batchControlMode").checked = batchControlMode;
  currentBatchDirectoryName = config.batchDirectoryName || "";
  renderBatchDirectoryText();
  setActivePage("batch");

  if (
    batchGlobalPrompt !== config.batchGlobalPrompt ||
    batchPromptLanguage !== config.batchPromptLanguage ||
    batchConversationMode !== config.batchConversationMode ||
    chatExportMode !== config.chatExportMode ||
    config.batchModel !== batchModel ||
    typeof config.batchNewChatUrl !== "string" ||
    batchIncludeNearestHeading !== (config.batchIncludeNearestHeading !== false) ||
    batchPrompt !== config.batchPrompt ||
    Number(config.batchDelaySeconds) !== BATCH_DEFAULT_DELAY_SECONDS ||
    config.batchFocusWhenStuck !== batchFocusWhenStuck ||
    config.batchControlMode !== batchControlMode
  ) {
    await setLocal({
      batchGlobalPrompt,
      batchPromptLanguage,
      batchConversationMode,
      chatExportMode,
      batchModel,
      batchNewChatUrl: typeof config.batchNewChatUrl === "string" ? config.batchNewChatUrl : "",
      batchIncludeNearestHeading,
      batchPrompt,
      batchDelaySeconds: BATCH_DEFAULT_DELAY_SECONDS,
      batchFocusWhenStuck,
      batchControlMode
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
  const includeNearestHeading = document.getElementById("batchIncludeNearestHeading").checked;
  const globalPrompt = document.getElementById("batchGlobalPrompt").value.trim();
  const prompt = document.getElementById("batchPrompt").value.trim();
  const newChatUrl = document.getElementById("batchNewChatUrl").value.trim();
  const batchModel = getSelectedBatchModel();
  const delaySeconds = BATCH_DEFAULT_DELAY_SECONDS;
  const items = parseBatchItems(document.getElementById("batchInputs").value, includeNearestHeading);

  if (!items.length) {
    renderBatchState({
      ...currentBatchState,
      message: "没有可处理的文本，请检查待处理文本。"
    });
    setActivePage("batch");
    return;
  }

  if (!currentBatchDirectoryName) {
    setBatchDirectoryAlert(true);
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
        newChatUrl,
        batchModel,
        delaySeconds,
        focusWhenStuck: Boolean(document.getElementById("batchFocusWhenStuck").checked),
        controlMode: Boolean(document.getElementById("batchControlMode").checked),
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
    if (!currentBatchDirectoryName) setBatchDirectoryAlert(true);
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
        directoryName: currentBatchDirectoryName,
        exportMode: getSelectedChatExportMode()
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
      await forceStopBatchState();
      return;
    }

    if (response.state) {
      renderBatchState(response.state);
    }
  } catch (error) {
    await forceStopBatchState();
  } finally {
    stopPending = false;
    updateBatchActionButtons();
  }
}

async function deleteProgressConversations() {
  if (deleteProgressPending || currentBatchState.running) return;

  const newChatUrl = document.getElementById("batchNewChatUrl")?.value.trim() || "";
  const text = getBatchUiText();
  const closeDeleteProgressTab = async (response) => {
    if (!response?.closeMaintenanceTab || !response?.maintenanceTabId) return;
    await sendRuntimeMessage({
      type: "CLOSE_DELETE_PROGRESS_TAB",
      payload: { tabId: response.maintenanceTabId }
    }).catch(() => {});
  };
  deleteProgressPending = true;
  updateBatchActionButtons();
  renderBatchState({
    ...currentBatchState,
    message: newChatUrl
      ? text.deleteProgressReadingProject
      : text.deleteProgressReadingRecent
  });

  try {
    const listResponse = await sendRuntimeMessage({
      type: "DELETE_PROGRESS_CONVERSATIONS",
      payload: { mode: "list", newChatUrl }
    });
    if (!listResponse || !listResponse.ok) {
      throw new Error(listResponse && listResponse.error ? listResponse.error : text.deleteProgressReadFailed);
    }

    const targets = Array.isArray(listResponse.targets) ? listResponse.targets : [];
    if (!targets.length) {
      await closeDeleteProgressTab(listResponse);
      renderBatchState({
        ...currentBatchState,
        message: newChatUrl
          ? formatUiText(text.deleteProgressNoProject, { scanned: listResponse.scanned || 0 })
          : formatUiText(text.deleteProgressNoRecent, { scanned: listResponse.scanned || 0 })
      });
      return;
    }

    const confirmed = await showDeleteProgressConfirmDialog(targets);
    if (!confirmed) {
      await closeDeleteProgressTab(listResponse);
      renderBatchState({
        ...currentBatchState,
        message: newChatUrl
          ? formatUiText(text.deleteProgressCancelledProject, { count: targets.length })
          : formatUiText(text.deleteProgressCancelledRecent, { count: targets.length })
      });
      return;
    }

    renderBatchState({
      ...currentBatchState,
      message: formatUiText(text.deleteProgressConfirmed, { count: targets.length })
    });

    const response = await sendRuntimeMessage({
      type: "DELETE_PROGRESS_CONVERSATIONS",
      payload: {
        mode: "delete",
        newChatUrl,
        maintenanceTabId: listResponse.maintenanceTabId || 0,
        closeMaintenanceTab: listResponse.closeMaintenanceTab === true,
        targets,
        scanned: listResponse.scanned || 0,
        source: listResponse.source || ""
      }
    });
    if (!response || !response.ok) {
      throw new Error(response && response.error ? response.error : text.deleteProgressDeleteFailed);
    }

    const failedText = response.failed
      ? formatUiText(text.deleteProgressFailedCount, { failed: response.failed })
      : "";
    renderBatchState({
      ...currentBatchState,
      message: formatUiText(text.deleteProgressDeleted, {
        deleted: response.deleted || 0,
        matched: response.matched || 0,
        failedText
      })
    });
  } catch (error) {
    renderBatchState({
      ...currentBatchState,
      message: error && error.message ? error.message : text.deleteProgressDeleteFailed
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

function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy failed");
  return Promise.resolve();
}

function showDeleteProgressConfirmDialog(targets) {
  const items = Array.isArray(targets) ? targets : [];
  const text = getBatchUiText();
  const dialog = document.createElement("dialog");
  dialog.className = "filter-dialog delete-progress-dialog";

  const head = document.createElement("div");
  head.className = "filter-dialog-head";
  const titleGroup = document.createElement("div");
  const title = document.createElement("div");
  title.className = "filter-dialog-title";
  title.textContent = formatUiText(text.deleteProgressConfirmTitle, { count: items.length });
  const desc = document.createElement("div");
  desc.className = "filter-dialog-desc";
  desc.textContent = text.deleteProgressConfirmDesc;
  titleGroup.append(title, desc);
  head.appendChild(titleGroup);

  const body = document.createElement("div");
  body.className = "confirm-dialog-body";
  body.textContent = items.map((item, index) => `${index + 1}. ${item.title}`).join("\n");

  const actions = document.createElement("div");
  actions.className = "confirm-dialog-actions";
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = text.deleteProgressConfirmCancel;
  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "primary";
  confirmButton.textContent = text.deleteProgressConfirmDelete;
  actions.append(cancelButton, confirmButton);

  dialog.append(head, body, actions);
  document.body.appendChild(dialog);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (confirmed) => {
      if (settled) return;
      settled = true;
      resolve(confirmed);
      dialog.close();
      dialog.remove();
    };

    cancelButton.addEventListener("click", () => finish(false));
    confirmButton.addEventListener("click", () => finish(true));
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      finish(false);
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) finish(false);
    });

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });
}

function showDisciplineMapPromptCopyState(success) {
  const label = document.getElementById("copyDisciplineMapPromptLabel");
  const button = document.getElementById("copyDisciplineMapPrompt");
  if (!label || !button) return;

  const text = getBatchUiText();
  label.textContent = success
    ? text.copyDisciplineMapPromptCopied
    : text.copyDisciplineMapPromptCopyFailed;
  button.classList.toggle("is-copied", success);
  button.classList.toggle("is-copy-failed", !success);

  window.setTimeout(() => {
    const currentText = getBatchUiText();
    label.textContent = currentText.copyDisciplineMapPrompt;
    button.classList.remove("is-copied", "is-copy-failed");
  }, 1500);
}

function getDisciplineMapPrompt(language = getSelectedBatchPromptLanguage()) {
  return normalizeBatchPromptLanguage(language) === BATCH_PROMPT_LANGUAGE_EN
    ? DISCIPLINE_MAP_EN_PROMPT
    : DISCIPLINE_MAP_PROMPT;
}

function getDisciplineMapPromptTooltipHtml(language = getSelectedBatchPromptLanguage()) {
  if (normalizeBatchPromptLanguage(language) === BATCH_PROMPT_LANGUAGE_EN) {
    return `
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">Core Task</div>
        <div class="discipline-prompt-content">Design an Obsidian folder structure for a discipline map about "xxx current popular field/topic". Output only a detailed folder structure in a code block.</div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">Content and Structure Requirements</div>
        <div class="discipline-prompt-content">
          Include an introduction to the field/topic, important scholars, and important texts. Search degree programs, mainstream information sources, and top journals before answering.
        </div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">Format and Naming Rules</div>
        <div class="discipline-prompt-content">
          Use English for headings. When a relevant non-English original name matters, include the original name in parentheses on first appearance.<br>
          Person names, book titles, papers, and concept names need titles that summarize the full entry and lean toward academic status, theoretical contribution, research object, method, or content.
        </div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">Title Examples</div>
        <div class="discipline-hierarchy-box">The Protestant Ethic and the Spirit of Capitalism 1905 (Die protestantische Ethik und der Geist des Kapitalismus): Weber: Religion and the Formation of Modern Capitalism
Max Weber 1864-1920: Interpretive Sociology and Rationalization Theory</div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">Structure Rules</div>
        <div class="discipline-hierarchy-box">1. Major Section
└─ 1_1 Second-Level Section
   └─ 1_2_1 Third-Level Heading
      └─ 1_2_1 ◆ Body item</div>
      </div>
    `;
  }

  return `
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">核心任务</div>
        <div class="discipline-prompt-content">我想用 obsidian 梳理「xxx当前热门领域/议题」的思想地图，请设计一个文件夹的架构。只需要详细的文件夹架构，用 code 框输出。</div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">内容与结构要求</div>
        <div class="discipline-prompt-content">
          包含领域/议题介绍、重要学者、重要文本（影响力最大的导论/教科书/论文）三个部分。搜索各培养计划、主流信息源、学科顶级刊物后回答。初步了解时阅读「介绍」；深入了解时再看其他部分。
        </div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">格式与命名规范</div>
        <div class="discipline-prompt-content">
          各级标题使用「<strong>中文</strong>（<strong>英文</strong>）」格式。作品/文章名的中文需要加书名号。<br>
          人名、书名（或论文）、概念名需要取概括全文的标题，偏向学术地位、理论贡献、研究对象、方法贡献、具体内容概括。
        </div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">标题示例</div>
        <div class="discipline-hierarchy-box">《自我的根源》 1989 Sources of the Self：泰勒：现代身份与道德来源
查尔斯 泰勒 1931– Charles Taylor：承认政治与现代自我理论</div>
      </div>
      <div class="discipline-prompt-section">
        <div class="discipline-prompt-title">架构规范</div>
        <div class="discipline-hierarchy-box">1. 大章节 (中文(英文))
└─ 1_1 二级章节 (英文(中文))
   └─ 1_2_1 三级标题 (英文(中文))
      └─ 1_2_1 ◆ 正文内容</div>
      </div>
    `;
}

function renderDisciplineMapPromptTooltip(language = getSelectedBatchPromptLanguage()) {
  const tooltipBody = document.getElementById("disciplineMapPromptTooltipBody");
  if (tooltipBody) {
    tooltipBody.innerHTML = getDisciplineMapPromptTooltipHtml(language);
  }
}

function bindDisciplineMapPromptButton() {
  const button = document.getElementById("copyDisciplineMapPrompt");
  renderDisciplineMapPromptTooltip();
  if (!button) return;

  button.addEventListener("click", () => {
    copyTextToClipboard(getDisciplineMapPrompt().trim())
      .then(() => showDisciplineMapPromptCopyState(true))
      .catch(() => showDisciplineMapPromptCopyState(false));
  });
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
  const newChatUrl = document.getElementById("batchNewChatUrl");
  const batchModelSelect = document.getElementById("batchModelSelect");
  const batchModelButton = document.getElementById("batchModelSelectButton");
  const includeNearestHeading = document.getElementById("batchIncludeNearestHeading");
  const focusWhenStuck = document.getElementById("batchFocusWhenStuck");
  const controlMode = document.getElementById("batchControlMode");

  bindElementEvent(globalPrompt, "input", scheduleBatchConfigSave);
  bindElementEvent(prompt, "input", scheduleBatchConfigSave);
  bindElementEvent(inputs, "input", scheduleBatchConfigSave);
  bindElementEvent(newChatUrl, "input", scheduleBatchConfigSave);
  bindElementEvent(batchModelSelect, "change", () => {
    updateBatchModelSelectText();
    persistBatchConfig(true).catch(() => {});
  });
  bindElementEvent(batchModelButton, "click", (event) => {
    event.stopPropagation();
    toggleBatchModelMenu();
  });
  document.querySelectorAll("[data-batch-model-option]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const select = document.getElementById("batchModelSelect");
      if (select) select.value = normalizeBatchModel(button.dataset.batchModelOption);
      updateBatchModelSelectText();
      closeBatchModelMenu();
      persistBatchConfig(true).catch(() => {});
    });
  });
  document.addEventListener("click", closeBatchModelMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeBatchModelMenu();
  });
  bindElementEvent(focusWhenStuck, "change", () => persistBatchConfig(true));
  bindElementEvent(controlMode, "change", () => persistBatchConfig(true));
  conversationMode?.querySelectorAll("[data-batch-conversation-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setBatchConversationMode(button.dataset.batchConversationMode);
      persistBatchConfig(true).catch(() => {});
    });
  });
  document.querySelectorAll("#chatExportMode [data-chat-export-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setChatExportMode(button.dataset.chatExportMode);
      persistBatchConfig(true).catch(() => {});
    });
  });
  bindElementEvent(includeNearestHeading, "change", () => persistBatchConfig(true));
  bindElementEvent(globalPrompt, "change", () => persistBatchConfig(true));
  bindElementEvent(prompt, "change", () => persistBatchConfig(true));
  bindElementEvent(inputs, "change", () => persistBatchConfig(true));
  bindElementEvent(newChatUrl, "change", () => persistBatchConfig(true));
  bindElementEvent(document.getElementById("batchStart"), "click", startBatch);
  bindElementEvent(document.getElementById("batchStop"), "click", stopBatch);
  bindElementEvent(document.getElementById("deleteProgressChats"), "click", () => {
    deleteProgressConversations().catch(() => {});
  });
  bindElementEvent(document.getElementById("batchClearInputs"), "click", () => {
    clearBatchInputs().catch(() => {});
  });
  bindDisciplineMapPromptButton();
  bindElementEvent(document.getElementById("pickBatchDirectory"), "click", pickBatchDirectory);
  document.querySelectorAll("[data-batch-language]").forEach((button) => {
    button.addEventListener("click", () => {
      switchBatchPromptLanguage(button.dataset.batchLanguage).catch(() => {});
    });
  });
}

function bindExportEvents() {
  bindElementEvent(document.getElementById("pickExportDirectory"), "click", pickBatchDirectory);
  bindElementEvent(document.getElementById("exportCurrentChat"), "click", () => {
    startChatExport().catch(() => {});
  });
  bindElementEvent(document.getElementById("exportStop"), "click", () => {
    stopChatExport().catch(() => {});
  });
}

function bindHotkeyEvents() {
  const groups = document.getElementById("groups");
  const selectionBubbleEnabled = document.getElementById("selectionBubbleEnabled");
  const selectionBubbleUseCurrentChat = document.getElementById("selectionBubbleUseCurrentChat");
  const quickMessageProjectUrl = document.getElementById("quickMessageProjectUrl");
  const filterDialog = document.getElementById("selectionFilterDialog");
  const filterInput = document.getElementById("selectionFilterInput");
  const openFilterDialog = document.getElementById("openSelectionFilterDialog");
  const closeFilterDialog = document.getElementById("closeSelectionFilterDialog");
  const addFilterUrl = document.getElementById("addSelectionFilterUrl");
  const closeSelectionFilterDialog = () => {
    if (!filterDialog) return;
    if (typeof filterDialog.close === "function") {
      filterDialog.close();
    } else {
      filterDialog.removeAttribute("open");
    }
  };

  if (groups) {
    groups.addEventListener("input", scheduleHotkeySettingsSave);
    groups.addEventListener("change", () => saveHotkeySettings(false));
  }
  if (selectionBubbleEnabled) {
    selectionBubbleEnabled.addEventListener("change", () => saveHotkeySettings(false));
  }
  if (selectionBubbleUseCurrentChat) {
    selectionBubbleUseCurrentChat.addEventListener("change", () => saveHotkeySettings(false));
  }
  if (quickMessageProjectUrl) {
    quickMessageProjectUrl.addEventListener("input", scheduleHotkeySettingsSave);
    quickMessageProjectUrl.addEventListener("change", () => saveHotkeySettings(false));
  }
  if (openFilterDialog && filterDialog) {
    openFilterDialog.addEventListener("click", () => {
      if (typeof filterDialog.showModal === "function") {
        filterDialog.showModal();
      } else {
        filterDialog.setAttribute("open", "");
      }
      filterInput?.focus();
    });
  }
  if (closeFilterDialog && filterDialog) {
    closeFilterDialog.addEventListener("click", closeSelectionFilterDialog);
    filterDialog.addEventListener("click", (event) => {
      if (event.target !== filterDialog) return;
      const rect = filterDialog.getBoundingClientRect();
      const outsideDialog =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outsideDialog) closeSelectionFilterDialog();
    });
  }
  if (addFilterUrl) {
    addFilterUrl.addEventListener("click", addSelectionFilterUrl);
  }
  if (filterInput) {
    filterInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      addSelectionFilterUrl();
    });
  }
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
  await runStartupStep("渲染快捷消息预设", renderHotkeyGroups);
  await runStartupStep("绑定顶部导航", bindTabEvents);
  await runStartupStep("绑定批量消息", bindBatchEvents);
  await runStartupStep("绑定对话导出", bindExportEvents);
  await runStartupStep("绑定快捷消息", bindHotkeyEvents);
  await runStartupStep("绑定运行状态", bindRuntimeEvents);

  await Promise.all([
    runStartupStep("读取快捷消息设置", loadHotkeySettings),
    runStartupStep("读取批量设置", loadBatchConfig),
    runStartupStep("读取批量状态", loadBatchState),
    runStartupStep("读取导出状态", loadChatExportState)
  ]);
});
