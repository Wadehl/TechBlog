# 柯里化

:::info 定义
函数柯里化是一种将接受多个参数的函数转换为接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术
:::

```js
function curry(fn){
    return function curried(...args) {
        // curried的参数个数>=柯里化前的函数的参数个数
        // 说明所有的参数已经被传入
        if(args.length>=fn.length) {
            // 直接调用原始函数返回结果
            return fn.apply(this, args);
        } else {
            // args为当前调用的新参数
            return function(...args2) {
                // 继续调用curried自身，由于参数需要按顺序传入，所以由args连接args2
                return curried.apply(this, args.concat(args2));
            }
        }
    }
}

function add(a,b,c) {
    return a+b+c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); //6
console.log(curriedAdd(1,2)(3)); //6
console.log(curriedAdd(1)(2,3)); //6
```

