---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: vue

hero:
  name: "vue"
  text: "渐进式\nJavaScript 框架"
  tagline: "与Vue底层相关的内容整理以及关键代码的实现"
  image:
    src: /Vue-logo.png
    alt: vue
  # actions:
    # - theme: brand
      # text: Markdown Examples
      # link: /markdown-examples
    # - theme: alt
      # text: API Examples
      # link: /api-examples
features:
- title: Vue3 - diff
  icon: <svg t="1682650880950" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4776" width="32" height="32"><path d="M76.416 164.309333L512 916.096 947.584 167.936v-3.626667H778.24L514.56 617.258667 251.989333 164.352z" fill="#41B883" p-id="4777"></path><path d="M252.032 164.309333l262.485333 452.992L778.24 164.309333h-158.848L515.584 342.613333 412.16 164.266667z" fill="#35495E" p-id="4778"></path></svg>
  details: Vue3 diff算法的实现
  link: /vue/vue-diff
- title: Vue3 - Reactivity
  icon: <svg t="1682650880950" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4776" width="32" height="32"><path d="M76.416 164.309333L512 916.096 947.584 167.936v-3.626667H778.24L514.56 617.258667 251.989333 164.352z" fill="#41B883" p-id="4777"></path><path d="M252.032 164.309333l262.485333 452.992L778.24 164.309333h-158.848L515.584 342.613333 412.16 164.266667z" fill="#35495E" p-id="4778"></path></svg>
  details: Vue3响应式系统的实现
  link: /vue/vue3-reactivity
- title: Vue2 - 双向绑定
  icon: <svg t="1682650880950" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4776" width="32" height="32"><path d="M76.416 164.309333L512 916.096 947.584 167.936v-3.626667H778.24L514.56 617.258667 251.989333 164.352z" fill="#41B883" p-id="4777"></path><path d="M252.032 164.309333l262.485333 452.992L778.24 164.309333h-158.848L515.584 342.613333 412.16 164.266667z" fill="#35495E" p-id="4778"></path></svg>
  details: Object.defineProperty, DocumentFragment, Pub/Sub Pattern 实现简单的Vue2双向绑定。
  link: /vue/vue2-easy-binding
- title: Vue2 - vDOM
  icon: <svg t="1682650880950" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4776" width="32" height="32"><path d="M76.416 164.309333L512 916.096 947.584 167.936v-3.626667H778.24L514.56 617.258667 251.989333 164.352z" fill="#41B883" p-id="4777"></path><path d="M252.032 164.309333l262.485333 452.992L778.24 164.309333h-158.848L515.584 342.613333 412.16 164.266667z" fill="#35495E" p-id="4778"></path></svg>
  details: Object.defineProperty, DocumentFragment, Pub/Sub Pattern 实现简单的Vue2双向绑定。
  link: /vue/vue-vDom	
---
<script setup>
  import { useRoute } from "vitepress";
  import { onMounted } from "vue";

  const { path } = useRoute();
  onMounted(() => {
    if(path === '/vue/' || path === '/vue/index.html') {
      document.documentElement.style.setProperty('--vp-home-hero-name-color', 'transparent');
      document.documentElement.style.setProperty('--vp-home-hero-name-background', '-webkit-linear-gradient(315deg,#42d392 25%,#647eff)');
      document.documentElement.style.setProperty('--vp-home-hero-image-background-image', 'linear-gradient(315deg,#42d392 25%,#647eff)');
      document.documentElement.style.setProperty('--vp-home-hero-image-filter', 'blur(56px)');
      document.documentElement.style.setProperty('-webkit-background-clip', 'text');
    }
  });
</script>
