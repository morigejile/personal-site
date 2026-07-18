# 个人网站 - 快速上手

## 项目路径
`D:\Claude project\personal-site\`

## 关键文件
- [设计方案](spec/2026-07-15-personal-site-design.md) — 最终确认版设计规格
- [首页 Demo](demo/index.html) — 最终确认版视觉参考
- 项目已完成 Astro 初始化（`npm install` 完成）

## 预览 Demo

```bash
cd "D:\Claude project\personal-site"
python -m http.server 4321
```
浏览器打开 `http://localhost:4321/demo/index.html`

## 已确认的核心决策

| 维度 | 决策 |
|------|------|
| 框架 | Astro 静态生成 (SSG) |
| 配色 | 大地色系（橄榄浅米白 `#f5f0e3` + 陶土 `#e8d5c8` + 深咖 `#3e2723` + 橘色 `#c96442`） |
| 字体 | Noto Serif SC 全衬线 · Dancing Script（mori 标识）· Source Code Pro（代码） |
| 布局 | 960px 单列居中（padding 0 24px） |
| 内容管理 | Markdown + Git |
| 首页结构 | Recent Thoughts → Projects → AI 学习记(Timeline) → About |
| 导航 | 首页 / AI 学习记 / 运维记 / 读书 & 生活感悟 / 作品集 / About mori（左对齐） |
| 品牌标识 | About **mori**（Dancing Script 24px，手写体） |
| 区域标题格式 | 14px / 600 / uppercase / letter-spacing 2.5px |
| 页脚 | © 2026 **MORI** · 用 💜（#c44a7c 紫粉）和 AI 搭建 |
| Timeline 标记 | 红色填充圆点 `#d44`，竖线 `top: 11px` 不超出圆点 |
| 语言 | 中文为主 |
| 暗色模式 | 不需要 |
| 移动端导航 | 汉堡菜单，断点 768px |
| View Transitions | 淡入淡出 |
| 字体加载 | Google Fonts CDN |
| 部署 | Cloudflare Pages，域名 mrmori.com.cn |
| 首页文章数据 | Content Collections 动态渲染，`featured: true` 标记精选 |
| Section 分割 | 无分隔线，仅 padding |

## 首页板块详情

1. **Recent Thoughts** — 2 篇精选文章，标题(h3) + 摘要 + 板块名·日期（无「阅读 →」）
2. **Projects** — 2×2 卡片网格，每篇文章最多 2 个技术标签（无「在线演示」）
3. **AI 学习记** — Timeline 竖线 + 红色填充圆点，每条 2 个标签（无「阅读 →」）
4. **About** — 个人介绍，两段文字紧挨（无间距）+ GitHub/邮件/RSS

## 补充已确认的设计

| 项目 | 决策 |
|------|------|
| 文章详情页 | 带侧边 TOC + 底部上一篇/下一篇导航 + 相关文章推荐 |
| 列表页 | 简洁文章列表（标题 + 日期 + 摘要，无「阅读 →」） |
| 标签筛选 | 点击标签跳转至对应板块列表页 |
| 导航栏对齐 | 与内容区左对齐（`width: 100%` 修复 flex 对齐） |
| 品牌呈现 | 导航栏「About mori」链接，mori 手写体 |
| 内容板块 | 4 个集合：ai-learning / ops-notes / reading-life / projects |
| 文章图片 | 存放于 `public/images/{板块名}/` |
| View Transitions | 淡入淡出全局过渡 |
| 外部链接 | GitHub: https://github.com/morigejile / Email: baomorigejile@gmail.com |
| 内容区分 | reading-life 通过 tags 区分"读书"与"生活" |

## Astro 项目状态

- 已初始化（`npm install` 完成）
- 项目配置：site: https://mrmori.com.cn, srcDir: src, outDir: dist, port: 4321
- 目录结构已建好（layouts, components, pages/4板块, content/4集合, public/images/4目录）

## 部署说明（Cloudflare Pages）

| 项目 | 值 |
|------|-----|
| 构建命令 | `npm run build` |
| 输出目录 | `dist/` |
| 适配器 | 不需要（Astro SSG 原生支持） |
| 域名 | mrmori.com.cn |

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages
2. 创建 Pages 项目 → 连接 Git 仓库
3. 框架预设选 **Astro**（自动填充构建命令和输出目录）
4. 添加自定义域名 mrmori.com.cn

## 待开发的框架项

1. 配置 Content Collections schema（4 集合 + featured 标记）
2. 创建布局组件（BaseLayout: nav + footer + fonts）
3. 开发首页 `/`（动态取 featured 文章）
4. 开发 4 个板块列表页 `/ai-learning/ /ops-notes/ /reading-life/ /projects/`
5. 开发文章详情页 `[slug].astro`（含 TOC + 上/下一篇 + 相关文章）
6. 开发 `/about/` 页面
7. 创建示例 Markdown 文章（每个板块 2-3 篇）
8. SEO 元信息 / RSS / Sitemap / Favicon
9. 响应式/移动端适配（汉堡菜单 + 768px 断点）
