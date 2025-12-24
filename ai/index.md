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
      link: /ai/browser-use
    - theme: alt
      text: 更多内容
      link: https://github.com/Wadehl

features:
  - icon: 🤖
    title: Browser-Use 最佳实践
    details: 基于 CDP + Playwright + BrowserUse 的浏览器自动化测试解决方案
    link: /ai/browser-use
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
