import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

import container from 'markdown-it-container';
import { renderSandbox } from 'vitepress-plugin-sandpack';

import mdItCustomAttrs from 'markdown-it-custom-attrs';
import { replaceImagePath } from '../lib';

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "Kevin's TechBlog",
    // description: "Kevin's TechBlog",
    lang: 'zh-CN',
    outDir: './docs',
    head: [
      ['link', { rel: 'icon', href: '/logo.png' }],
      ['link', { rel: 'stylesheet', href: '/fancybox/fancybox.css' }],
      // Defer fancybox script loading to avoid SSR issues
      ['script', {src: '/fancybox/fancybox.umd.js', defer: ''}],
    ],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: '/logo.png',
      nav: [
        { text: 'Home', link: '/' },
        {
          text: 'Build',
          link: '/projects/',
        },
        {
          text: 'Dev',
          items: [
            {
              text: '前端',
              items: [
                { text: 'javascript', link: '/javascript/' },
                { text: 'vue', link: '/vue/' },
                { text: '杂七杂八🥘', link: '/front/' },
                // {text: 'TypeScript', link: '/ts/'},
                // {text: 'react', link: '/react/'}
              ],
            },
            // {
            //   text: '后端',
            //   items: [
            //     { text: 'python-Web', link: '/python/' },
            //     { text: 'go-Web', link: '/go/' },
            //   ],
            // },
            {
              text: 'LLM & AI Agent',
              items: [
                { text: 'LLM & AI Agent', link: '/ai/' },
              ],
            },
          ],
        },
        {
          text: 'Preload',
          items: [
            { text: '计网', link: '/webs/' },
            { text: '算法', link: '/algorithm/' },
          ],
        },
        { text: 'DaysWithVenki💖', link: 'https://dayswithvenki.top' },
      ],

      sidebar: [
        {
          text: '前端',
          collapsed: true,
          items: [
            {
              text: 'JavaScript基础',
              collapsed: true,
              items: [
                {
                  text: 'var,let,const',
                  link: '/javascript/var,let,const',
                },
                {
                  text: 'this',
                  link: '/javascript/this',
                },
                {
                  text: '闭包',
                  link: '/javascript/闭包',
                },
                {
                  text: '垃圾回收机制GC',
                  link: '/javascript/垃圾回收机制',
                },
              ],
            },
            {
              text: 'JavaScript手写系列',
              collapsed: true,
              items: [
                {
                  text: 'Ajax',
                  link: '/javascript/AJAX',
                },
                {
                  text: 'Promise',
                  link: '/javascript/Promise',
                },
                {
                  text: 'Promise并发调度',
                  link: '/javascript/Promise并发调度',
                },
                {
                  text: '柯里化',
                  link: '/javascript/curried',
                },
                {
                  text: '防抖与节流',
                  link: '/javascript/debounce&throttle',
                },
                {
                  text: '图片懒加载',
                  link: '/javascript/lazyload',
                },
                {
                  text: 'Array, Object扁平化',
                  link: '/javascript/flattern',
                },
                {
                  text: 'instanceof',
                  link: '/javascript/instanceof',
                },
                {
                  text: '有时间限制的缓存',
                  link: '/javascript/有时间限制的缓存',
                },
                {
                  text: 'LazyMan',
                  link: '/javascript/LazyMan',
                },
              ],
            },
            { text: 'TypeScript', link: '/typescript/' },
            {
              text: 'vue',
              collapsed: true,
              items: [
                {
                  text: 'Vue3 diff算法详解',
                  link: '/vue/vue-diff',
                },
                {
                  text: 'Vue3响应式系统',
                  link: '/vue/vue3-reactivity',
                },
                {
                  text: 'Vue2双向绑定',
                  link: '/vue/vue2-easy-binding',
                },
                {
                  text: 'vDOM与diff',
                  link: '/vue/vue-vDom',
                },
              ],
            },
            {
              text: '杂七杂八🥘',
              collapsed: true,
              items: [
                {
                  text: '在线客服消息列表渲染',
                  link: '/front/cs-message-list',
                },
                {
                  text: 'Vue CLI 项目提速：Rspack vs Vite',
                  link: '/front/vue-cli-rspack-vite-migration',
                },
                {
                  text: '深入 Immer：Patches 与状态管理',
                  link: '/front/immer-patches',
                },
                {
                  text: '滚动抽奖组件',
                  link: '/front/lottery-scroll',
                },
                {
                  text: '多语言本地化平台性能优化',
                  link: '/front/i18n-platform-performance',
                },
                {
                  text: '前端权限认证方式',
                  link: '/front/前端权限认证方式',
                },
                {
                  text: '浏览器渲染过程',
                  link: '/front/浏览器渲染过程',
                },
                {
                  text: '前端性能优化',
                  link: '/front/前端性能优化',
                },
                {
                  text: '前端性能优化 New',
                  link: '/front/前端性能优化 New',
                },
                {
                  text: '前端性能优化——实战',
                  link: '/front/前端性能优化——实战',
                },
              ],
            },
          ],
        },
        // {
        //   text: '后端',
        //   collapsed: true,
        //   items: [
        //     {
        //       text: 'go',
        //       collapsed: true,
        //       items: [],
        //     },
        //     {
        //       text: 'python',
        //       collapsed: true,
        //       items: [
        //         {
        //           text: 'Python爬虫',
        //           collapsed: true,
        //           items: [
        //             {
        //               text: '基础知识',
        //               link: '/python/crawler/Python1',
        //             },
        //             {
        //               text: 'Request库的使用',
        //               link: '/python/crawler/Python2',
        //             },
        //             {
        //               text: '数据解析',
        //               link: '/python/crawler/Python3',
        //             },
        //             {
        //               text: 'Re模块',
        //               link: '/python/crawler/Python4',
        //             },
        //             {
        //               text: 'Bs模块',
        //               link: '/python/crawler/Python5',
        //             },
        //             {
        //               text: 'Xpath模块',
        //               link: '/python/crawler/Python6',
        //             },
        //             {
        //               text: '爬虫实战',
        //               link: '/python/crawler/Python7',
        //             },
        //             {
        //               text: 'Python多线程',
        //               link: '/python/crawler/Python8',
        //             },
        //           ],
        //         },
        //         {
        //           text: 'Django',
        //           collapsed: true,
        //           items: [],
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          text: 'LLM & AI Agent',
          collapsed: true,
          items: [
            {
              text: 'Codex Subagent',
              link: '/ai/codex-subagent',
            },
            {
              text: '浏览器自动化测试最佳实践',
              link: '/ai/browser-use',
            },
            {
              text: 'AI 赋能爬虫',
              link: '/ai/ai-crawler',
            },
            {
              text: 'TypeScript 与 MCP 工程化',
              link: '/ai/typescript-mcp',
            },
          ],
        },
        {
          text: '基础知识',
          collapsed: true,
          items: [
            {
              text: '计网',
              collapsed: true,
              items: [
                { text: 'CDN', link: '/webs/CDN' },
                { text: 'HTTP版本差异', link: '/webs/HTTP版本差异' },
                { text: 'HTTP相关', link: '/webs/HTTP相关' },
                { text: 'HTTP缓存', link: '/webs/HTTP缓存' },
                { text: 'WebSocket', link: '/webs/WebSocket' },
                { text: '网络安全', link: '/webs/网络安全' },
              ],
            },
            {
              text: '算法',
              collapsed: true,
              items: [{ text: 'LIS', link: '/algorithm/LIS' }],
            },
          ],
        },
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/Wadehl' },
        {
          icon: {
            svg: '<svg t="1682565025727" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2748" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="2749"></path></svg>',
          },
          link: 'https://gitee.com/Wadehl',
        },
      ],

      search: {
        provider: 'algolia',
        options: {
          appId: '1BAFNJ6EKW',
          apiKey: '39ce531d0df9398734ef70ad4e765558',
          indexName: 'tech-dayswithvenki',
          placeholder: '请输入搜索内容',
          initialQuery: 'JS',
        },
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2022-present Kevin Kwok',
      },
    },

    vite: {
      css: {
        modules: {
          localsConvention: 'camelCase',
        },
      },
    },

    markdown: {
      config(md) {
        md
          // the second parameter is html tag name
          .use(container, 'sandbox', {
            render(tokens, idx) {
              return renderSandbox(tokens, idx, 'sandbox');
            },
          })
          .use(replaceImagePath)
          .use(mdItCustomAttrs, 'image', {
            'data-fancybox': 'gallery',
          });
      },
    },
  })
);
