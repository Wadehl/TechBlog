# 实现instanceof

### instanceof

```js
function _instanceof(obj, constructor) {
    if(typeof constructor !== 'function') {
        return false;
    }
    let proto = Object.getPrototypeOf(obj);
    while(proto) {
        if(proto === constructor.prototype) return true;
        proto = Object.getPrototypeOf(obj);
    }
    return proto;
}
```

