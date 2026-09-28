---
title: TypeScript 在 Cursor AI MCP 服务中的工程化实践
date: 2025-03-10
description: 用 TypeScript 把 MCP 服务做成可维护的工程，而不是一堆临时脚本。
outline: deep
---

# TypeScript 在 Cursor AI MCP 服务中的工程化实践

> 写于 2025-03-10

## 一、引言

### MCP (模型上下文协议)是什么

> The Model Context Protocol allows applications to provide context for LLMs in a standardized way, separating the concerns of providing context from the actual LLM interaction.

模型上下文协议允许应用程序以标准化的方式为LLM提供上下文，从而将提供上下文的任务与实际的LLM交互分离开来。

## 二、问题背景

在使用 **Cursor AI** 调用 **MCP（Managed Code Protocol）** 服务时，开发者可能会遇到以下痛点：

1. 官方 SDK 示例无法直接适配 Cursor AI

2. 重复性 MCP 代码开发

- 每个 MCP 服务都需要编写相似的 **协议解析、错误处理、日志记录** 等基础代码，增加了维护成本。
- 缺乏统一的工程化方案，不同 MCP 服务的代码风格和架构可能不一致，影响团队协作。

## 三、问题分析

1. 官方 SDK 与 Cursor AI 的适配问题

主要原因在于一些核心的配置项如果缺失配置的话，CursorAI只会告诉你Client Closed，并不会告知关闭的原因，可能每次都要排查类似的问题。而这些核心配置项在官方SDK文档的位置也比较后面，对于初次开发的人员来说要定位问题比较麻烦。

2. 重复性 MCP 代码开发  
（1）每个 MCP 服务需独立实现协议解析、错误处理等基础逻辑。    
（2）代码冗余，维护困难，且容易引入不一致性。

## 四、解决方案

 对MCP SDK进行工程化封装，提供统一入口和基础模板。首个工具验证通过后，后续工具可复用相同模式快速接入，确保架构统一性。

## 五、实施过程-开发一个独立的MCP

### 第一步 安装核心的SDK与第三方库

```js
// package.json
{
  // 仅保留核心部分
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.6.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^22.13.9",
    "typescript": "^5.8.2"
  }
}
```

`@modelcontextprotocol/sdk`

MCP官方TypeScript SDK，用于搭建MCP的服务器与客户端

Github地址：<https://github.com/modelcontextprotocol/typescript-sdk>

```bash
npm install @modelcontextprotocol/sdk
```

**作用**：

- 提供MCP（Model Context Protocol）的核心功能
- 包含服务器创建、通信协议和类型定义
- 提供与LLM通信的标准接口

**主要组件**：

- Server：创建MCP服务实例
- StdioServerTransport：基于标准输入/输出的通信传输层
- CallToolRequestSchema：处理工具调用的请求模式
- ListToolsRequestSchema：处理工具列表查询的请求模式

**示例用法：**

```go
 import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
```

  

`zod`

```bash
npm install zod
```

**作用**：

- 提供TypeScript优先的数据验证库
- 用于定义和验证工具输入参数的结构
- 提供丰富的验证规则和错误处理

**主要功能**：

- 类型定义与验证
- 自动类型推断
- 错误处理与格式化
- 模式组合与转换

**示例用法：**

```ts
 import { z } from "zod";

const UserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  role: z.enum(["admin", "user", "guest"]).default("user"),
});

// 验证数据
try {
  const userData = UserSchema.parse({
    username: "zhang",
    email: "zhang@example.com",
    age: 30
  });
  // userData 类型已被推断为 { username: string; email: string; age?: number; role: "admin" | "user" | "guest" }
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("验证错误:", error.errors);
  }
}
```

### 第二步 通过SDK创建Server示例

```ts
 const server = new Server(
  {
    name: "your-service-name",  // 服务名称
    version: "1.0.0",           // 服务版本
  },
  {
    capabilities: {
      tools: {} // 启用工具功能，必须
    }
  }
);
```

### 第三步 通过ZOD定义你期望的输入参数

```ts
 const YourToolArgumentsSchema = z.object({
  param1: z.string().describe("参数1的描述"),
  param2: z.number().optional().describe("可选参数2的描述"),
  param3: z.enum(["option1", "option2"]).describe("枚举参数的描述"),
  param4: z.boolean().default(false).describe("布尔参数的描述"),
});
```

### 第四步 定义支持的工具列表

