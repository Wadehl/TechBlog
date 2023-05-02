import {defineConfig} from 'vitepress';
import {withMermaid} from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
    defineConfig({
        title: "Kevin's TechBlog",
        // description: "Kevin's TechBlog",
        lang: 'zh-CN',
        outDir: './docs',
        themeConfig: {
            // https://vitepress.dev/reference/default-theme-config
            logo: '/logo.png',
            nav: [
                {text: 'Home', link: '/'},
                {
                    text: 'Build',
                    link: '/projects/'
                },
                {
                    text: 'Dev',
                    items: [
                        {
                            text: '前端',
                            items: [
                                {text: 'JavaScript', link: '/javaScript/'},
                                {text: 'Vue', link: '/vue/'},
                                {text: '杂七杂八🥘', link: '/front/'}
                                // {text: 'TypeScript', link: '/ts/'},
                                // {text: 'React', link: '/react/'}
                            ]
                        },
                        {
                            text: '后端',
                            items: [
                                {text: 'Python-Web', link: '/python/'},
                                {text: 'Go-Web', link: '/go/'}
                            ]
                        }
                    ]
                },
                {
                    text: 'Preload',
                    items: [
                        {text: '计网', link: '/web/'},
                        {text: '算法', link: '/algorithm/'}
                    ]
                },
                {text: 'DaysWithVenki💖', link: 'https://dayswithvenki.top'}
            ],

            sidebar: [
                {
                    text: '前端',
                    collapsed: true,
                    items: [
                        {
                            text: 'JavaScript手写系列',
                            collapsed: true,
                            items: [
                                {
                                    text: 'Ajax',
                                    link: '/JavaScript/AJAX'
                                },
                                {
                                    text: '柯里化',
                                    link: '/JavaScript/curried'
                                },
                                {
                                    text: '防抖与节流',
                                    link: '/JavaScript/debounce&throttle'
                                },
                                {
                                    text: 'Array, Object扁平化',
                                    link: '/JavaScript/flattern'
                                },
                                {
                                    text: 'instanceof',
                                    link: '/JavaScript/instanceof'
                                }
                            ]
                        },
                        {text: 'TypeScript', link: '/Typescript/'},
                        {
                            text: 'Vue',
                            collapsed: true,
                            items: [
                                {
                                    text: 'Vue2双向绑定',
                                    link: '/Vue/vue2-easy-binding'
                                },
                                {
                                    text: 'vDOM与diff',
                                    link: '/Vue/vue-vDom'
                                }
                            ]
                        },
                        {
                            text: '杂七杂八🥘',
                            collapsed: true,
                            items: [
                                {
                                    text: '前端权限认证方式',
                                    link: '/Front/前端权限认证方式'
                                },
                                {
                                    text: '浏览器渲染过程',
                                    link: '/Front/浏览器渲染过程'
                                },
                                {
                                    text: '前端性能优化',
                                    link: '/Front/前端性能优化'
                                },
                                {
                                    text: '前端性能优化——实战',
                                    link: '/Front/前端性能优化——实战'
                                }
                            ]
                        }
                    ]
                },
                {
                    text: '后端',
                    collapsed: true,
                    items: [
                        {
                            text: 'Go',
                            collapsed: true,
                            items: []
                        },
                        {
                            text: 'Python',
                            collapsed: true,
                            items: []
                        }
                    ]
                },
                {
                    text: '基础知识',
                    collapsed: true,
                    items: [
                        {
                            text: '计网',
                            collapsed: true,
                            items: [
                                {text: 'CDN', link: '/Web/CDN'},
                                {text: 'HTTP版本差异', link: '/Web/HTTP版本差异'},
                                {text: 'HTTP相关', link: '/Web/HTTP相关'},
                                {text: 'HTTP缓存', link: '/Web/HTTP缓存'},
                                {text: 'WebSocket', link: '/Web/WebSocket'},
                                {text: '网络安全', link: '/Web/网络安全'},
                            ]
                        },
                        {
                            text: '算法',
                            collapsed: true,
                            items: []
                        }
                    ]
                },
            ],

            socialLinks: [
                {icon: 'github', link: 'https://github.com/Wadehl'},
                {
                    icon: {svg: '<svg t="1682565025727" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2748" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="2749"></path></svg>'},
                    link: 'https://gitee.com/Wadehl'
                }
            ]
        }
    })
)

