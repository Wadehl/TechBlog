import DefaultTheme from 'vitepress/theme';

// 进度条
import vitepressNprogress from 'vitepress-plugin-nprogress';
import 'vitepress-plugin-nprogress/lib/css/index.css';

import { EnhanceAppContext } from 'vitepress';

// sandBox
import { Sandbox } from 'vitepress-plugin-sandpack';

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('Sandbox', Sandbox);
    vitepressNprogress(ctx);
  },
};
