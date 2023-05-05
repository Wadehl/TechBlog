import{_ as s,o as n,c as a,R as l}from"./chunks/framework.3bbe0c8b.js";const F=JSON.parse('{"title":"Python 多线程","description":"","frontmatter":{"layout":"doc","outline":"deep"},"headers":[],"relativePath":"python/crawler/Python8.md","filePath":"python/crawler/Python8.md"}'),p={name:"python/crawler/Python8.md"},o=l(`<h1 id="python-多线程" tabindex="-1">Python 多线程 <a class="header-anchor" href="#python-多线程" aria-label="Permalink to &quot;Python 多线程&quot;">​</a></h1><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> threading </span><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Thread</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">def</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">func</span><span style="color:#89DDFF;">():</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> i </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">range</span><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">1000</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">func</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> i</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> __name__ </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">__main__</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    t </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Thread</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">target</span><span style="color:#89DDFF;">=</span><span style="color:#82AAFF;">func</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># 创建线程并给线程安排任务</span></span>
<span class="line"><span style="color:#A6ACCD;">    t</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">start</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;"># 多线程状态为可以开始工作状态，具体执行时间由CPU决定</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> i </span><span style="color:#89DDFF;font-style:italic;">in</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">range</span><span style="color:#89DDFF;">(</span><span style="color:#F78C6C;">1000</span><span style="color:#89DDFF;">):</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#82AAFF;">print</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">main</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;"> i</span><span style="color:#89DDFF;">)</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">运行结果:</p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">funcmain </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span></span>
<span class="line"><span style="color:#A6ACCD;">func</span></span>
<span class="line"><span style="color:#A6ACCD;">main </span><span style="color:#F78C6C;">1</span></span>
<span class="line"><span style="color:#A6ACCD;">func </span><span style="color:#F78C6C;">2</span></span>
<span class="line"><span style="color:#A6ACCD;">func </span><span style="color:#F78C6C;">3</span></span>
<span class="line"><span style="color:#A6ACCD;">func </span><span style="color:#F78C6C;">4</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span></span>
<span class="line"><span style="color:#A6ACCD;">main func </span><span style="color:#F78C6C;">5</span></span>
<span class="line"><span style="color:#A6ACCD;">func </span><span style="color:#F78C6C;">6</span></span>
<span class="line"><span style="color:#A6ACCD;">func2</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">7</span></span>
<span class="line"><span style="color:#A6ACCD;">......</span></span>
<span class="line"><span style="color:#A6ACCD;">funcmain  </span><span style="color:#F78C6C;">998992</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">funcmain  </span><span style="color:#F78C6C;">999993</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">main </span><span style="color:#F78C6C;">994</span></span>
<span class="line"><span style="color:#A6ACCD;">main </span><span style="color:#F78C6C;">995</span></span>
<span class="line"><span style="color:#A6ACCD;">main </span><span style="color:#F78C6C;">996</span></span>
<span class="line"><span style="color:#A6ACCD;">main </span><span style="color:#F78C6C;">997</span></span>
<span class="line"><span style="color:#A6ACCD;">main </span><span style="color:#F78C6C;">998</span></span>
<span class="line"><span style="color:#A6ACCD;">main </span><span style="color:#F78C6C;">999</span></span></code></pre></div></div>`,3),e=[o];function t(c,r,y,C,i,D){return n(),a("div",null,e)}const f=s(p,[["render",t]]);export{F as __pageData,f as default};
