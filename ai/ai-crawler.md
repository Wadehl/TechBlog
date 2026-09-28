---
title: AI 赋能爬虫：从规则匹配到智能交互的实践
date: 2025-06-20
description: 用 Crawl4AI 和 Browser-use 把页面抓取从固定规则推进到可交互的流程。
outline: deep
---

# AI 赋能爬虫：从规则匹配到智能交互的实践

> 写于 2025-06-20

## 一、引言

对于任何与数据打交道的人来说，数据抓取无疑是一项充满挑战却又必不可少的工作。你是否曾因一个网站改版，而不得不耗费数日重写爬虫代码？是否曾为处理动态加载内容和反爬机制而焦头烂额？在没有AI的时代，数据抓取往往意味着无休止的规则定义、手动分析和繁琐维护。每一次页面更新，都可能导致前期投入的努力付诸东流。

然而，AI的到来正在为数据抓取领域带来前所未有的机遇。AI的引入，不仅极大地提升了数据抓取效率，更关键的是，它正在革新我们与网页交互、理解内容及提取信息的方式。本本文旨在深入探讨这一变革：首先，我们将回顾传统数据抓取方法的局限性；接着，详细介绍 AI 驱动的两款新兴工具——Crawl4AI 和 Browser-use；最终，提供一系列融合 AI 理念的数据抓取最佳实践，旨在帮助读者摆脱传统困境，以更智能、高效的方式应对数据挑战。

## 二、问题背景

传统网页数据抓取主要依赖以下技术方案，但它们普遍面临诸多挑战：

- **Requests库：** 用于发送HTTP请求获取网页内容。

  - **缺点：** 无法处理JavaScript动态加载的内容；需手动解析 HTML 或 JSON，面对复杂结构时效率低下；网站结构或 API 接口变化易导致代码失效，维护成本高昂。
- **Selenium/Playwright（无头浏览器）：** 模拟真实浏览器行为，处理JavaScript渲染的页面。

  - **缺点：** 运行速度较慢，资源消耗显著；需要为每个页面单独编写复杂的元素定位逻辑（如 XPath、CSS 选择器）；页面结构或 DOM 元素微小变动即可能导致定位符失效，造成脚本崩溃，维护成本极高。
- **XPath/CSS选择器：** 用于从HTML/XML文档中定位和提取特定元素。

  - **缺点：** 高度依赖页面结构，HTML 微调即可能导致选择器失效，需频繁维护；缺乏语义理解能力，难以灵活应对内容布局；对非结构化或半结构化数据的提取能力有限。
- **JS逆向工程：** 分析并模拟网站的JavaScript代码，以获取动态生成的数据或绕过反爬机制。

  - **缺点：** 技术门槛高，要求深入的 JavaScript 知识和调试经验；网站 JS 代码更新频繁，逆向分析成本高昂且稳定性差；存在较高的法律风险，可能违反网站的服务条款。

综上所述，传统数据抓取方式的核心挑战在于：**智能性不足、对页面结构高度敏感、维护成本居高不下，以及难以规模化处理复杂多变的网页。** 尤其当页面或 API 接口发生变更时，既有脚本将面临近乎毁灭性的打击。

## **三、AI（LLM）驱动的数据抓取：新范式与创新工具**

面对传统数据抓取方式的诸多痛点，人工智能的崛起为这一领域带来了革命性的变革。AI（尤其是大语言模型 LLM）凭借其强大的学习、理解和泛化能力，正为数据抓取领域带来革命性变革，推动其从传统的“规则匹配”时代，逐步迈向“语义理解”和“智能交互”的新范式。

AI驱动的数据抓取解决方案，旨在通过以下几个方面解决传统方法的弊端：

1. **语义理解能力：** LLM能够理解网页内容的上下文和语义，而非仅仅依赖固定的结构标签。这意味着即使页面布局或元素ID发生变化，只要内容的含义不变，AI依然能够识别并提取所需信息。
2. **动态适应性：** 借助LLM的决策能力，工具可以更灵活地适应网页的动态变化、反爬机制和复杂交互，减少对人工规则的依赖。
3. **自动化与智能化：** LLM 可自动化以往需人工干预的多个环节，例如自动识别关键信息、生成提取规则甚至智能规划抓取路径，从而显著降低开发与维护成本。
4. **数据就绪化：** LLM 不仅能高效抓取数据，还能将复杂的非结构化或半结构化网页内容转化为可直接用于下游代码或其他 AI 模型的结构化格式。

