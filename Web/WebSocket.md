# WebSocket

## 1. 什么是WebSocket

- 有状态的持久连接
- 服务端主动推送消息
- 用WebSocket发送信息比HTTP延迟低

::: details 一个🌰
::: code-group

```js [服务端代码]
const { WebSocketServer } = require('ws');
    
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});
```
```js [客户端代码]
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
   // 当建立连接的时候，向客户端发送一条信息
    ws.send('something');
});

ws.on('message', function message(data) {
   // 当收到来自服务端的消息的时候，打印出来
    console.log(`received: ${data}`);
});
```


:::



客户端在`HTTP`请求头增加：`Connection: Upgrade`+`Upgrade: Websocket`

服务端在接受请求后，返回`101 Switching Protocols`响应
