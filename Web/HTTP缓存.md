---
layout: doc
outline: deep
---



# HTTP中的强缓存与协商缓存

## 浏览器缓存机制

当我们在浏览器中输入一个网址的时候，浏览器会根据URL去请求服务器以获取所需要的数据资源，这一过程可能会导致页面有一段白屏时间，这是因为浏览器需要等待服务器返回数据，而这个过程中，浏览器是处于等待状态的，这样就会导致页面的白屏时间变长，用户体验变差。

因此，当我们需要提高用户体验的时候，我们就可以使用一些缓存技术，如：DNS缓存、CDN缓存、HTTP缓存等，良好的缓存策略可以降低重复资源的请求，降低服务器的开销，提升用户的页面加载速度。

## HTTP缓存

### 基本原理

HTTP缓存是指浏览器在第一次请求服务器资源时，服务器会在响应头中添加一些字段，这些字段会告诉浏览器如何处理这些资源，浏览器会根据这些字段来判断是否需要缓存这些资源，以及缓存多长时间，当浏览器再次请求这些资源时，会根据这些字段来判断是否需要使用缓存。

HTTP缓存分为强缓存和协商缓存，强缓存是指浏览器不需要发送请求到服务器，而是直接从本地缓存中获取资源，协商缓存是指浏览器会发送请求到服务器，由服务器来判断是否使用缓存。

### 强缓存 🦸

强缓存是指浏览器在第一次请求服务器资源时，服务器会在响应头中添加`Cache-Control`和`Expires`字段，这两个字段会告诉浏览器如何处理这些资源，浏览器会根据这些字段来判断是否需要缓存这些资源，以及缓存多长时间，当浏览器再次请求这些资源时，会根据这些字段来判断是否需要使用缓存。

#### 强缓存相关字段

##### 1. pragma

`pragma`是HTTP/1.1之前遗留的通用首部字段，只有`no-cache`这一可选值，当`no-cache`存在时，一定不会命中强缓存。

##### 2. Cache-Control

`Cache-Control`是HTTP/1.1中用来控制缓存的字段，它可以设置多个值，每个值之间用逗号隔开，常用的值有：

- `public`：表示资源可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存。
- `private`：表示资源只能被发送请求的客户端缓存，不能被代理服务器（CDN）缓存。
- `no-cache`：表示资源可以被缓存，但是每次在使用缓存资源时，都需要向服务器发送请求，由服务器来判断是否使用缓存。
- `no-store`：表示资源不可以被缓存，每次都需要向服务器发送请求。
- `max-age`：表示资源可以被缓存的最大时间，单位为秒。

::: tip

- 'no-cache'并不意味着不可以进行缓存，而是每次在使用缓存资源时，都需要向服务器发送请求，由服务器来判断缓存是否有效，有效才会使用缓存（`协商缓存`） - 'no-store'才表示不可以进行缓存
- `Chrome`强制刷新(`Ctrl+F5`)的实现方式为，在请求的首部添加`pragma: no-cache`与`cache-control: no-cache`实现

​	![image-20230501214334004](/image-20230501214334004.png)

- `max-age`的值为非0或设置了大于请求日期的`Expires`才可能命中强缓存，并且只有`cache-control`不存在`no-cache`/`no-store`以及`pragma`的时候，才会命中强缓存
- `max-age=0`的时候，与`cache-control: no-cache`效果类似

:::

##### 3. Expires

`Expires`是一个响应头字段，只有当`Expires`日期前的时候，HTTP缓存有效。并且当`cache-control`含`max-age`的时候，该字段被忽略。



### 弱缓存（协商缓存）🕵️

#### 弱缓存相关字段

##### 1. Last-Modified/If-Modified-Since

​	`If-Modified-Since`是请求头中的一个字段（只能用于`GET`与`Head`请求），而`Last-Modified`是响应头中的一个字段。当带着`If-Modified-Since`的请求发送给服务器的时候，服务器将检查`Last-Modified`，如果`Last-Modified`早于或等于`If-Modified-Since`，则返回`304`响应，否则重新返回新的资源。

##### 2. ETag/If-None-Match

​	`If-None-Match`是请求头的一个字段，`ETag`是响应头的一个字段，它是根据资源的内容生成的一段`Hash`值。当带着`ETag`的请求发送到服务器的时候，服务器会寻找与之匹配的资源，如果有则返回`304`响应，否则返回`200`响应与新的资源。



::: tip 为什么需要ETag

1. 在没有修改文件内容的情况下，文件最后修改日期可能会变，会导致不必要的请求
2. 当某些文件在==1秒==内进行了修改，`Last-Modified`可能监测不到
3. 某些服务器无法精确获取到文件的修改日期

:::



### 启发式缓存

​	当一个网络请求没有`expires`也没有`cache-control`，但是有`last-modified`的时候,浏览器会有一个默认的缓存策略:

`(currentTime - Last-Modified) * 0.1`



[HTTP Heuristic Caching (Missing Cache-Control and Expires Headers) Explained](https://paulcalvano.com/2018-03-14-http-heuristic-caching-missing-cache-control-and-expires-headers-explained/)



### 缓存总流程

![整体流程](/161233e6685e5e73tplv-t2oaga2asx-zoom-in-crop-mark4536000.webp)





::: details 举个例子🌰

第一次访问本页的时候：

![第一次请求资源](/image-20230501213045868.png)

可以看到响应头有`Cache-Control: no-cache`以及`ETag`与`Last-Modified`，说明，此时为协商缓存。

第二次发送请求的时候，将会比对请求头中的`If-None-Match`与`If-Modified-Since`字段。



![image-20230501233831904](/image-20230501233831904.png)

可以看到，此时`If-None-Match`与`ETag`是匹配的，`If-Modified-Since`也符合`Last-Modified`的要求，因此，服务器返回`304`响应，允许使用本地缓存。

:::



::: info 附

### 状态码区别

- `200` 请求成功，服务器返回全新的资源
- `200` `from memory cache / from disk cache` 本地强缓存还在有效期，直接使用本地缓存。 其中，`from memory cache`表示页面刷新的时候，从内存中获取缓存，`from disk cache`表示标签页关闭后从磁盘获取缓存
- `304` 请求成功，服务器判断`ETag`与`Last-Modified`没有过期，告知浏览器使用本地缓存



### 缓存优先级

​	`oragma > cache-control > expires > Etag > Last-Modified`

:::