在这一新范式下，涌现出了一系列创新工具。其中，Crawl4AI 和 Browser-use 作为基于 Playwright 的典型代表，分别从不同侧面切入，共同开辟了 AI 赋能数据抓取的新路径。

### **（一）Crawl4AI：面向AI模型的高效数据工厂**

<https://github.com/unclecode/crawl4ai>

Crawl4AI是一款开源的、专为AI时代设计的高性能网络爬虫与数据提取工具 。它不仅仅是一个爬虫库，更像一个为大语言模型（LLM）准备数据的高效工厂。

- **核心理念与优势：**

  - **LLM友好型数据输出：** Crawl4AI 的显著优势在于其能够理解页面语义结构，并自动将抓取内容转换为简洁、结构化的 Markdown 格式。这种格式天然契合 RAG（检索增强生成）和 LLM 微调等应用，极大降低了数据清洗和预处理的复杂度。
  - **异步与极速性能：** 作为一款异步爬虫库，Crawl4AI在处理大量请求时表现出色，并且支持根据系统资源自动调控的并发抓取。
  - **AI驱动的提取策略：** 除了支持传统的CSS/XPath提取策略外，Crawl4AI也融入了LLM驱动的提取能力。这意味着它可以更智能地识别和解析网页元素，自动化数据提取过程 。
  - **构建AI Agent的基础：** Crawl4AI被定位为AI Agent的构建工具。它不仅抓取数据，还能为智能Agent提供高质量、结构化的输入，使其能更好地理解和利用网络信息。
- **适用场景：**

  - 需要为LLM应用（如RAG、微调）构建大规模高质量数据集的开发者。
  - 追求高性能、高并发，并对数据格式有特定要求的场景。
  - 希望通过AI简化数据提取流程，减少人工规则编写和维护成本的团队。

### **（二）Browser-use：AI代理的通用浏览器交互框架**

<https://github.com/browser-use/browser-use>

与Crawl4AI专注于数据抓取和数据准备不同，Browser-use提供了一个更宽泛的视角——它是一个旨在让AI智能体（Agents）能够像人类一样与真实浏览器进行交互的Python库。它更准确地定位为一个 AI 驱动的通用自动化框架，数据抓取仅是其众多强大功能中的一环。

- **核心理念与优势：**

  - **自然语言驱动的交互：** Browser-use 的核心价值在于它提供了一个简洁的界面，使得AI代理能够通过自然语言指令来控制浏览器执行各种操作。这包括点击、输入、滚动、导航等，就像一个虚拟用户在操作浏览器一样。
  - **高度模拟人类行为：** 通过集成Playwright等浏览器引擎，Browser-use能够模拟真实的用户行为，处理动态加载、用户交互、表单填写等复杂场景，从而绕过许多传统爬虫难以应对的反爬机制。
  - **通用自动化能力：** Browser-use的应用范围远超单纯的数据抓取。它可以用于自动化测试、端到端流程自动化、智能机器人等各种需要AI与网页深度交互的场景。数据抓取是其实现复杂任务流程中的一个功能点。
- **适用场景：**

  - 需要AI代理完成复杂网页交互，并从中获取特定信息的场景（如自动化填写表单、登录后数据抓取）。
  - 开发AI自动化测试工具或智能工作流的工程师。
  - 对数据抓取的“人机交互”真实性要求较高，且不强调超高并发量的应用。

## **四、**AI驱动数据抓取的实践案例与技巧

### （一）OldSchool + AI赋能

本节将通过一个简单的 Vue+Express 前后端分离页面来展示实践场景，暂不深入探讨过于复杂的页面交互处理。

**场景模拟**

页面内容：该页面模拟的是一个获取不同地区不同商品的定价的页面，其整体结构如下：

核心DOM节点结构：

![](/posts/ai-crawler/01.png)

![](/posts/ai-crawler/02.png)

接口数据：该页面的数据来源与数据结构也很简单，通过JSONP请求获取后端数据，数据为一个字典，其中键为货币类型，值为对应的商品价格数组。

