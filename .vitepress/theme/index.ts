import DefaultTheme from 'vitepress/theme';

// 进度条
import vitepressNprogress from 'vitepress-plugin-nprogress';
import 'vitepress-plugin-nprogress/lib/css/index.css';

// giscus评论
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
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
