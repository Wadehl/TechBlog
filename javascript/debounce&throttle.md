# 防抖与节流

## 1. 防抖

​	触发一个事件的时候，该事件不会立刻执行，而是等待n秒后再执行，若此时事件再次被触发，那么定时器会被重置，重新等待n秒后才执行，即只会执行最后一次被触发的事件。

:::tip 使用场景
用户搜索输入完毕再发送请求；手机号、邮箱验证输入检测；窗口resize
:::

```js
const _debounce = function(fn, t) {
    let timer = null;
    return function() {
        clearTimeout(timer);
        const args = arguments;
        setTimeout(function() {
            fn.apply(this, args);
        });
    }
}
```

## 2. 节流

​	当一个事件被触发后，事件将等待n秒后执行，并且这个事件在n秒内都不会再被触发，即事件在n秒内只会触发一次并执行。

:::tip 使用场景
滚动加载；搜索联想
:::

```js
const _throttle = function(fn, t) {
    let timer = null;
    return function() {
        if(timer) return;
        const args = arguments;
        setTimeout(function(){
            fn.apply(this, args);
            timer = null;
        },t);
    }
}
```

