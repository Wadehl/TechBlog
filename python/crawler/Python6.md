---
layout: doc
outline: deep
---

# Xpath模块

```python
from lxml import html
etree = html.etree
```

## 使用到的HTML文件:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <titile>title</titile>
</head>
<body>
    <ul>
        <li><a href="https://www.baidu.com">百度</a></li>
        <li><a href="https://www.google.com">谷歌</a></li>
        <li><a href="https://www.sougou.com">搜狗</a></li>
    </ul>
    <ol>
        <li><a href="feiji">飞机</a></li>
        <li><a href="dapao">大炮</a></li>
        <li><a href="huoche">火车</a></li>
    </ol>
    <div class="job">李嘉诚</div>
    <div class="common">胡辣汤</div>
</body>
</html>
```

## 一个小样例：

```python
from lxml import html

tree = html.etree.parse("b.html")
# result = tree.xpath('/html')
# result = tree.xpath('/html/body/ul/li/a/text()')     # xpath索引从1开始

# result = tree.xpath('/html/body/ol/li[2]/a/text()')	# 指取该标签的内容
result = tree.xpath('/html/body/ol/li/a[@href="dapao"]/text()')  
# @href表示属性href等于双引号内内容
print(result)

li_list = tree.xpath('/html/body/ol/li')
for li in li_list:
    tex = li.xpath('./a/@href')		# 指取属性href的值
    print(tex)

print(tree.xpath('/html/body/div[1]/text()'))
```

可以通过浏览器控制台的功能快速得到xpath

## 一个实例

```python
"""
2022.7.12 Kevin
猪八戒网 Xpath 爬虫
"""
from lxml import html
import requests

etree = html.etree
url = 'https://beijing.zbj.com/search/shop/?type=new&kw=saas'
resp = requests.get(url)

html = etree.HTML(resp.text)

divs = html.xpath('//*[@id="__layout"]/div/div[3]/div/div[3]/div[4]/div[1]/div')
for div in divs:
    name = div.xpath('./div[1]/div/div/a/div/div/div/div[1]/div[1]/div[2]/div[1]/text()')
    if len(name) != 0:
        com_name = name[0]
    else:
        com_name = "no info"
    city = div.xpath('./div[1]/div/div/a/div/div/div/div[1]/div[1]/div[2]/div[2]/text()')
    price = div.xpath('./div/div/div/a[@target="_blank"]/div/div/div/div[1]/div[2]/div/div/text()')
    com_good = div.xpath('.//div[1]/div/div/a/div/div/div/div[2]/div[2]/text()')
    if len(city) != 0:
        city_name = (city[2][5:-1])
    else:
        city_name = "no info"
    print(com_name, city_name, com_good[0], price[0])   # 公司名、所处城市、擅长、平均成交价格
```