```bash
curl 'http://localhost:3001/api/currency-data?callback=jsonp_callback_1749809151655_8i4w46ld8' \
  -H 'Accept: */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -b '_gcl_au=1.1.701620173.1742351130; _ga=GA1.1.1662082993.1742351130; _ga_HVM2QW3XB3=GS2.1.s1749721968$o24$g1$t1749722675$j49$l0$h0; _ga_RMRW08GS43=GS2.1.s1749721968$o24$g1$t1749722866$j60$l0$h0; _ga_EF1MSRE1KY=GS2.1.s1749721968$o24$g1$t1749722866$j60$l0$h0; _ga_076Q8H0674=GS2.1.s1749721968$o24$g1$t1749722866$j60$l0$h0; _ga_M7W5LMH9EH=GS2.1.s1749721968$o24$g1$t1749722866$j60$l0$h0' \
  -H 'Referer: http://localhost:3000/' \
  -H 'Sec-Fetch-Dest: script' \
  -H 'Sec-Fetch-Mode: no-cors' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"'
```

![](/posts/ai-crawler/03.png)

实际上，Crawl4AI、Browser-use 等绝大多数 AI 驱动的数据抓取框架均基于 Playwright 实现。因此，Playwright 无头浏览器所支持的全部功能，这些库也同样支持。

接下来，我们将简要介绍几个传统抓取场景中结合这些 AI 驱动工具的实现方式：

#### 1 Crawl4AI：generate\_schema()

鉴于该页面的结构相对简单，只需定义如下 `xpath_css_strategy` 即可实现数据提取。

```python
{
  "products": {
    "selector": "//div[@class='product-card']",  // 定位到每个商品卡片
    "type": "list",                              // 期望返回一个列表
    "items": {                                   // 列表中每个商品卡片的数据结构
      "name": {
        "selector": ".//div[@class='product-icon']", // 在当前卡片内，定位商品名称元素
        "type": "text",                           // 提取文本内容
        "regex": ".*?\\s(.+)"                     // 可选：使用正则从文本中提取“商品4”部分
      },
      "currency": {
        "selector": ".//div[@class='product-currency']", // 在当前卡片内，定位货币元素
        "type": "text"                            // 提取文本内容
      },
      "price": {
        "selector": ".//div[@class='product-amount']",   // 在当前卡片内，定位金额元素
        "type": "text",                           // 提取文本内容
        "regex": "[^\\d]*(\\d+)"                  // 可选：使用正则从文本中提取“8000”数字部分
      }
    }
  }
}
```

然而，Crawl4AI 的强大之处在于，我们可以直接利用其 API，通过自然语言描述来自动生成所需的 `xpath_css_strategy` 。

```python
import asyncio
from crawl4ai.extraction_strategy import (
    JsonXPathExtractionStrategy,
)
from crawl4ai import LLMConfig, CrawlerRunConfig, CacheMode, AsyncWebCrawler
​
## HTML片段
html = """
<div class="products-grid">
  <div class="product-card">
    <div class="product-icon">
      商品4
    </div>
    <div class="product-currency">CNY</div>
    <div class="product-amount">¥ 8000</div>
  </div>
</div>
"""
​
## 通过LLM来解析获取Schema，而非自己去处理
xpath_schema = JsonXPathExtractionStrategy.generate_schema(
    html,
    schema_type="xpath",
    llm_config=LLMConfig(
        provider="openai/gpt-4.1",
        api_token=os.getenv("OPENAI_API_TOKEN"),
        base_url=os.getenv("OPENAI_BASE_URL"),
    ),
)
​
print(xpath_schema)
strategy = JsonXPathExtractionStrategy(xpath_schema)
​
config = CrawlerRunConfig(
    extraction_strategy=strategy,
    wait_for="css:div.products-grid", # 因为是动态页面，所以需要等待页面加载完成
    cache_mode=CacheMode.BYPASS,
)
​
async def main():
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(
            url="http://localhost:3000/",
            config=config,
        )
        print(result.extracted_content)
​
if __name__ == "__main__":
    asyncio.run(main())
```

运行这段代码后，我们可以获得以下内容：

（1）AI生成的Schema（可保存后修改并复用）

