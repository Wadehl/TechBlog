# AJAX

::: info 什么是AJAX
AJAX 全称为 `Asynchronous JavaScript and XML`，即异步的 JavaScript 和 XML。它是一种通过在后台与服务器进行异步数据交互的技术，可以在不刷新页面的情况下获取数据并进行展示。
:::

###### 以下是手工实现AJAX的一个方法:

```typescript
interface AjaxOptions {
  method?: string;
  url: string;
  headers?: { [key: string]: string };
  success(responseText: string): void;
  error?(status: number): void;
  showLoading?: boolean;
}


function _ajax(options: AjaxOptions) {
  // 创建XMLHttpRequest对象
  const xhr = new XMLHttpRequest();
    
  // 设置回调函数
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // 成功处理响应数据
      options.success(xhr.responseText);
    } else {
      // 处理错误情况
      options.error && options.error(xhr.status);
    }
  };
    
  // 设置请求方式和请求地址
  xhr.open(options.method ?? "GET", options.url, true);
    
  // 设置请求头信息
  if (options.headers) {
    for (const key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
  }
    
  // 发送请求
  xhr.send();
    
  if(options.showLoading) {
    // 显示loading
  }
}


// 一个使用示例
_ajax({
    method: "POST",
    url: "http://www.baidu.com",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx"
    },
    success(responseText) {
        console.log(responseText);
    },
    error(status) {
        // 根据status作相应提示
    },
    showLoading: true
});
```

