import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mrmori.com.cn',
  outDir: 'dist',
  srcDir: 'src',
  publicDir: 'public',
  server: { port: 4321 },
});
