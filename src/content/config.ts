import { defineCollection, z } from 'astro:content';

const aiLearning = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.literal('AI 学习记'),
    tags: z.array(z.string()),
    summary: z.string(),
    featured: z.boolean().default(false),
  }),
});

const opsNotes = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.literal('运维记'),
    tags: z.array(z.string()),
    summary: z.string(),
    featured: z.boolean().default(false),
  }),
});

const readingLife = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.literal('读书 & 生活感悟'),
    tags: z.array(z.string()),
    summary: z.string(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    category: z.literal('作品集'),
    tags: z.array(z.string()),
    summary: z.string(),
    featured: z.boolean().default(false),
    // 项目详情页的链接放在 markdown 正文中，不在 frontmatter
  }),
});

export const collections = {
  'ai-learning': aiLearning,
  'ops-notes': opsNotes,
  'reading-life': readingLife,
  projects,
};
