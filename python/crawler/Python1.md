---
layout: doc
outline: deep
---

# Python爬虫 - 基础

## 一些关键信息

### 请求头的关键信息

1. `User-Agent`：请求载体的身份识别。（用什么发的请求）

2. `Referer`：防盗链。（请求的页面来源）

3. `Cookie`：本地字符串数据信息。（用户登录信息，反爬的token）

### 请求方式

1.`get`

2.`post`

### 响应头的关键信息

1.`Cookie`：本地字符串数据信息。（用户登录信息，反爬的token）

2.一些奇怪的字符串（一般是token字样，防止攻击和反爬）



## 得到页面源代码可用库:

```python
import requests

#from urllib.request import urlopen 
```

### `urlopen`用法

```python
url = 'https://www.baidu.com'
resp = urlopen(url)
print(resp.read().decode('utf-8'))#用utf-8解码得到页面源代码
```

### `request`库用法

```python
url = 'https://www.baidu.com/s'
#请求头关键信息,可通过f12查看
headers = {
	'User-Agent':''
	'Cookie':''
	'Referer':''
}
params = {
    'wd' : 'python'
}
#连接在url后方的:如www.baidu.com/s?
resp = requests.get(url, params=params, headers=headers)
resp.encoding = 'utf-8'#将resp的编码改为utf-8
print(resp.text) #得到页面源代码
print(resp.url) #得到页面的url连接，当前为https://www.baidu.com/s?wd=python
```