```go
 server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "your_tool_name",  // 工具名称（使用下划线，cursor会默认转为下划线的调用）
        description: "工具的详细描述", // 工具描述
        // inputSchema是对第三步的Object补充
        inputSchema: {
          type: "object",
          properties: {
            param1: {
              type: "string",
              description: "参数1的描述",
            },
            param2: {
              type: "number",
              description: "参数2的描述",
            },
            param3: {
              type: "string",
              enum: ["option1", "option2"],
              description: "枚举参数的描述",
            },
          },
          required: ["param1", "param3"], // 必需参数列表
        },
      },
      // 可以定义多个工具
    ],
  };
});
```

**参数说明**：

- name：工具名称，使用下划线命名法（如your\_tool\_name）
- description：工具的详细描述，会展示给LLM
- inputSchema：输入参数的JSON Schema定义
- type：通常为"object"
- properties：定义各个参数的类型和描述
- 每个参数包含type和description
- 可以使用enum定义枚举值
- required：必需参数的名称数组

### 第五步 定义工具调用的处理逻辑

```ts
 server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  const toolName = name.replace(/_/g, '-'); // 将下划线转换为连字符
  // 由于cursor调用的时候会将事件名称改为 xxx_xxx 的下划线格式，我们这里的 === 需要注意
  // 为了避免定义的事件名与调用不一致导致的问题，一种可行的方法是将参数的 "_" 都转为 "-" 处理
  if (toolName === "your-tool-name") {
    try {
      // 1. 验证参数
      const { param1, param2, param3 } = YourToolArgumentsSchema.parse(args);
      
      // 2. 实现工具逻辑
      // ...执行具体操作...
      // 在这里调用你的自定义函数：fun1()
      
      // 3. 返回成功结果
      return {
        content: [
          {
            type: "text",
            text: "操作成功！\n结果: ...",
          },
          // 可以返回多种类型的内容
          {
            type: "image",
            url: "图片URL",
            alt: "图片描述"
          }
        ],
      };
    } catch (error) {
      // 4. 错误处理
      if (error instanceof z.ZodError) {
        // 参数验证错误
        throw new Error(
          `参数无效: ${error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      }
      // 其他错误
      throw new Error(`操作失败: ${error}`);
    }
  } else {
    // 未知工具
    throw new Error(`未知工具: ${name}`);
  }
});
```

### 第六步 开启MCP工具服务

目录结构如下：

```ts
 async function main() {
  // 1. 创建传输层
  const transport = new StdioServerTransport();
  
  // 2. 连接服务
  await server.connect(transport);
  
  // 3. 记录服务启动信息
  console.log("Your Service MCP Server running on stdio");
}

// 4. 启动服务并处理错误
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
```

## 六、实施过程-工程化MCP工具开发实践（stdio类型）

目标：开发一个主要处理将PSD文件中的图层按组的层次结构进行解析与导出，文字部分将会被清空的MCP，并处理为一个工程化MCP模板。

```go
your-mcp-service/
├── src/
│   ├── index.ts           # 主入口文件
│   ├── tools/             # 工具实现目录
│   │   ├── tool1.ts       # 工具1实现
│   │   └── tool2.ts       # 工具2实现
│   ├── schemas/           # 数据模式定义
│   │   └── input.ts       # 输入参数模式
│   ├── utils/             # 工具函数
│   │   ├── logger.ts      # 日志工具
│   │   └── helpers.ts     # 辅助函数
│   └── config.ts          # 配置文件
├── tests/                 # 测试目录
│   └── tools.test.ts      # 工具测试
├── .env                   # 环境变量
├── .gitignore             # Git忽略文件
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目说明
```

核心实现流程如下所示。

### 第一步 定义配置文件

**文件位置：**src/config.ts

```ts
 /**
 * 应用配置
 */

// 服务配置
export const SERVICE_CONFIG = {
  name: "mcp-tools",
  version: "1.0.0",
};

// 工具配置
export const TOOLS_CONFIG = {
  // PSD切片工具
  psdSlice: {
    name: "slice_psd",
    description: "Slice a PSD file into separate PNG layers",
  },
};

// 日志配置
export const LOG_CONFIG = {
  level: process.env.LOG_LEVEL || "INFO",
};

export default {
  SERVICE_CONFIG,
  TOOLS_CONFIG,
  LOG_CONFIG,
};
```

### 第二步 定义PSD切图工具的主要逻辑

**文件位置：**src/tools/psd-slice.ts

```ts
 import PSD from 'psd';
import fs from 'fs';
import path from 'path';

// 用于处理文件名中的非法字符
const sanitizeFileName = (name: string): string => {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
};

