---
layout: home
title: AI

hero:
  name: LLM & AI Agent
  text: 大语言模型与智能代理
  tagline: 探索大语言模型、AI Agent 在实际场景中的应用与最佳实践
  image:
    src: /gemini-logo.png
    alt: LLM & AI Agent
  actions:
    - theme: brand
      text: 开始阅读
      link: /ai/codex-subagent
    - theme: alt
      text: 更多内容
      link: https://github.com/Wadehl

features:
  - icon: 🤖
    title: Codex Subagent
    details: 2026-09-22 · Codex Subagent 的实现，以及 Pi Collaboration Plugin 的接法
    link: /ai/codex-subagent
  - icon: 🌐
    title: Browser-Use 最佳实践
    details: 2025-11-21 · 基于 CDP + Playwright + BrowserUse 的浏览器自动化测试
    link: /ai/browser-use
  - icon: 🕷️
    title: AI 赋能爬虫
    details: 2025-06-20 · 从固定规则匹配走到 Crawl4AI 和 Browser-use
    link: /ai/ai-crawler
  - icon: 🧩
    title: TypeScript 与 MCP
    details: 2025-03-10 · 用 TypeScript 把 MCP 服务做成可维护的工程
    link: /ai/typescript-mcp
---

<script setup>
  import { useRoute } from "vitepress";
  import { onMounted } from "vue";

  const { path } = useRoute();
  onMounted(() => {
    if(path === '/ai/' || path === '/ai/index.html') {
      document.documentElement.style.setProperty('--vp-home-hero-name-color', 'transparent');
      document.documentElement.style.setProperty('--vp-home-hero-name-background', 'linear-gradient(120deg, #667eea 30%, #764ba2)');
      document.documentElement.style.setProperty('--vp-home-hero-image-background-image', 'linear-gradient(-45deg, #667eea 50%, #764ba2 50%)');
      document.documentElement.style.setProperty('--vp-home-hero-image-filter', 'blur(40px)');
    }
  });
</script>