```python
{
  "name": "Product Grid Cards",
  "baseSelector": "//div[@class='product-card']",
  "fields": [
    {
      "name": "icon_and_name",
      "selector": ".//div[@class='product-icon']",
      "type": "text"
    },
    {
      "name": "currency",
      "selector": ".//div[@class='product-currency']",
      "type": "text"
    },
    {
      "name": "amount",
      "selector": ".//div[@class='product-amount']",
      "type": "text"
    }
  ]
}
```

（2）输出的结果

我们可以发现，输出的数据完全符合预期。值得注意的是，除了复制代码，我们仅需根据页面的动态渲染特性，手动添加了一个 `wait_for` 条件（指示在特定 DOM 元素加载完成后再进行数据抓取与解析），便完成了整个过程。

```python
[
    {
        "icon_and_name": "商品1",
        "currency": "CNY",
        "amount": "¥ 800"
    },
    {
        "icon_and_name": "商品2",
        "currency": "CNY",
        "amount": "¥ 1500"
    },
    {
        "icon_and_name": "商品3",
        "currency": "CNY",
        "amount": "¥ 4000"
    },
    {
        "icon_and_name": "商品4",
        "currency": "CNY",
        "amount": "¥ 8000"
    }
]
```

#### 2 接口捕获与控制台捕获

此场景与传统通过 `requests` 构造请求参数并直接调用 API 接口的方式类似。然而，传统方法往往需要我们深入分析数据来源接口、解析参数作用，甚至可能需要进行逆向工程以伪造 token，才能成功请求接口。

得益于 Playwright 对网络事件监听的支持，我们现在可以直接记录每个接口请求的参数和响应数据，并将其交由 LLM 分析。这极大地简化了参数构造的复杂流程，同时也能有效规避因伪造请求可能带来的封禁风险。

Crawl4AI提供了配置项 `capture_network_requests`，能够将网络响应进行捕获并存储，以下是实现捕获的简单代码示例：

```python
import asyncio
import json
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
​
async def main():
    config = CrawlerRunConfig(
        capture_network_requests=True, # 开启网络请求捕获
        cache_mode=CacheMode.DISABLED, # 关闭缓存
    )
​
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="http://localhost:3000/", # 目标网站
            config=config # 数据抓取的页面
        )
​
        if result.success:
            """
            网络请求数据结构:
            event_type: Type of event: "request", "response", or "request_failed" 请求类型
            url:  The URL of the request 请求URL
            timestamp:  Unix timestamp when the event was captured 请求时间戳
            """
            # 导出所有捕获的数据到文件
            with open("network_capture.json", "w") as f:
                json.dump({
                    "url": result.url,
                    "network_requests": [req for req in (result.network_requests or []) if req.get("event_type") == "response"],
                }, f, indent=2)
​
            print("导出所有捕获的数据到文件 network_capture.json")
​
if __name__ == "__main__":
    asyncio.run(main())
```

​

通过此代码，我们能成功捕获所有发起的请求的响应数据并保存至 `network_capture.json`。这些数据可直接作为 LLM 的输入参数，结合 LangChain 等框架，交由后续的 LLM 进行深度分析与总结。

以下是LLM分析后的总结的数据：

```python
{
  "product_data_processed": {
    "example_format": {
      "CNY": ["100.00", "500.50", "1000.00"],
      "USD": ["20.00", "150.00"]
      // ... 其他货币
    }
  }
}
```

#### 3 其他场景与未来趋势