// 类型声明
interface PSDLayer {
  name: string;
  _children?: PSDLayer[];
  layer?: {
    image?: {
      saveAsPng: (path: string) => void;
    };
  };
  export: () => { text?: any };
}

// 递归处理PSD图层
export const parseChildren = (
  children: any[],
  outputDir: string,
  currentPath: string = ''
): PSDLayer[] => {
  const flatChildren: PSDLayer[] = [];

  for (const child of children) {
    const layerName = sanitizeFileName(child.name || 'unnamed');
    const currentLayerPath = currentPath ? `${currentPath}/${layerName}` : layerName;
    
    if (child._children && child._children.length > 0) {
      const groupDir = path.join(outputDir, currentLayerPath);
      if (!fs.existsSync(groupDir)) {
        fs.mkdirSync(groupDir, { recursive: true });
      }
      
      const innerChildren = parseChildren(child._children, outputDir, currentLayerPath);
      flatChildren.push(...innerChildren);
    } else {
      if (!child.export().text) {
        flatChildren.push(child);
        
        const layerDir = path.join(outputDir, currentPath);
        if (!fs.existsSync(layerDir)) {
          fs.mkdirSync(layerDir, { recursive: true });
        }
        
        const imagePath = path.join(outputDir, currentPath, `${layerName}.png`);
        
        try {
          child.layer?.image?.saveAsPng(imagePath);
          // console.log(`已保存图层: ${imagePath}`);
        } catch (err) {
          // console.error(`保存图层失败 ${layerName}:`, err);
        }
      }
    }
  }
  return flatChildren;
};

export async function slicePSD(inputPath: string, outputDir: string = path.join(process.cwd(), 'output')) {
  // 检查文件是否存在
  if (!fs.existsSync(inputPath)) {
    throw new Error(`文件不存在: ${inputPath}`);
  }

  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 解析PSD文件
  const psd = PSD.fromFile(inputPath);
  await psd.parse();

  const data = await psd.tree();
  const children = await data.children();

  // 保存预览图
  if (psd.image) {
    await psd.image.saveAsPng(path.join(outputDir, "preview.png"));
  }

  // 处理所有图层
  const flatChildren = parseChildren(children, outputDir);

  return {
    width: psd.header?.width || 'unknown',
    height: psd.header?.height || 'unknown',
    totalLayers: children.length,
    processedLayers: flatChildren.length,
    outputDir
  };
}
```

### 第三步 输入内容参数数据结构定义

**文件位置：**src/schemas/input.ts

```ts
 import { z } from "zod";

// PSD切片工具的输入参数验证模式
export const SlicePSDArgumentsSchema = z.object({
  inputPath: z.string().describe("PSD文件在当前目录的绝对路径"),
  outputDir: z.string().optional().describe("输出目录在当前目录的绝对路径"),
});
```

### 第四步 定义一些可能会用到的工具函数

**文件位置：**src/utils/helpers.ts

```go
 /**
 * 通用辅助函数
 */

import { z } from 'zod';

/**
 * 格式化Zod验证错误
 * @param error Zod错误对象
 * @returns 格式化后的错误消息
 */
export function formatZodError(error: z.ZodError): string {
  return error.errors
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join(", ");
}

/**
 * 将下划线命名转换为连字符命名
 * @param name 下划线命名的字符串
 * @returns 连字符命名的字符串
 */
export function underscoreToDash(name: string): string {
  return name.replace(/_/g, '-');
}

/**
 * 格式化工具响应内容
 * @param text 响应文本
 * @returns 格式化后的响应内容
 */
export function formatToolResponse(text: string) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

