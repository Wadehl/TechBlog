---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: vue

hero:
  name: "算法"
  text: "一些算法题解"
  tagline: "为了Offer！"
  image:
    src: /algorithm.svg
    alt: algorithm
  # actions:
    # - theme: brand
      # text: Markdown Examples
      # link: /markdown-examples
    # - theme: alt
      # text: API Examples
      # link: /api-examples
features:
- title: LeetCode - LIS 最长递增子序列算法
  icon: <svg t="1693711716875" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21015" width="200" height="200"><path d="M672.855 942.085L115.144 832.584V289.592l557.711 95.913z" fill="#5CB9FF" p-id="21016"></path><path d="M672.855 960a17.869 17.869 0 0 1-3.45-0.333L111.692 850.156a17.91 17.91 0 0 1-14.46-17.577V289.592a17.905 17.905 0 0 1 20.947-17.653l557.711 95.913a17.91 17.91 0 0 1 14.879 17.653V942.09A17.92 17.92 0 0 1 672.855 960zM133.053 817.843L654.945 920.32V400.599l-521.892-89.748v506.992z" fill="" p-id="21017"></path><path d="M902.441 666.189L672.855 942.085v-556.58L908.856 160.83z" fill="#FF5757" p-id="21018"></path><path d="M672.85 960a17.915 17.915 0 0 1-17.905-17.91V385.505a17.9 17.9 0 0 1 5.56-12.974l236.007-224.676a17.91 17.91 0 0 1 30.264 13.2l-6.42 505.36a17.93 17.93 0 0 1-4.142 11.222L686.633 953.54A17.915 17.915 0 0 1 672.85 960z m17.92-566.82v499.38l193.838-232.956 5.801-456.483-199.64 190.06z m211.666 273.004h0.051-0.051z" fill="" p-id="21019"></path><path d="M672.855 385.505l-557.711-95.913L398.97 81.915l509.885 78.914z" fill="#FFDD50" p-id="21020"></path><path d="M672.855 403.415a17.818 17.818 0 0 1-3.031-0.261l-557.716-95.908a17.92 17.92 0 0 1-7.542-32.107L388.393 67.456a17.9 17.9 0 0 1 13.317-3.246l509.89 78.92a17.905 17.905 0 0 1 9.61 30.674l-236 224.67a17.92 17.92 0 0 1-12.355 4.941z m-513.04-124.314l507.213 87.225 203.11-193.362-466.574-72.213-243.748 178.35z" fill="" p-id="21021"></path><path d="M672.855 588.943c-1.055 0-2.12-0.097-3.174-0.286l-557.712-100.44a17.915 17.915 0 0 1 6.35-35.256l548.361 98.76 227.19-232.73a17.92 17.92 0 0 1 25.641 25.022l-233.83 239.529a17.925 17.925 0 0 1-12.826 5.401z" fill="" p-id="21022"></path><path d="M672.855 774.467c-1.1 0-2.207-0.103-3.313-0.313L111.831 669.19a17.91 17.91 0 1 1 6.625-35.205l547.738 103.091L891.213 483.4a17.91 17.91 0 0 1 26.798 23.777L686.259 768.445a17.92 17.92 0 0 1-13.404 6.022z" fill="" p-id="21023"></path><path d="M301.046 886.994a17.915 17.915 0 0 1-17.91-17.91V321.562a17.913 17.913 0 0 1 7.23-14.377L574.197 96.307a17.92 17.92 0 0 1 21.36 28.76l-276.602 205.5v538.517a17.91 17.91 0 0 1-17.91 17.91z" fill="" p-id="21024"></path><path d="M486.953 923.5a17.915 17.915 0 0 1-17.91-17.91V353.53a17.903 17.903 0 0 1 7.127-14.3l283.827-214.072a17.915 17.915 0 0 1 21.571 28.606L504.863 362.46v543.13a17.915 17.915 0 0 1-17.91 17.91z" fill="" p-id="21025"></path><path d="M757.555 858.21a17.915 17.915 0 0 1-17.91-17.91V320.24l-533.063-81.843a17.91 17.91 0 1 1 5.437-35.41l548.255 84.173a17.91 17.91 0 0 1 15.191 17.705v535.43a17.91 17.91 0 0 1-17.91 17.914z" fill="" p-id="21026"></path><path d="M832.307 768.384a17.915 17.915 0 0 1-17.91-17.91V249.042L301.373 169a17.91 17.91 0 0 1-14.935-20.46 17.894 17.894 0 0 1 20.46-14.935l528.174 82.407a17.915 17.915 0 0 1 15.15 17.695v516.761a17.92 17.92 0 0 1-17.915 17.915z" fill="" p-id="21027"></path></svg>
  details: 通过diff算法的学习了解到的LIS算法
  link: /algorithm/LIS
---
<script setup>
      import { useRoute } from "vitepress";
      import { onMounted } from "vue";

      const { path } = useRoute();
      onMounted(() => {
        if(path === '/algorithm/' || path === '/algorithm/index.html') {
          document.documentElement.style.setProperty('--c-orange', '\#ff7707');
          document.documentElement.style.setProperty('--c-orange-dark', '#ff7707');
          document.documentElement.style.setProperty('--c-orange-light', '\#f68b32');
          document.documentElement.style.setProperty('--vp-home-hero-name-background', '-webkit-linear-gradient(120deg, #ff7707 30%, #809aff)');
          document.documentElement.style.setProperty('--vp-home-hero-image-background-image', 'linear-gradient(-45deg, #ff7707 50%, #809aff 50%);');
          document.documentElement.style.setProperty('--vp-home-hero-image-filter', 'blur(72px)');
          document.documentElement.style.setProperty('--vp-button-brand-border', 'var(--c-orange-light)');
          document.documentElement.style.setProperty('--vp-button-brand-text', '#FFF');
          document.documentElement.style.setProperty('--vp-button-brand-bg', 'var(--c-orange)');
          document.documentElement.style.setProperty('--vp-button-brand-hover-border', 'var(--c-orange-light)');
          document.documentElement.style.setProperty('--vp-button-brand-hover-text', '#FFF');
          document.documentElement.style.setProperty('--vp-button-brand-hover-bg', 'var(--c-orange-light)');
          document.documentElement.style.setProperty('--vp-button-brand-active-border', 'var(--c-orange-light)');
          document.documentElement.style.setProperty('--vp-button-brand-active-text', '#FFF');
          document.documentElement.style.setProperty('--vp-button-brand-active-bg', 'var(--vp-button-brand-bg)');
          document.documentElement.style.setProperty('--vp-c-brand', 'var(--c-orange)');
          document.documentElement.style.setProperty('--vp-home-hero-name-color', 'transparent');
        }
      });
</script>