上述场景涵盖了无头浏览器交互、requests 请求和 XPath/CSS 页面元素分析这三种经典数据抓取方法。尽管实际操作中仍可能涉及一定的人工分析，但总体难度不高，主要侧重于浏览器交互和数据结构梳理。 然而，面对复杂的 JavaScript 逆向工程时，传统方法则显得力不从心。但值得注意的是，[humanifyJS](https://github.com/jehna/humanify)这样的工具已开始利用大型语言模型支持JavaScript代码的反混淆，这无疑为JS逆向工程带来了效率上的显著提升。

### （二）较为新兴的实现思路

鉴于部分场景需要 Docker 部署，且 Docker 环境访问本机 localhost 测试页面需额外配置，本节将以 `http://books.toscrape.com/` 作为示例数据源进行抓取实践。

![](/posts/ai-crawler/04.png)

#### 1 通过自然语言，让BrowserUse操作浏览器执行自动化功能

比如，一个简单的任务：直接通过简单的自然语言描述，让LLM抓取页面的前两页内容，按照JSON的格式返回。

示例代码：

```python
from langchain_openai import ChatOpenAI
from browser_use import Agent
from dotenv import load_dotenv
import os
import asyncio
​
load_dotenv()
​
api_key = os.getenv('OPENAI_API_KEY')
base_url = os.getenv('OPENAI_BASE_URL')
## 使用GPT-4.1进行测试
llm = ChatOpenAI(model="gpt-4.1", base_url=base_url, api_key=api_key)
​
async def main():
    agent = Agent(
        # 通过简单的自然语言进行任务的定义
        task="""
        访问http://books.toscrape.com/的前两页
        获取每本书的标题、价格与评分
        按JSON格式进行返回
        """,
        llm=llm,
    )
    start_time = time.time()
    result = await agent.run()
    end_time = time.time()
    print(result)
    print(f"耗时: {end_time - start_time:.2f} 秒")
​
asyncio.run(main())
```

1. **抓取过程：**

   可以看到，虽然页面每页有 20 本书的信息，但 BrowserUse 每次只会解析当前视窗范围内的内容。

   ![](/posts/ai-crawler/05.png)

   并且，BrowserUse会将定义的任务规划成一个个小任务，每次完成一个后再继续下一个。

   （1）跳转页面解析结构：

   ![](/posts/ai-crawler/06.png)

   （2）找到符合条件的内容，解析成JSON：

   ![](/posts/ai-crawler/07.png)

   （3）第一页遍历完成，访问下一页：

   ![](/posts/ai-crawler/08.png)
2. **输出的结果：**

   ![](/posts/ai-crawler/09.png)
3. **遇到的问题：**

   - **输出的格式不稳定**

     该问题可通过自定义解析格式来解决，只需添加如下处理逻辑：

     ```diff
     + from typing import List
     from langchain_openai import ChatOpenAI
     - from browser_use import Agent
     + from browser_use import Agent, Controller
     from dotenv import load_dotenv
     import os
     import asyncio
     import time
     + from pydantic import BaseModel
     + class Book(BaseModel):
     +   book_name: str
     +   book_price: str
     +   book_rating: str
     ​
     + class Books(BaseModel):
     +   books: List[Book]
     ​
     load_dotenv()
     ​
     + controller = Controller(output_model=Books)
     api_key = os.getenv('OPENAI_API_KEY')
     base_url = os.getenv('OPENAI_BASE_URL')
     llm = ChatOpenAI(model="gpt-4.1", base_url=base_url, api_key=api_key)
     ​
     async def main():
         agent = Agent(
             task="""
             访问http://books.toscrape.com/的前两页
             获取每本书的标题、价格与评分
             按JSON格式进行返回
             """,
             llm=llm,
     +        controller=controller
         )
         start_time = time.time()
         result = await agent.run()
         end_time = time.time()
         print(result)
         print(f"耗时: {end_time - start_time:.2f} 秒")
     ​
     asyncio.run(main())
     ```

- - 修改后，输出的结果可以满足要求了，以下为数据示例。

    ![](/posts/ai-crawler/10.png)
  - 输出的时间过长，且解析的条数与数据不完全正确

    在对两页数据进行测试时，总耗时高达 **827 秒（超过 13 分钟）**。更重要的是，虽然每页有 20 条完整的数据（包含书名、定价和评分），但最终只解析出 32 条数据，且部分数据的评分未能正常提取。

    LLM输出的错误信息如下：

    > The star ratings were not described or visible in the provided content, thus `star_rating` is returned as `null`

    根本原因可能在于自任务划分阶段，LLM 接收到的初始页面内容是当前浏览器视窗的截图，这可能导致部分书本评分或其他属性因截断而无法被正确解析。

#### 2 网页HTML→ 核心内容Markdown → AI结构化数据输出

示例代码：

```python
import asyncio
from crawl4ai import (
    AsyncWebCrawler,
    DefaultMarkdownGenerator,
    LLMExtractionStrategy,
)
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, LLMConfig, CacheMode
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from typing import List
​
load_dotenv()
​
class Book(BaseModel):
    book_name: str
    book_price: str
    book_rating: str
​
class Books(BaseModel):
    books: List[Book]
​
ds_api_key = os.getenv("DEEPSEEK_API_KEY")
llm_config = LLMConfig(provider="deepseek/deepseek-chat", api_token=ds_api_key)
​
async def main():
    browser_config = BrowserConfig()  # 使用默认的无头浏览器配置
    extraction_strategy = LLMExtractionStrategy(
        llm_config=llm_config,
        # 定义任务指引
        instruction="""
        专注于书本相关的核心数据
        包括：
        - 书名
        - 书本价格与货币
        - 书本评分
        返回合适的JSON
        """,
        # chunk_token_threshold=1024,  # 切片
        input_format="markdown",  # 输入的格式，默认为markdown
        extraction_type="schema",  # 解析模式
        schema=Books.schema_json(),  # 解析参考的数据结构
    )
    run_config = CrawlerRunConfig(
        extraction_strategy=extraction_strategy,
        cache_mode=CacheMode.BYPASS,  # 避免使用缓存
    )
​
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url="http://books.toscrape.com/", config=run_config)
        if result.success:
            print(result.extracted_content)
​
if __name__ == "__main__":
    asyncio.run(main())
```

​

1. 抓取过程

   ![](/posts/ai-crawler/11.png)
2. 输出的结果

   （1）中间markdown产物

   ![](/posts/ai-crawler/12.png)

   （2）JSON结果

   ![](/posts/ai-crawler/13.png)
3. 遇到的问题

   - 一些时候，某些需要的要素可能会被Markdown解析的时候丢弃，导致关键数据无法传递给LLM进行解析。解决方案也很简单，在`LLMExtractionStrategy` 对传入的属性`input-format` 改为 `html` 即可。

     ```diff
     extraction_strategy = LLMExtractionStrategy(
             llm_config=llm_config,  # or your preferred provider
             instruction="""
             专注于书本相关的核心数据
             包括：
             - 书名
             - 书本价格与货币
             - 书本评分
             返回合适的JSON
             """,
     -       input_format="markdown",  # 输入的格式，默认为markdown        
     +       input_format="html",
             extraction_type="schema",  # 解析模式
             schema=Books.schema_json(),  # 解析参考的数据结构
         )
     ```

修改后，返回的结果已经正常带上评分了。

![](/posts/ai-crawler/14.png)

- - 对于一些模型（如：deepseek/deepseek-chat）返回格式不兼容

    <https://github.com/unclecode/crawl4ai/issues/1202>

    对于这个问题，参考链接：<https://linux.do/t/topic/561221> 修改源码即可正常解析。

#### 3 将页面转为API支持

Crawl4AI支持通过Docker部署，其部署流程在官方文档已经很详细了，这里仅提供文档链接参考。

<https://docs.crawl4ai.com/core/docker-deployment/#option-1-using-pre-built-docker-hub-images-recommended>

部署成功后，即可通过 `http://localhost:11235/playground/` 访问其 Playground 页。

![](/posts/ai-crawler/15.png)

1. 抓取过程

   抓取过程与2一致，相当于提供了图形化界面进行测试与操作，并简化了很多配置项。比如我们需要获取目标页面的MD的话，按下图进行选择即可。

   ![](/posts/ai-crawler/16.png)

   点击运行后，下方会提供响应的信息，以及Python/cURL的快速请求示例。

   ![](/posts/ai-crawler/17.png)

   ![](/posts/ai-crawler/18.png)

   同时，除了md响应外，还支持llm请求，但是由于与【二】相同的问题2一致，对某些大模型的响应请求处理不支持，无法正常使用。

   即使请求已完成，但是仍显示Processing

   ![](/posts/ai-crawler/19.png)

   ![](/posts/ai-crawler/20.png)
2. 运行结果

   使用LLM进行Markdown内容的筛选与解析：

   ![](/posts/ai-crawler/21.png)

   ![](/posts/ai-crawler/22.png)
3. 遇到的问题

   - `Docker`部署的情况下，配置文件 `.llm.env` 不支持配置自定义的`base_url`
   - 若配置了`OPENAI`外其他的`API_KEY`作为`LLM`支持的话，需要修改 `config.yml` 文件的`llm.provider`与`llm.api_key_env` 为对应的大模型配置，其路径为 Docker容器根目录下的`/app/config.yml`

     ![](/posts/ai-crawler/23.png)

#### 4 MCP支持

Crawl4AI与BrowserUse都提供了对MCP的支持，下面简单介绍使用与效果。

1. Crawl4AI - MCP支持

a. MCP配置

对于Crawl4AI来说，需要通过Docker部署后，才能正常调用SSE模式的MCP。

配置命令：

```python
{
  "Crawl4AI": {
    "url": "http://localhost:11235/mcp/sse",
    "start_on_launch": true
  }
}
```

可以看到，其支持的命令如下：

![](/posts/ai-crawler/24.png)

我们也可以访问 `http://localhost:11235/mcp/schema` 来查询MCP支持的参数。

至此，我们已经对Crawl4AI MCP完成配置。

b. MCP的调用测试

使用WARP测试MCP服务。

![](/posts/ai-crawler/25.png)

可以看到MCP调用正常，且AI也能够成功识别并对抓取的内容Markdown进行总结。

c. 其他

- - MCP工具`md`调用有时候会失败，并且查询日志也无法排查到出错的原因
  - Docker Playground中存在的问题，MCP调用也会存在
  - MCP工具内部调用的是配置的大模型与API-KEY，与调用MCP的LLM本身没有关系

2. BrowserUse - MCP支持

a. MCP配置

对于BrowserUse来说，并没有官方的MCP服务可供调用，但是我们可以在 `https://mcp.so` 里面找到相关的MCP。

我们使用UI-TARS的BrowserUse MCP进行尝试。（[`https://mcp.so/server/browser-use-mcp`](https://mcp.so/server/browser-use-mcp)）

配置命令：

```python
{
  "browser-use": {
    "command": "npx",
    "args": [
      "@agent-infra/mcp-server-browser"
    ],
    "env": {},
    "working_directory": null,
    "start_on_launch": true
  }
}
```

可以看到，其支持的命令如下：

![](/posts/ai-crawler/26.png)

至此，我们对BrowserUse MCP的配置已完成。

b. MCP的调用测试

我们同样让LLM去访问crawl4ai的mcp介绍页面，总结其支持的工具等内容。

![](/posts/ai-crawler/27.png)

![](/posts/ai-crawler/28.png)

![](/posts/ai-crawler/29.png)

可以看到，MCP调用即使遇到了错误，LLM也能够自主更正，能够快速高效地返回准确的信息。

c. 其他

- - MCP工具不需要提前配置LLM相关的信息，所有的规划、分析都基于调用的LLM

#### 5 Crawl4AI 与 BrowserUse 的结合

在传统 AI 结合场景中，我们提到 Crawl4AI 支持根据 HTML 片段生成 `JsonCss/XPath Schema`。然而，该 API 的输出结果有时不够稳定，可能出现期望 `JsonCss` 而实际生成 `XPath` 的情况。此外，实际应用中仍需手动选择核心 HTML 片段，而一旦手动完成截取，用户往往也能自行编写数据 `Schema`。

因此，既然 BrowserUse 可以很好的访问到真实的页面，我们就可以让BrowserUse去规划与决策他认为比较核心的页面内容DOM结构，让其输出 Schema 给我们即可。

示例代码：

```python
import json
import asyncio
from langchain_openai import ChatOpenAI
from browser_use import Agent
import os
from dotenv import load_dotenv
​
load_dotenv()
​
api_key = os.getenv('OPENAI_API_KEY')
base_url = os.getenv('OPENAI_BASE_URL')
llm = ChatOpenAI(model="gpt-4.1", base_url=base_url, api_key=api_key)
​
agent = Agent(
        task="""
          访问http://books.toscrape.com/的第一页
          获取每本书的标题、价格与评分的DOM进行解析
          按以下格式归纳其内容Schema进行整理，并返回JSON格式，不要有任何解释
          ```json
          {
            "name": "Books",
            "baseSelector": string, // 书本列表的根节点选择器
            "fields": [
              {
                "name": "book_list",
                "selector": <待补充内容a>, // 每个书本的节点DOM（每个书本节点的DOM）
                "type": "nested_list",
                "fields": [
                  {
                    "name": "book_name",
                    "selector": <待补充内容b>, // 书本标题的节点DOM
                    "type": "text",
                  },
                  {
                    "name": "book_price",
                    "selector": <待补充内容c>, // 书本价格的节点DOM
                    "type": "text",
                  },
                  {
                    "name": "book_rating",
                    "selector": <待补充内容d>, // 书本评分的节点DOM
                    "type": "text",
                  },
                ]
              }
            ]
          }
          ```
        """,
        llm=llm,
)
```

解析输出的JSON如下：

![](/posts/ai-crawler/30.png)

通过以下代码传入BrowserUse生成的Schema。

```python
import json
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode, BrowserConfig
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
import os
​
async def main():
    # BrowserUse生成的Schema
    schema = {
        "name": "Books",
        "baseSelector": "ol.row",
        "fields": [
            {
                "name": "book_list",
                "selector": "article.product_pod",
                "type": "nested_list",
                "fields": [
                    {"name": "book_name", "selector": "h3 > a", "type": "text"},
                    {
                        "name": "book_price",
                        "selector": ".product_price .price_color",
                        "type": "text",
                    },
                    {"name": "book_rating", "selector": ".star-rating", "type": "text"},
                ],
            }
        ],
    }
​
    extraction_strategy = JsonCssExtractionStrategy(schema, verbose=True)
​
    config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=extraction_strategy,
        scan_full_page=True,
        only_text=True,
        verbose=True,
    )
​
    async with AsyncWebCrawler(
        config=BrowserConfig(headless=True, text_mode=True, light_mode=True)
    ) as crawler:
        result = await crawler.arun(url="http://books.toscrape.com/", config=config)
​
        if not result.success:
            print("Crawl failed:", result.error_message)
            return
​
        data = json.loads(result.extracted_content)
        print(data)
        # print(data[0]["book_list"])
​
asyncio.run(extract_crypto_prices())
```

​

结果如下：

![](/posts/ai-crawler/31.png)

可以发现Crawl4AI能够正常使用生成的Schema，并且生成的Schema的正确率也比较高。

> 注：由于Rating的实际数值是在类名里面的，仅凭 `type="text"` 无法正常获取，需将 `type` 设置为 `attribute`，并传入 `attribute='class'` 才能正确提取。由于提示词中未明确告知 Agent 相关提取理念，若能将这些细节融入提示词，BrowserUse 理论上能获得更精准的结果。

## 五、总结与选型建议

### （一）**工具对比与选择**

总体而言，Crawl4AI 更侧重于作为一个通过参数高效返回数据的 API 接口，而 Browser-use 则更类似于一个支持自动决策的智能 Selenium 框架。

以下是二者的一些区别：

| **特性 / 工具** | **Crawl4AI** | **Browser-use** |
| --- | --- | --- |
| **核心定位** | 面向AI的Web爬虫和数据提取 | AI代理与浏览器的通用交互框架 |
| **主要功能** | 高效抓取、HTML转Markdown、LLM友好数据产出 | 模拟人类浏览器操作、自然语言驱动、通用自动化 |
| **速度** | 极速、高并发、异步 | 非常慢（模拟真实操作），适合流程自动化 |
| **数据格式** | Markdown、结构化JSON（通过AI提取） | 结构化数据（通过AI与浏览器交互后提取） |
| **主要应用** | RAG、LLM微调、AI Agent数据源、大规模数据抓取 | 自动化测试、工作流自动化、特定交互数据抓取 |
| **对页面变化** | 基于语义理解，适应性强 | 基于AI的动态判断，适应性强 |

### （二）总结

Crawl4AI 具备重要的数据缓存特性，能够将抓取到的网页内容本地化存储，从而在后续请求相同页面时直接从缓存读取，显著提升抓取效率。它还支持多种方式（如接口捕获、Markdown 解析、HTML 导出）与 AI 协作完成数据抓取任务。相对而言，BrowserUse 则能完全依靠大语言模型进行路线规划、数据解析和数据导出，实现完全自主的、基于浏览器的简单任务执行，最大程度减少人工干预。