/**
 * 安全执行异步函数
 * @param fn 要执行的异步函数
 * @param errorMessage 错误消息前缀
 * @returns 函数执行结果或错误
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  errorMessage: string = "操作失败"
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`参数无效: ${formatZodError(error)}`);
    }
    throw new Error(`${errorMessage}: ${error}`);
  }
}
```

### 第五步 定义MCP工具服务的主入口

**文件位置：**src/index.ts

```ts
 /**
 * MCP工具服务主入口
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 导入配置
import { SERVICE_CONFIG, TOOLS_CONFIG } from './config.js';

// 导入工具实现
import { slicePSD } from './tools/psd-slice.js';

// 导入参数验证模式
import { SlicePSDArgumentsSchema, CreateVueAppArgumentsSchema } from './schemas/input.js';

// 导入辅助函数
import { underscoreToDash, formatToolResponse, safeExecute } from './utils/helpers.js';
import logger from './utils/logger.js';

// 创建MCP服务器实例
const server = new Server(
  {
    name: SERVICE_CONFIG.name,
    version: SERVICE_CONFIG.version,
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 注册可用工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info("收到工具列表请求");
  
  return {
    tools: [
      {
        name: TOOLS_CONFIG.psdSlice.name,
        description: TOOLS_CONFIG.psdSlice.description,
        inputSchema: {
          type: "object",
          properties: {
            inputPath: {
              type: "string",
              description: "PSD文件在当前目录的绝对路径",
            },
            outputDir: {
              type: "string",
              description: "输出目录在当前目录的绝对路径",
            },
          },
          required: ["inputPath"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  logger.info(`收到工具调用请求: ${name}`);
  
  const toolName = underscoreToDash(name);
  
  // 处理PSD切片工具
  if (toolName === underscoreToDash(TOOLS_CONFIG.psdSlice.name)) {
    return await safeExecute(async () => {
      const { inputPath, outputDir } = SlicePSDArgumentsSchema.parse(args);
      logger.info(`开始切片PSD文件: ${inputPath}`);
      
      const result = await slicePSD(inputPath, outputDir);
      
      return formatToolResponse(`PSD切片完成！\n
文件信息:
- 宽度: ${result.width}px
- 高度: ${result.height}px
- 总图层数: ${result.totalLayers}
- 处理完成的图层数: ${result.processedLayers}
输出目录: ${result.outputDir}`);
    }, "PSD切片失败");
  } 
  // 未知工具
  else {
    throw new Error(`未知工具: ${name}`);
  }
});

// 启动服务器
async function main() {
  try {
    logger.info("正在启动MCP服务...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info(`${SERVICE_CONFIG.name} MCP服务已启动`);
  } catch (error) {
    logger.error("服务启动失败:", error);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error("未捕获的异常:", error);
});

process.on('unhandledRejection', (reason) => {
  logger.error("未处理的Promise拒绝:", reason);
});

// 启动服务
main().catch((error) => {
  logger.error("Fatal error in main():", error);
  process.exit(1);
});
```

### 第六步 定义构建的脚本

```go
 {
  // ...
  "scripts": {
    "build": "mkdir -p build && tsc && node -e \"require('fs').chmodSync('build/index.js', '755')\"",
  },
  "files": [
    "build"
  ],
}
```

执行构建命令 **npm run build** 即可完成脚本的构建，构建产物在项目根目录的 build 文件夹下。

### 第七步 在Cursor中开启使用

新增一个MCP的服务器

![](/posts/typescript-mcp/01.png)

假设构建后脚本的绝对路径是：/Users/KevinKwok/mcp/psd-slice-mcp/build/index.js。我们自定义一个服务器的名称，并且将Type设置为command类型。

![](/posts/typescript-mcp/02.png)

开启Cursor AI的YOLO模式，以支持能够在Agent中让AI直接调用MCP工具

![](/posts/typescript-mcp/03.png)

至此，我们已经实现了相关的自动切图MCP工具服务，我们可以直接到新版Cursor中，开启Agent模式后直接对话调用相关的逻辑即可。

简单使用如下：

![](/posts/typescript-mcp/04.png)

执行效果如图所示（可以看到图层结构与PSD文件内一致，preview为PSD的预览图）

![](/posts/typescript-mcp/05.png)

![](/posts/typescript-mcp/06.png)

## 七、总结

在开发过程中，我们容易遇到以下的一些坑点：

1.初始化Server实例的时候，必须带上如下参数，否则MCP服务启动会失败报错。【Server does not support tools (required for tools/list)】

```js
{
    capabilities: {
      tools: {}
    }
}
```

2.在定义输入与输出的参数中，如果涉及到文件路径相关的输入时，需要对参数添加需要为**绝对路径**的自然语言描述。否则在cursor AI调用相关工具的时候，其传入的文件路径不存在导致问题。

![](/posts/typescript-mcp/07.png)

3.在使用已有MCP工具的时候（例如说构建好的产物），需要注意**安装相关依赖**，即需要确保相关内容在本地是可以直接正常执行的，否则也会使得MCP服务无法正常使用。

## 八、展望

期望基于该MCP工程化项目构建一个智能化的MCP开发框架，以实现以下几点功能：

1.开发者提供工具的业务逻辑描述（自然语言/已有的脚本）

2.框架直接按照 config、tools、schema 几个核心步骤生成代码到MCP工程项目内

3.构建后直接能够在MCP的客户端（如Cursor）内直接使用
