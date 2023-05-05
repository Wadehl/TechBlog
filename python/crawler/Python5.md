---
layout: doc
outline: deep
---

# bs模块

> from bs4 import BeautifulSoup

## 解析器

![image-20220712155440694](https://s2.loli.net/2022/07/12/dl8GhTYni5Crgyk.png)

### lxml HTML 解析器下的选择器

#### 标签选择器

•选择元素、获取名称、获取属性、获取内容、嵌套选择、子节点和子孙节点、父节点和祖先节点、兄弟节点

> •soup.prettify()、soup.title.name、soup.head、soup.p.string、soup.p['name']

#### 标准选择器

>•soup.find_all('ul')、find_parents()、find_next_siblings()、find_previous_siblings()
>
>•soup.find('ul')、find_parent()、find_next_sibling()、find_previous_sibling()

#### CSS选择器

> soup.select()、soup.select_one()直接传入选择器参数 [.代表class,#代表id]

```python
soup.select('.panel .panel-heading')
soup.select('ul li')
soup.select('#list-2 .element')
ul = soup.select('ul')[0]
uid = ul['id']
trs = soup.select('table tbody tr')
title = trs[0].select_one('td a').text
```



## 一个样例

```Python
url = ''
resp = requests.get(url)

#解析数据
# 1.把页面源代码交给BeautifulSoup处理，生成bs对象
page = BeautifulSoup(resp.text, "lxml") #指定html解析器
# 2.从bs对象中查找数据
# find(标签,属性=值)
# find_all（标签,属性=值)
# table = page.find("table", class_="hq_table") #class是Python关键字
table = page.find("table", attrs={"class": "hq_table"})  #避免class
```

## 一个实例

```python
"""
2022.7.12 Kevin
优美图库 唯美壁纸 BeautifulSoup解析实例
"""

import requests
from bs4 import BeautifulSoup

url = 'https://www.umei.cc/bizhitupian/weimeibizhi/'
resp = requests.get(url)
resp.encoding = 'utf-8'


page = BeautifulSoup(resp.text, "lxml")
a_list = page.find("ul", class_="pic-list after").find_all("a")
for a in a_list:
    curl = 'https://www.umei.cc'+a.get('href')
    resp2 = requests.get(curl)
    resp2.encoding = 'utf-8'
    page2 = BeautifulSoup(resp2.text, "lxml")
    src = page2.find("section", class_="img-content").find("img").get('src')
    img_name = src.split('/')[-1]   # 以网站图片名字命名图片
    src = requests.get(src)
    with open("img/"+img_name, 'wb') as fw:
        fw.write(src.content)   # 以字节方式写入文件
        print(img_name, "over!")
```

