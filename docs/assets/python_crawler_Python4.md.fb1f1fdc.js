import{_ as s,o as n,c as a,R as l}from"./chunks/framework.3bbe0c8b.js";const C=JSON.parse('{"title":"re模块","description":"","frontmatter":{"layout":"doc","outline":"deep"},"headers":[],"relativePath":"python/crawler/Python4.md","filePath":"python/crawler/Python4.md"}'),p={name:"python/crawler/Python4.md"},o=l(`<h1 id="re模块" tabindex="-1">re模块 <a class="header-anchor" href="#re模块" aria-label="Permalink to &quot;re模块&quot;">​</a></h1><p><code>import re</code></p><h2 id="findall" tabindex="-1">findall： <a class="header-anchor" href="#findall" aria-label="Permalink to &quot;findall：&quot;">​</a></h2><p>匹配字符串中所有符合正则的内容，返回迭代器。</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">lst </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">findall</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\\d</span><span style="color:#89DDFF;">+&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">我的电话号码一个是：12345,另一个是：13579</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">lst</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># [&#39;12345&#39;,&#39;13579&#39;]</span></span></code></pre></div><h2 id="finditer" tabindex="-1">finditer: <a class="header-anchor" href="#finditer" aria-label="Permalink to &quot;finditer:&quot;">​</a></h2><p>匹配字符串中所有的内容，返回迭代器,获取内容需要<code>group()</code>。</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">it </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">finditer</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\\d</span><span style="color:#89DDFF;">+&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">我的电话号码一个是：12345,另一个是：13579</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> i </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> it</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">i</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">())</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">12345</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">13579</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span></code></pre></div><h2 id="search" tabindex="-1">search: <a class="header-anchor" href="#search" aria-label="Permalink to &quot;search:&quot;">​</a></h2><p>返回<code>match</code>对象，获取数据需要<code>group()</code>，找到一个结果就返回。</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">s </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">search</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\\d</span><span style="color:#89DDFF;">+&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">我的电话号码一个是：12345,另一个是：13579</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">s</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 12345</span></span></code></pre></div><h2 id="match" tabindex="-1">match: <a class="header-anchor" href="#match" aria-label="Permalink to &quot;match:&quot;">​</a></h2><p>从头开始匹配与<code>search</code>类似</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">s </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">search</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\\d</span><span style="color:#89DDFF;">+&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">12345,另一个是：13579</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">s</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 12345</span></span></code></pre></div><h2 id="预加载正则表达式" tabindex="-1">预加载正则表达式 <a class="header-anchor" href="#预加载正则表达式" aria-label="Permalink to &quot;预加载正则表达式&quot;">​</a></h2><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">obj </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">compile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\\d</span><span style="color:#89DDFF;">+&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">rets </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> obj</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">finditer</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">我的电话号码一个是：12345,另一个是：13579</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> ret </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> rets</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">ret</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">())</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">12345</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">13579</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span></code></pre></div><p>一个样例[选择符合表达式内容的部分内容方法]:</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> re</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">s </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#C3E88D;">&lt;div class=&#39;Jay&#39;&gt;&lt;span id=&#39;1&#39;&gt;周杰伦&lt;/span&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#C3E88D;">&lt;div class=&#39;Eason&#39;&gt;&lt;span id=&#39;2&#39;&gt;陈奕迅&lt;/span&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#C3E88D;">&lt;div class=&#39;JJ&#39;&gt;&lt;span id=&#39;3&#39;&gt;林俊杰&lt;/span&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># (?p&lt;分组名字&gt;正则) 可以单独从正则匹配的内容中进一步提取内容</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># re.S 令.能够匹配所有字符</span></span>
<span class="line"><span style="color:#A6ACCD;">obj </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">compile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">&lt;div class=&#39;.</span><span style="color:#89DDFF;">*?</span><span style="color:#C3E88D;">&#39;&gt;&lt;span id=&#39;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;top_id&gt;</span><span style="color:#C3E88D;">\\d</span><span style="color:#89DDFF;">+)</span><span style="color:#C3E88D;">&#39;&gt;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;name&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">&lt;/span&gt;&lt;/div&gt;</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">S</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">res </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> obj</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">finditer</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">s</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> it </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> res</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">it</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">top_id</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;"> it</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">name</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">))</span></span></code></pre></div><div class="language-Python"><button title="Copy Code" class="copy"></button><span class="lang">Python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">2022.7.11 Kevin</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">豆瓣电影排行榜top250爬虫(源代码只能进行前25个电影爬虫,通过while+params解决)</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> requests</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> re</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> csv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">st </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span></span>
<span class="line"><span style="color:#A6ACCD;">url </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">https://movie.douban.com/top250</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">header </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">电影名</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">上映年份</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">评分</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">评分人数</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">with</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">open</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ranting.csv</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">w</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">encoding</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">utf-8</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">newline</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&#39;&#39;</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> fw</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    writer </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> csv</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">writer</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">fw</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    writer</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">writerow</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">header</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">while</span><span style="color:#A6ACCD;"> st </span><span style="color:#89DDFF;">&lt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">250</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    params </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">start</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> st</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    headers </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">User-Agent</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    resp </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> requests</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">url</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">headers</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">headers</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">params</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    resp</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">encoding</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">utf-8</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">    html </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> resp</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">text</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span></span>
<span class="line"><span style="color:#A6ACCD;">    obj </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">compile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">&lt;li&gt;.</span><span style="color:#89DDFF;">*?</span><span style="color:#C3E88D;">&lt;span class=&quot;title&quot;&gt;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;name&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)&#39;</span></span>
<span class="line"><span style="color:#82AAFF;">                     </span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">&lt;/span&gt;.</span><span style="color:#89DDFF;">*?</span><span style="color:#C3E88D;">&lt;p class=&quot;&quot;&gt;.</span><span style="color:#89DDFF;">*?</span><span style="color:#C3E88D;">&lt;br&gt;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;year&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">&amp;nbsp</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#82AAFF;">                     </span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?</span><span style="color:#C3E88D;">&lt;span class=&quot;rating_num&quot; property=&quot;v:average&quot;&gt;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;rating&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">&lt;/span&gt;</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#82AAFF;">                     </span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?</span><span style="color:#C3E88D;">&lt;span&gt;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;amount&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">人评价&lt;/span&gt;</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">S</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    res </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> obj</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">finditer</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">html</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">with</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">open</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ranting.csv</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">a</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">encoding</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">utf-8</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">newline</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&#39;&#39;</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> fw</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">        writer </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> csv</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">writer</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">fw</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> it </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> res</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">            dic </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> it</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">groupdict</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">            dic</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">year</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> dic</span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">year</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">].</span><span style="color:#82AAFF;">strip</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">            writer</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">writerow</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">dic</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">values</span><span style="color:#89DDFF;">())</span></span>
<span class="line"><span style="color:#A6ACCD;">    st </span><span style="color:#89DDFF;">+=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">25</span></span></code></pre></div><p>结果：</p><p><img src="https://s2.loli.net/2022/07/11/wURD3JSYHog6npO.png" alt="image-20220711173010251"></p><p><img src="https://s2.loli.net/2022/07/11/O8aotcHj4mlTEb6.png" alt="image-20220711173030280"></p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">2022.7.11 Kevin</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">爬取电影天堂2022必看电影名称，下载链接</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> requests</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> re</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">url </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https://dytt89.com/</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">headers </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">User-Agent</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">resp </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> requests</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">url</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> headers</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">resp</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">encoding</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">gb2312</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">html </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> resp</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">text</span></span>
<span class="line"><span style="color:#A6ACCD;">url_list </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[]</span></span>
<span class="line"><span style="color:#A6ACCD;">obj1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">compile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">2022必看热片.</span><span style="color:#89DDFF;">*?</span><span style="color:#C3E88D;">&lt;ul&gt;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;ul&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">&lt;/ul&gt;</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">S</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">obj2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">compile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">&lt;a href=&#39;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;href&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">&#39;</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">S</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">obj3 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">compile</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">◎片　　名</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;name&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">&lt;br /&gt;.</span><span style="color:#89DDFF;">*?&#39;</span></span>
<span class="line"><span style="color:#82AAFF;">                  </span><span style="color:#C792EA;">r</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">&lt;td style=&quot;WORD-WRAP: break-word&quot; bgcolor=&quot;#fdfddf&quot;&gt;&lt;a href=&quot;</span><span style="color:#89DDFF;">(</span><span style="color:#F07178;">?P&lt;magnet&gt;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">*?)</span><span style="color:#C3E88D;">&quot;&gt;</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> re</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">S</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">res1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> obj1</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">finditer</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">html</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> it </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> res1</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    ul </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> it</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ul</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    res2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> obj2</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">finditer</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">ul</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> it2 </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> res2</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">        new_url </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> url</span><span style="color:#89DDFF;">+</span><span style="color:#A6ACCD;">it2</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">href</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">strip</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        url_list</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">append</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">new_url</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">#resp2 = requests.get(new_url, headers=headers)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># resp2.encoding = &#39;gb2312&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># res3 = obj3.finditer(resp2.text)</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;"># for it3 in res3:</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">#     print(it3.group(&#39;name&#39;), it3.group(&#39;magnet&#39;))</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">#     break</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> href </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> url_list</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    child_resp </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> requests</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">href</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> </span><span style="color:#A6ACCD;font-style:italic;">headers</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">headers</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    child_resp</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">encoding</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">gb2312</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">    res3 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> obj3</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">search</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">child_resp</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;">text</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">res3</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">name</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;"> res3</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">group</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">magnet</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">))</span></span></code></pre></div>`,23),t=[o];function e(c,r,D,F,y,A){return n(),a("div",null,t)}const u=s(p,[["render",e]]);export{C as __pageData,u as default};
