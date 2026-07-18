# 个人网站设计方案

## 项目概述

综合展示个人品牌，获得工作机会。目标受众：潜在雇主、HR、技术同行。
品牌标识：mori

## 设计基调

| 维度 | 决策 |
|------|------|
| 气质 | 极简克制、技术感、暖色调 |
| 配色 | 大地色系：橄榄浅米白底 `#f5f0e3` + 陶土边框 `#e8d5c8` + 深咖文字 `#3e2723` + 橘色点缀 `#c96442` |
| 字体 | Noto Serif SC 全衬线（标题/正文），Dancing Script（品牌标识 mori），代码 Source Code Pro |
| 暗色模式 | 不需要 |
| 语言 | 中文为主 |
| 内容区宽度 | 960px 居中（容器 padding: 0 24px，实际内容区 912px）|

## 技术选型

| 维度 | 决策 |
|------|------|
| 框架 | Astro 静态生成 (SSG) |
| 内容管理 | Markdown 文件 + Git 版本控制 |
| 字体加载 | Google Fonts CDN（与 demo 一致） |
| 部署 | Cloudflare Pages（域名 mrmori.com.cn）|

## 网站结构

```
首页 /
├── 导航栏（左对齐，6 个链接）
├── Recent Thoughts（2 篇精选文章，等宽 h3 格式，无「阅读 →」）
├── Projects（2×2 卡片网格，每卡最多 2 个标签）
├── AI 学习记（Timeline 竖线 + 红色填充圆点标记）
├── About（个人介绍 + GitHub/邮件/RSS）
└── 页脚（版权行）

独立页面：
  /ai-learning/      → AI 学习记（列表 + 详情）
  /ops-notes/        → 运维记（列表 + 详情）
  /reading-life/     → 读书 & 生活感悟（列表 + 详情）
  /projects/         → 作品集（列表 + 详情）
  /about/            → about mori（个人介绍完整版）
```

## 导航栏

首页 · AI 学习记 · 运维记 · 读书 & 生活感悟 · 作品集 · About mori
- 6 个链接左对齐，与内容区起始位置一致（容器设 `width: 100%` 解决 flex 对齐问题）
- 字体 16px，间距 61.5px
- 链接默认色 `#8b7355`，悬停 `#3e2723`
- `mori` 使用 Dancing Script 手写体，24px，与 About 之间用 `&nbsp;` 隔开
- 粘性定位，半透明背景 `rgba(245,240,227,0.95)`
- 底部 1px `#e8d5c8` 边框
- **移动端（≤768px）**：汉堡菜单，点击 ☰ 展开下拉

## 内容板块

| 板块 | 内容集合目录 | Frontmatter category |
|------|-------------|---------------------|
| AI 学习记 | `ai-learning/` | "AI 学习记" |
| 运维记 | `ops-notes/` | "运维记" |
| 读书 & 生活感悟 | `reading-life/` | "读书 & 生活感悟" |
| 作品集 | `projects/` | "作品集" |

## 首页详细布局

### 1. 导航栏 (sticky)
- 6 个链接左对齐，间距 34px，字号 16px
- 导航栏内容与下方模块内容左对齐（`width: 100%` 确保 flex 容器内撑满）
- `About mori`：About 首字母大写，mori 使用 Dancing Script 手写体 24px

### 2. Recent Thoughts
- 标题：`RECENT THOUGHTS`（14px 大写 letter-spacing，weight 600）
- 两篇文章等宽，均使用 h3（20px, weight 600, line-height 1.5）
- 每篇：标题 + 摘要 + 板块名 · 日期
- **无「阅读 →」链接**
- 两篇文章间无分割线，底部 36px 间距

### 3. 作品集 (Projects)
- 标题：`PROJECTS`（14px 大写 letter-spacing）
- 2×2 网格，卡片样式（米白背景 `#faf3ea`、陶土边框 `#e8d5c8`、圆角 6px）
- 每张卡片：项目名 + 描述 + 最多 2 个技术标签
- **无「在线演示」链接**
- 底部「查看全部作品 →」按钮

### 4. AI 学习记
- 标题：`AI 学习记`（14px 大写 letter-spacing）
- Timeline 样式：左侧竖线 `#d4b896`，红色填充圆点标记（`#d44`，10px 圆形）
- 每条：日期 + 标题 + 2 个标签 + 摘要
- **无「阅读 →」链接**
- 底部「更多 AI 学习记 →」按钮

### 5. About
- 标题：`ABOUT`（14px 大写 letter-spacing）
- 文案：两段文字，段间距取消（`p + p { margin-top: 0 }`）
- GitHub/邮件/RSS 链接

### 6. 页脚
- 文案：`© 2026 MORI · 用 💜（#c44a7c 紫粉色）和 AI 搭建`

## Section 之间
- 无分隔线，仅通过 padding 区分
- Recent Thoughts 距导航栏：80px padding-top

## 列表页（各板块）
- 简洁文章列表样式：标题(h3) + 日期 + 摘要
- 顶部显示分类标签底色块

## 文章详情页
- 带侧边 TOC（Table of Contents）
- 底部上一篇/下一篇导航
- 底部相关文章推荐

## 文章格式规范

```markdown
---
title: "文章标题"
date: "2026-07-10"
category: "运维记"
tags: ["可观测性", "Kubernetes"]
summary: "文章摘要"
featured: false
---
```

- `featured: true` 的文章会出现在首页 Recent Thoughts / Timeline 中
- 首页数据源：从 Content Collections 动态渲染，按日期排序
- 读书 & 生活感悟（`reading-life` 集合）：通过 tags 区分类型（如含 "读书" 或 "生活" tag）

## 外部链接

| 链接 | 地址 |
|------|------|
| GitHub | https://github.com/morigejile |
| 邮箱 | baomorigejile@gmail.com |
| RSS | /rss.xml |

## 配色方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 页面底色 | `#f5f0e3` | 橄榄浅米白 |
| 卡片/区块底色 | `#faf3ea` | 浅暖色 |
| 边框 | `#e8d5c8` | 陶土色 |
| Section 间间距 | — | 无分隔线，仅 padding |
| 深色文字 | `#3e2723` | 标题 |
| 正文文字 | `#8b7355` | 中咖 |
| 辅助文字 | `#b8956a` | 日期/元信息 |
| 分类标签背景 | `#f5e6d3` | 浅陶土 |
| 分类标签文字 | `#8b6914` | 暖棕 |
| 链接/强调色 | `#c96442` | 橘色 |
| 页脚心形 | `#c44a7c` | 紫粉色 |

## 响应式

- 断点：`768px`
- ≥768px：桌面版导航（6 链接左对齐）
- <768px：汉堡菜单导航

## 待开发项

1. Content Collections schema（4 个集合 + frontmatter 含 featured）
2. 布局组件（BaseLayout: nav + footer，Google Fonts 链接）
3. 首页 `/`（动态取 featured 文章）
4. 4 个板块列表页
5. 文章详情页（含 TOC + 上/下一篇 + 相关文章）
6. `/about/` 页面
7. 示例 Markdown 文章（每个板块 2-3 篇）
8. SEO 元信息 / RSS / Sitemap / Favicon
9. 响应式/移动端适配（汉堡菜单实现）
