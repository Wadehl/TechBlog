---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: python

hero:
  name: "python"
  text: "弱类型、可多线程的\n高级脚本语言"
  tagline: "python Django后端开发与爬虫"
  image:
    src: Python-logo.svg
    alt: python
features:
  - title: Python 爬虫 —— 基础
    icon: 🕷️
    link: /python/crawler/Python1
  - title: Python 爬虫 —— Request库的使用
    icon: 🕷️
    link: /python/crawler/Python2
  - title: Python 爬虫 —— 数据解析
    icon: 🕷️
    link: /python/crawler/Python3
  - title: Python 爬虫 —— Re模块
    icon: 🕷️
    link: /python/crawler/Python4
  - title: Python 爬虫 —— Bs模块
    icon: 🕷️
    link: /python/crawler/Python5
  - title: Python 爬虫 —— Xpath模块
    icon: 🕷️
    link: /python/crawler/Python6
  - title: Python 爬虫 —— 实战
    icon: 🕷️
    link: /python/crawler/Python7
  - title: Python 爬虫 —— 多线程模式
    icon: 🕷️
    link: /python/crawler/Python8
---

<script setup>
  import { useRoute } from "vitepress";

  const { path } = useRoute();
  if(path === '/python/' || path === '/python/index.html') {
    document.documentElement.style.setProperty('--vp-home-hero-name-color', 'transparent');
    document.documentElement.style.setProperty('--vp-home-hero-name-background', 'linear-gradient(78deg, #be93c5 30%, #7bc6cc)');
    document.documentElement.style.setProperty('--vp-home-hero-image-background-image', 'linear-gradient(to right, #be93c5, #7bc6cc)');
    document.documentElement.style.setProperty('--vp-home-hero-image-filter', 'blur(40px)');
  }
</script>
