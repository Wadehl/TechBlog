# Vue CLI 项目提速：Rspack vs Vite 迁移方案对比

> 项目背景: 基于开源库二次开发的 Vue CLI 3.5.3 + Webpack 4 + Vue 2.7 老旧项目，代码及依赖版本落后，构建机器使用 Node 14，开发和构建速度极慢，严重影响日常开发体验。
> 
> 
> **Rspack 简介**: 基于 Rust 开发的 JS 打包工具，覆盖 Webpack 绝大多数 API 和功能，Webpack loader 基本支持。[官方介绍](https://rspack.rs/zh/guide/start/introduction)
> 

## 🎯 迁移结果总结

**Rspack 迁移：✅ 完全成功**

1. **性能提升巨大**：开发构建快5-6倍，生产构建快17倍+
2. **迁移成本极低**：配置语法与 Webpack 高度兼容，几乎零学习成本
3. **稳定可靠**：开发和生产环境均正常运行，无兼容性问题
4. **未来导向**：基于 Rust 的现代构建工具，性能和生态持续优化

**Vite 迁移：❌ 运行时错误**
- 构建可以成功，但运行时出现 `Uncaught ReferenceError: Cannot access 'xxx' before initialization`
- 主要原因：某些依赖存在循环引用，ESM 模块系统暴露了这些问题
- 需要手动迁移 CommonJS 或使用插件支持，工作量巨大

## 🛠️ Rspack 迁移详细实践

> 参考文档: Rsbuild 官方 Vue CLI 迁移指南
> 

### 原项目技术栈（老旧）

```json
{
  "vue": "^2.7.15",
  "@vue/cli-service": "3.5.3",
  "webpack": "4.x (通过 Vue CLI)",
  "element-ui": "2.15.14",
  "echarts": "^4.8.0",
  "monaco-editor": "^0.20.0",
  "node": "14.x (构建机器限制)"
}
```

**项目特点**：
- 基于开源库二次开发，依赖版本较老
- 192 个安全漏洞警告
- 需要 `--openssl-legacy-provider` 才能构建
- 开发服务器启动需要 24+ 秒
- 生产构建需要 90+ 秒

### 迁移核心步骤

### 1. 依赖包调整

```bash
# 移除 Vue CLI 相关依赖
npm remove @vue/cli-service @vue/cli-plugin-* webpack webpack-*

# 安装 Rsbuild 相关依赖
pnpm add -D @rsbuild/core @rsbuild/plugin-vue2 @rsbuild/plugin-sass @rsbuild/plugin-node-polyfill @rsbuild/plugin-basic-ssl
```

### 2. 配置文件迁移

**从 `vue.config.js` 迁移到 `rsbuild.config.mjs`**

**原 vue.config.js 核心配置：**

```javascript
module.exports = {
  outputDir: 'web',
  assetsDir: 'static/web',
  devServer: {
    port: 9527,
    https: true
  },
  configureWebpack: {
    plugins: [
      new MonacoEditorWebpackPlugin()
    ]
  }
}
```

**新 rsbuild.config.mjs 配置：**

```javascript
export default defineConfig({
  plugins: [
    pluginVue2(),
    pluginSass(),
    pluginNodePolyfill(),
    pluginBasicSsl()
  ],
  output: {
    distPath: {
      root: 'web',
      js: 'static/web/js',
      css: 'static/web/css',
      assets: 'static/web'
    }
  },
  server: {
    port: 9527
  }
})
```

### 3. SVG 图标处理调整

**原 Webpack 配置 (vue.config.js)：**

```javascript
chainWebpack: config => {
  config.module
    .rule('svg')
    .exclude.add(resolve('src/icons'))
    .end()
  config.module
    .rule('icons')
    .test(/\.svg$/)
    .include.add(resolve('src/icons'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
}
```

**新 Rspack 配置 (rsbuild.config.mjs)：**

```javascript
tools: {
  rspack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          include: path.resolve(__dirname, 'src/icons/svg'),
          type: 'asset/source'  // 使用 Rspack 内置的资源处理
        }
      ]
    }
  }
}
```

### 4. 环境变量处理

**Rspack 环境变量配置：**

```javascript
tools: {
  rspack: {
    plugins: [
      new (require('@rspack/core')).EnvironmentPlugin({
        NODE_ENV: 'development',
        VUE_APP_BASE_API: '//orionapi.37mobi.com'
      })
    ]
  }
}
```

### 5. package.json 脚本调整

**原 Vue CLI 脚本：**

```json
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "build:prod": "vue-cli-service build --mode production"
  }
}
```

**新 Rsbuild 脚本：**

```json
{
  "scripts": {
    "dev": "rsbuild dev --mode development",
    "build:prod": "rsbuild build --mode production"
  }
}
```

### 迁移中遇到的问题与解决方案

### 1. 依赖兼容性问题

**问题**: 某些 Webpack 专用 loader 不兼容

**解决**: 使用 Rspack 内置功能替代

- `svg-sprite-loader` → `type: 'asset/source'`
- `monaco-editor-webpack-plugin` → Rspack 自动处理

### 2. 构建产物结构保持一致

**要求**: 保持与原 Webpack 相同的输出目录结构

**解决**: 通过 `output.distPath` 精确配置

```javascript
output: {
  distPath: {
    root: 'web',           // 对应原 outputDir
    js: 'static/web/js',   // 对应原 assetsDir + '/js'
    css: 'static/web/css',
    assets: 'static/web'
  }
}
```

### 3. Monaco Editor 集成

**原方案**: 使用 `monaco-editor-webpack-plugin`

**新方案**: Rspack 原生支持，无需额外插件

### 4. Node.js Polyfills

**问题**: Vue CLI 自动提供 Node.js polyfills

**解决**: 添加 `@rsbuild/plugin-node-polyfill`

## 📊 性能对比数据

### 开发服务器冷启动性能

| 构建工具 | 构建时间 | 性能提升 | 状态 |
| --- | --- | --- | --- |
| **Vue CLI (Webpack v4)** | **~24 秒** | 基准 | ✅ 成功但慢 |
| **Rspack** | **3.8-4.6 秒** | **5-6x 快** | ✅ 成功且快 |
| **Vite** | **1.464 秒** | **16x 快** | ✅ 成功 |

### 生产构建性能

| 构建工具 | 构建时间 | 性能提升 | 状态 |
| --- | --- | --- | --- |
| **Vue CLI (Webpack v4)** | **~90+ 秒** | 基准 | ⚠️ 需要 `--openssl-legacy-provider` |
| **Rspack** | **5.18 秒** | **17x+ 快** | ✅ 构建成功 |
| **Vite** | **~30 秒** | **3x 快** | ⚠️ **构建成功但运行时错误，可以解决但成本高** |

### HMR (热更新) 性能

- **Vue CLI (Webpack)**：较慢，需要重新编译模块和依赖
- **Rspack**：快速响应，接近 Vite 的即时更新体验
- **Vite**：最快，基于 ESM 的瞬时更新

## 🔧 迁移成本分析

### Rspack 迁移成本：⭐⭐ (极低)

**优势：**
- 📝 配置文件几乎完全兼容 Webpack
- 🔧 大部分 Webpack 插件可直接使用
- 📈 渐进式迁移，可与现有工具链共存
- 📚 学习曲线平缓，团队无需重新培训

**主要变更：**

```javascript
// 从 vue.config.js 迁移到 rsbuild.config.mjs
export default defineConfig({
  plugins: [
    pluginVue2(),           // 替代 vue-loader 配置
    pluginSass(),           // 替代 sass-loader 配置
    pluginNodePolyfill()    // Node.js polyfills
  ],
  // 其他配置项基本保持一致
  server: { port: 9527 },
  output: { distPath: { root: 'web' } }
})
```

**依赖变更：**

```json
{
  "devDependencies": {
    // 新增
    "@rsbuild/core": "^1.4.15",
    "@rsbuild/plugin-vue2": "^1.0.4",
    "@rsbuild/plugin-sass": "^1.3.5",
    // 移除 (大部分webpack相关)
    // "webpack", "webpack-dev-server", "babel-loader",
    // "css-loader", "style-loader" 等
  }
}
```

### Vite 迁移成本：⭐⭐⭐⭐⭐ (很高)

**运行时错误问题：**

```bash
✅ 构建可以成功
❌ 运行时错误：Uncaught ReferenceError: Cannot access 'Ki' before initialization
```

**核心问题分析：**
1. **循环引用暴露**: Vite 的 ESM 模块系统会暴露依赖间的循环引用问题
2. **模块加载顺序**: 某些第三方库在 ESM 环境下的初始化顺序出现问题
3. **CommonJS 兼容性**: 需要大量手动迁移 CommonJS 模块

**挑战：**
- 🔄 需要重写整个构建配置
- ⚡ 处理 CommonJS/ESM 兼容性问题

- 🐛 解决依赖包循环引用（element-ui、echarts 等）
- 🏗️ 可能需要调整代码结构和导入方式
- 📦 处理大量第三方库的兼容性问题
- 🔧 运行时错误修复工作量巨大

**依赖变更：**

```json
{
  "devDependencies": {
    // 新增
    "vite": "^4.5.14",
    "@vitejs/plugin-vue2": "^2.3.3",
    "vite-plugin-svg-icons": "^2.0.1",
    // 需要解决的冲突
    "@vueuse/core": "10.11.1",  // 与 vue-demi 冲突
    "monaco-editor": "^0.52.2"  // 版本兼容性问题
  }
}
```

## 🏗️ 技术债务和维护性

### Vue CLI (Webpack v4) - 现状

```bash
❌ 192 个安全漏洞
❌ Node.js 兼容性问题 (需要 --openssl-legacy-provider)
❌ 构建性能差，影响开发效率
❌ 社区支持逐渐减少，技术栈老旧
```

### Rspack - 推荐方案

```bash
✅ 现代构建工具，活跃维护
✅ 与 Webpack 生态完全兼容
✅ 性能优异，基于 Rust 实现
```

### Vite - 未来可考虑

```bash
✅ 性能最佳，社区活跃
✅ 优秀的开发体验
❌ 需要大量时间解决依赖冲突
```

## 🚀 生产环境稳定性对比

### Master 分支 (Webpack v4)

```
构建产物：✅ 成功但体积大
总体积：~60+ MB
主要文件：chunk-libs.b7a3fb3e.js (5.29 MB)
构建警告：❌ 大量资源过大告警
兼容性：⚠️ 需要特殊 Node.js 配置
```

### Rspack 分支

```
构建产物：✅ 成功，结构优化
构建时间：✅ 5.18s 极快
文件分割：✅ 合理的代码分割策略
性能优化：✅ 自动优化，无警告
兼容性：✅ 开箱即用
```

### Vite 分支

```
构建产物：✅ 构建成功
运行时状态：❌ Cannot access 'xxx' before initialization
根本原因：❌ 循环引用和模块加载顺序问题
生产可用性：❌ 无法正常运行
风险评估：❌ 高风险，需要大量依赖重构工作
```

## 📈 具体性能测试结果

### 测试环境

```
Node.js: 16.20.2
操作系统: macOS (Darwin 24.6.0)
包管理器: pnpm v10.14.0
测试方式: 冷启动到服务可用状态
```

### 开发模式性能详情

**Vue CLI (Webpack v4)**

```bash
$ time npm run dev
# 启动时间: 24.568 seconds
# 状态: 需要解决依赖问题才能正常启动
# HMR: 慢，需要重新编译大量模块
```

**Rspack**

```bash
$ pnpm run dev
# 构建时间: built in 3.8-4.6s
# 状态: 开箱即用，无额外配置
# HMR: 快速响应，增量编译
```

**Vite**

```bash
$ pnpm run dev
# 构建时间: ready in 1464ms
# 状态: 开发正常，依赖预构建
# HMR: 极快，基于 ESM
```

### 生产构建详情

**Vue CLI (Webpack v4)**

```bash
NODE_OPTIONS="--openssl-legacy-provider" npm run build:prod
# 构建时间: ~90+ seconds
# 产物大小: 60+ MB
# 警告: 大量体积过大警告
```

**Rspack**

```bash
$ pnpm run build:prod
# 构建时间: 5.18 seconds
# 产物优化: 智能代码分割
# 状态: 完全成功，无警告
```

**Vite**

```bash
$ pnpm run build:prod
# 构建时间: ~30 seconds
# 构建状态: ✅ 成功生成产物
# 运行时状态: ❌ ReferenceError: Cannot access 'xxx' before initialization
# 问题原因: 循环引用和模块初始化顺序
```

## 💼 Vue CLI 项目迁移建议

### 适用场景

本迁移实践特别适合以下场景：
- 基于Vue CLI 3.x + Webpack 4 的历史项目
- Element UI、ECharts 等传统 Vue 2 生态
- 需要保持现有构建产物结构的项目
- 团队对 Webpack 生态熟悉，希望低风险迁移

### Rspack 迁移的核心优势

### 1. 几乎零学习成本

- 配置文件语法与 Webpack 高度相似
- 大部分配置可以直接移植
- 团队无需重新学习构建工具

### 2. 渐进式迁移策略

```bash
# 第一步：基础迁移（1天）
- 安装 Rsbuild 依赖
- 创建基础配置文件
- 验证开发环境运行

# 第二步：功能完善（1-2天）
- 迁移所有 Webpack 配置
- 处理 SVG、Monaco Editor 等特殊需求
- 验证生产构建

# 第三步：部署验证（半天）
- 更新 CI/CD 配置
- 生产环境部署测试
```

### 3. 性能收益立竿见影

- **开发效率提升**: 构建时间从 24 秒降到 4 秒
- **部署效率提升**: 生产构建从 90+ 秒降到 5 秒
- **开发体验改善**: HMR 响应速度显著提升

### 具体迁移检查清单

**✅ 配置迁移**
- [ ] 安装 @rsbuild/* 相关包
- [ ] 创建 rsbuild.config.mjs
- [ ] 迁移 output 配置保持目录结构
- [ ] 配置开发服务器（端口、HTTPS等）

**✅ 功能验证**
- [ ] SVG 图标正常显示
- [ ] Monaco Editor 正常工作

- [ ] SASS/SCSS 编译正常
- [ ] 环境变量注入正确
- [ ] 代码分割策略有效

**✅ 生产验证**
- [ ] 生产构建成功
- [ ] 构建产物结构正确
- [ ] 资源文件路径正确
- [ ] 功能页面正常访问

### 对比其他方案

**vs 继续使用 Vue CLI (Webpack 4)**
- ❌ 性能差，192个安全漏洞
- ❌ Node.js 兼容性问题
- ❌ 社区支持逐渐减少

**vs Vite 迁移**
- ❌ 需要解决大量依赖冲突
- ❌ 生产构建失败风险
- ❌ 可能需要重构代码结构
- ⏳ 适合后续 Vue 3 迁移时考虑

### 长期技术债务解决

通过 Rspack 迁移，项目获得：
1. **现代化构建工具链**，告别 Webpack 4 的历史包袱
2. **持续的性能优化**，基于 Rust 的构建引擎持续进化
3. **更好的开发体验**，为后续技术升级打下基础
4. **生产环境稳定性**，解决 Node.js 兼容性等问题

## 📝 总结

基于全面的性能测试和技术分析，**Rspack 是目前最佳的迁移选择**：

- 🚀 **性能卓越**：全面超越现有方案
- 🛡️ **风险极低**：兼容性好，迁移简单
- 🏭 **生产就绪**：稳定可靠，现在就能用
- 🔮 **面向未来**：现代化技术栈，长期受益

而 Vite 虽然开发体验优秀，但当前的兼容性问题使其不适合立即迁移，建议在解决依赖冲突或后续 Vue 3 迁移时再考虑。