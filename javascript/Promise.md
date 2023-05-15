---
layout: doc
outline: deep
---



# Promise关键代码实现

## 核心逻辑实现

::: tip

`Promise`一共有三种状态`status`：`Pending`,`Fulfilled`以及`Rejected`。

`Promise`初始状态为`PENDING`，如果`Promise`处于`Pending`，`resolve`后，进入`Fulfilled`状态，`reject`则进入`Rejected`状态。

定义完`Promise`类后，`then`方法包含`onFulFilled`与`onRejected`两个回调函数，根据`status`判断。

:::

### 1. 基础结构

```js
// 基础结构 
// const promise = new MyPromise((resolve, reject) => {
// 	resolve('success');
// 	reject('fail');
// });
// MyPromise.js
class MyPromise {
    constructor(executor) {
        executor(resolve, reject);
    }
    resolve = () => {};
    reject = () => {};
}

module.exports = MyPromise;
```

### 2. 状态转换

```js
// 定义三种状态 // [!code focus]
const PENDING = 'pending'; // [!code focus]
const FULFILLED = 'fulfilled'; // [!code focus]
const REJECTED = 'rejected'; // [!code focus]

class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject);
    }
    
    // 存储成功的参数 // [!code focus]
    res = null;	// [!code focus]
    // 存储失败的参数 // [!code focus]
    err = null; // [!code focus]
    // 初始状态 // [!code focus]
    status = PENDING; // [!code focus]
    
    resolve = (res) => { // [!code focus]
        // 如果成功且状态为PENDING // [!code focus]
        if(this.status === PENDING) { // [!code focus]
            this.status = FULFILLED; // [!code focus]
            this.res = res; // [!code focus]
        } // [!code focus]
    }; // [!code focus]
    reject = (err) => { // [!code focus]
        if(this.status === PENDING) { // [!code focus]
        	this.status = REJECTED; // [!code focus]
            this.err = err; // [!code focus]
        } // [!code focus]
    }; // [!code focus]
}
```

### 3. then()方法实现

```js
// 定义三种状态
const PENDING = 'pending'; 
const FULFILLED = 'fulfilled'; 
const REJECTED = 'rejected'; 

class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject);
    }
    
    // ...
    
    then(onFulfilled, onRejected) {  // [!code focus]
        if(this.status === FULFILLED) {  // [!code focus]
            onFulfilled(this.res);  // [!code focus]
        } else if(this.status === REJECTED) {  // [!code focus]
            onRejected(this.err);  // [!code focus]
        }  // [!code focus]
    }  // [!code focus]
}
```



::: details 核心逻辑代码与测试

::: code-group 

```js [MyPromise-1.js]
// 定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  // 存储成功的参数
  res = null;
  // 存储失败的参数
  err = null;
  // 初始状态
  status = PENDING;

  resolve = (res) => {
    // 如果成功且状态为PENDING
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.res = res;
    }
  };
  reject = (err) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.err = err;
    }
  };

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.res);
    } else if (this.status === REJECTED) {
      onRejected(this.err);
    }
  }
}

module.exports = MyPromise;
```

``` js [test.js]
const MyPromise = require("./myPromise");

const promise = new MyPromise((resolve, reject) => {
    // resolve("成功"); // 输出 onFulfilled 成功
  reject("失败"); // 输出 onRejected 失败
});

promise.then(
  (value) => {
    console.log(`onFulfilled ${value}`);
  },
  (reason) => {
    console.log(`onRejected ${reason}`);
  }
);
```



:::