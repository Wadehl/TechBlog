import DefaultTheme from 'vitepress/theme';

// 进度条
import vitepressNprogress from 'vitepress-plugin-nprogress';
import 'vitepress-plugin-nprogress/lib/css/index.css';

// giscus评论
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { EnhanceAppContext, useData, useRoute } from 'vitepress';

// imgViewer
import 'viewerjs/dist/viewer.min.css';

// sandBox
import { Sandbox } from 'vitepress-plugin-sandpack';

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('Sandbox', Sandbox);
    vitepressNprogress(ctx);
  },
  setup() {
    const { frontmatter } = useData();
    const route = useRoute();

    // Obtain configuration from: https://giscus.app/
    giscusTalk(
      {
        repo: 'Wadehl/TechBlog',
        repoId: 'R_kgDOJd47Jg',
        category: 'Announcements', // default: `General`
        categoryId: 'DIC_kwDOJd47Js4CZJKQ',
        mapping: 'pathname', // default: `pathname`
        inputPosition: 'top', // default: `top`
        lang: 'zh-CN', // default: `zh-CN`
        loading: 'lazy',
      },
      {
        frontmatter,
        route,
      }
    );
  },
};
