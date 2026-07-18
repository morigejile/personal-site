---
title: "RAG 入门：给你的文档库装上对话能力"
date: "2026-06-15"
category: "AI 学习记"
tags: ["RAG", "LLM", "向量数据库"]
summary: "从向量嵌入到检索增强生成，一步一步搭建一个能聊天的技术文档助手。"
featured: true
---

## 什么是 RAG

RAG（Retrieval-Augmented Generation，检索增强生成）是目前让 LLM 回答私有知识问题的主流方案。核心思想很简单：

1. 把文档分割成小块，向量化后存入向量数据库
2. 用户提问时，从向量数据库中检索最相关的文档片段
3. 把这些片段 + 用户问题一起发给 LLM，让它基于这些上下文回答

相比于微调，RAG 的优点是：不需要训练，更新文档只需要重新索引，回答时能引用原文。

## 技术栈选择

我选择了以下方案搭建原型：

- **嵌入模型**：`text-embedding-3-small`（OpenAI），1536 维
- **向量数据库**：ChromaDB（本地运行，Python 客户端）
- **LLM**：Claude API
- **文档切分**：LangChain 的 RecursiveCharacterTextSplitter

## 搭建步骤

### 1. 文档处理

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n## ", "\n### ", "\n\n", "\n", "。", " ", ""]
)
chunks = text_splitter.split_text(document)
```

关键参数是 `chunk_size` 和 `chunk_overlap`。500 token 的块大小适合技术文档——足够包含一个完整的概念说明，又不会引入太多噪声。

### 2. 向量化与存储

```python
import chromadb
from openai import OpenAI

client = OpenAI()
collection = chromadb.Client().create_collection("tech-docs")

for i, chunk in enumerate(chunks):
    resp = client.embeddings.create(
        input=chunk,
        model="text-embedding-3-small"
    )
    collection.add(
        ids=[str(i)],
        embeddings=[resp.data[0].embedding],
        documents=[chunk]
    )
```

### 3. 检索与生成

检索时，核心是 `top_k` 参数。太大会引入噪声，太小可能遗漏相关信息。

```python
def ask(question):
    q_emb = client.embeddings.create(input=question, model="text-embedding-3-small")
    results = collection.query(query_embeddings=[q_emb.data[0].embedding], n_results=3)

    context = "\n\n".join(results["documents"][0])
    prompt = f"基于以下文档回答用户问题：\n\n{context}\n\n问题：{question}"

    return claude_api.complete(prompt)
```

## 效果与坑

**效果**：对于技术文档类的问答，准确率能达到 85% 以上。特别是 "这个参数是什么意思" "这个配置怎么改" 这类问题。

**踩过的坑**：

1. **块大小很重要**：一开始用 2000 token 的块，结果每个块包含太多概念，检索时匹配精度下降。500 token 效果最好。

2. **中文分词**：英文的 chunk 边界通常按句子来，中文要考虑按句号、段落来切，否则会切断语义。

3. **检索质量比 LLM 重要**：如果检索到的文档不相关，再好的 LLM 也答不对。花时间优化检索比调 prompt 更有价值。

## 下一步

目前我在尝试加入 HyDE（假设文档嵌入）和多轮对话的记忆能力，让 RAG 系统能处理更复杂的查询场景。
