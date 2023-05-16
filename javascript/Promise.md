---
layout: doc
outline: deep
---



# Promise关键代码实现

## 基础逻辑实现

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

if (typeof module !== "undefined" && module.exports) {
  // 在 Node.js 环境中
  module.exports = MyPromise;
}
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

if (typeof module !== "undefined" && module.exports) {
  // 在 Node.js 环境中
  module.exports = MyPromise;
}
```

``` js [test.js]
const MyPromise = require("./myPromise");

const promise = new MyPromise((resolve, reject) => {
    // resolve("成功"); // 输出 onFulfilled 成功
  reject("失败"); // 输出 onRejected 失败
});

promise.then(
  (res) => {
    console.log(`onFulfilled ${res}`);
  },
  (err) => {
    console.log(`onRejected ${err}`);
  }
);
```

:::



## 加入异步逻辑

现在调用的方式改为`setTimeout`异步的方式

```js
const MyPromise = require("./myPromise");

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve("成功");
    reject("失败");
  });
});

promise.then(
  (res) => {
    console.log(`onFulfilled ${res}`);
  },
  (err) => {
    console.log(`onRejected ${err}`);
  }
);
```

此时发现，输出为空。

- 原因在于：`then`是同步方法，调用`then`的时候，`setTimeout`作为宏任务还没有执行，那么`promise.status === Pending`，既不会走`onFulfilled`也不会走`onRejected`。

- 解决方法：因此，我们只需要在`then`添加新的逻辑，当状态仍为`Pending`的时候单独处理，存储`onFulfilled`与`onRejected`作为回调的函数`callback`，当转换状态的时候，执行对应的回调函数`onFulfilledCallback/onRejectedCallback`

```js
// MyPromise.js // [!code focus]

// ...
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
    
  // 存储成功/失败的回调函数
  onFulfilledCallback = null; // [!code focus]
  onRejectedCallback = null; // [!code focus]

  resolve = (res) => {
    // 如果成功且状态为PENDING
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.res = res;
      // 如果有成功的回调函数就执行  // [!code focus]
      this.onFulfilledCallback && this.onFulfilledCallback(res); // [!code focus]
    }
  };
  reject = (err) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.err = err;
      // 如果有失败的回调函数就执行  // [!code focus]
      this.onRejectedCallback && this.onRejectedCallback(err); // [!code focus]
    }
  };

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.res);
    } else if (this.status === REJECTED) {
      onRejected(this.err);
    } else if (this.status === PENDING) { // [!code focus]
      this.onFulfilledCallback = onFulfilled; // [!code focus]
      this.onRejectedCallback = onRejected; // [!code focus]
    } // [!code focus]
  }
}

if (typeof module !== "undefined" && module.exports) {
  // 在 Node.js 环境中
  module.exports = MyPromise;
}
```

## 多次调用then

::: details 两个🌰

::: code-group

```js [同步多次调用]
const MyPromise = require("./myPromise");

const promise = new MyPromise((resolve, reject) => {
  resolve("成功");
});

promise.then(
  (res) => {
    console.log(`onFulfilled ${res}`);
  },
  (err) => {
    console.log(`onRejected ${err}`);
  }
);

promise.then(
  (res) => {
    console.log(`onFulfilled 2`);
  },
  (err) => {
    console.log(`onRejected 2`);
  }
);

// 输出：
// onFulfilled 成功
// onFulfilled 2
```

```js [异步多次调用]
const MyPromise = require("./myPromise");

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("失败");
  });
});

promise.then(
  (res) => {
    console.log(`onFulfilled ${res}`);
  },
  (err) => {
    console.log(`onRejected ${err}`);
  }
);

promise.then(
  (res) => {
    console.log(`onFulfilled 2`);
  },
  (err) => {
    console.log(`onRejected 2`);
  }
);

// 输出：
// onFulfilled 2
```

:::

可以发现，当任务为同步的时候，是可以按`then`的调用顺序依次执行的，但是异步`resolve`的时候，却不可以了。

- 原因在于：
  - 当同步的时候，`promise`的状态已经是`FULFILLED`了，当第二个`then`任务的时候，会直接继续执行`FULFILLED`状态的逻辑。
  - 而异步`resolve/reject`的时候，由于之前使用的是`onFulfilledCallback/onRejectedCallback`存储回调任务，但是由于使用的是单个变量，而第二个`then`会覆盖第一个`then`的回调函数，在第二次宏任务队列的时候，该回调函数才会被调用。
- 解决方法：
  - 究其原因，就是`onCallback`的数据结构采用的不对，可以使用队列存储所有的回调函数，当`resolve/reject`的时候，按顺序出队并且进行调用即可。

```js
// MyPromise.js // [!code focus]
// ...
class MyPromise {
  // ...

  // 存储成功/失败的回调函数
  onFulfilledCallbackQueue = new Array(); // [!code focus]
  onRejectedCallbackQueue = new Array(); // [!code focus]

  resolve = (res) => {
    // 如果成功且状态为PENDING
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.res = res;
      // 如果有成功的回调函数就执行  // [!code focus]
      while (this.onFulfilledCallbackQueue.length > 0) { // [!code focus]
        this.onFulfilledCallbackQueue.shift()(res); // [!code focus]
      } // [!code focus]
    }
  };
  reject = (err) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.err = err;
      // 如果有失败的回调函数就执行  // [!code focus]
      while (this.onRejectedCallbackQueue.length > 0) { // [!code focus]
        this.onRejectedCallbackQueue.shift()(err); // [!code focus]
      } // [!code focus]
    }
  };

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.res);
    } else if (this.status === REJECTED) {
      onRejected(this.err);
    } else if (this.status === PENDING) { 
      this.onFulfilledCallbackQueue.push(onFulfilled); // [!code focus]
      this.onRejectedCallbackQueue.push(onRejected); // [!code focus]
    } 
  }
}

// 此时，输出可以按then的调用顺序执行 // [!code focus]
```

## 链式调用then

::: danger 

`Node`环境下输出结果有问题。

:::

::: tip

想要实现链式调用`then`，就需要每次调用后，都返回一个含有`then`方法的`类`，在这里需要每次调用后返回一个`MyPromise`对象，并且需要判断新对象的状态。

:::

### 1. 可链式调用

```js
// MyPromise.js // [!code focus]
// ...
class MyPromise {
    // ...
    then(onFulfilled, onRejected) { // [!code focus]
        return new MyPromise((resolve, reject) => { // [!code focus]
          if (this.status === FULFILLED) {
            onFulfilled(this.res);
          } else if (this.status === REJECTED) {
            onRejected(this.err);
          } else if (this.status === PENDING) {
            this.onFulfilledCallbackQueue.push(onFulfilled);
            this.onRejectedCallbackQueue.push(onRejected);
          }
        }); // [!code focus]
    } // [!code focus]
}

promise = new MyPromise((resolve, reject)=>{setTimeout(()=>{resolve(1);});}); // [!code focus]
promise.then((res)=>{console.log(res); return 2;}).then((res)=>{console.log(res);}) // [!code focus]
// 已经能够执行，但是没有调用第二个then的方法  // [!code focus]
// 输出：1 // [!code focus]
```

### 2. 处理前一个`then` 的返回值（值为`非Promise`）

```js
// MyPromise.js // [!code focus]
// ...
class MyPromise {
    // ...
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
          if (this.status === FULFILLED) {
            // 获取onFulfilled的返回值 // [!code focus]
            const x = onFulfilled(this.res); // [!code focus]
            resolve(x); // [!code focus]
          } else if (this.status === REJECTED) {
            onRejected(this.err);
          } else if (this.status === PENDING) {
            this.onFulfilledCallbackQueue.push(onFulfilled);
            this.onRejectedCallbackQueue.push(onRejected);
          }
        });
    }
}

promise = new MyPromise((resolve, reject)=>{setTimeout(()=>{resolve(1);});}); // [!code focus]
promise.then((res)=>{console.log(res); return 2;}).then((res)=>{console.log(res);}) // [!code focus]
// 输出：1 2 // [!code focus]
```

### 3. 值为`Promise`的情况

::: tip

如果在 `then` 方法中返回一个新的 `Promise` 对象，那么下一个 `then` 方法会等待这个新的 `Promise` 对象完成，并且会将其结果作为参数传递给下一个 `then` 方法。

:::

```js
// MyPromise.js // [!code focus]
// ...
class MyPromise {
    // ...
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
          if (this.status === FULFILLED) {
            const x = onFulfilled(this.res); // [!code focus]
            if(x instanceof MyPromise) { // [!code focus]
                // 如果x是MyPromise类，则等待x执行完后将结果作为下一个then的参数 // [!code focus]
                x.then(resolve, reject); // [!code focus]
            } else { // [!code focus]
               resolve(x); // [!code focus]
            } // [!code focus]
          } else if (this.status === REJECTED) {
            onRejected(this.err);
          } else if (this.status === PENDING) {
            this.onFulfilledCallbackQueue.push(onFulfilled);
            this.onRejectedCallbackQueue.push(onRejected);
          }
        });
    }
}

promise = new MyPromise((resolve, reject)=>{setTimeout(()=>{resolve(1);});}); // [!code focus]
promise.then((res)=>{console.log(res); return new MyPromise((resolve)=>{resolve(2);});}).then((res)=>{console.log(res);}); // [!code focus]
// 输出：1 2 // [!code focus]
```

### 4. 返回值为本身

::: warning

在`Promise`中，如果`then`返回`Promise`实例自身的话会报错。

```js
const promise = new Promise((resolve)=>{resolve(1)});
const p1 = promise.then(()=>{return p1;});

// Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise> // [!code error]
```

在`MyPromise`中，如果`then`返回`MyPromise`实例会怎么样呢？

```js
const promise = new MyPromise((resolve)=>{resolve(1)});
const p1 = promise.then(()=>{return p1;});

// Uncaught ReferenceError: p1 is not defined // [!code error]
```

为什么会出现`p1 not defined`的情况呢，这是因为：在`return p1`的时候，`return new MyPromise`尚未执行成功，此时自然是没有`p1`的。

:::

- 在`return new MyPromise`后，再执行内部的方法

  可以将`then`内的逻辑变为一个``微任务``，这个`微任务`在`return`后再执行，考虑使用`queueMicrotask API`实现。

  ```js
  // MyPromise.js // [!code focus]
  // ...
  class MyPromise {
      // ...
      then(onFulfilled, onRejected) {
      return new MyPromise((resolve, reject) => {
        if (this.status === FULFILLED) {
          queueMicrotask(() => { // [!code focus:8]
            const x = onFulfilled(this.res);
            if (x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          });
        } else if (this.status === REJECTED) {
          onRejected(this.err);
        } else if (this.status === PENDING) {
          this.onFulfilledCallbackQueue.push(onFulfilled);
          this.onRejectedCallbackQueue.push(onRejected);
        }
      });
    }
  }
  ```

- 判断返回值是否为自身，如果是，则抛出错误`Type Error: ...`

  ```js
  // MyPromise.js // [!code focus]
  // ...
  class MyPromise {
      // ...
      then(onFulfilled, onRejected) {
      const promise2 = new MyPromise((resolve, reject) => { // [!code focus:15]
        if (this.status === FULFILLED) {
          queueMicrotask(() => {
            const x = onFulfilled(this.res);
            if (x === promise2) { // [!code ++:5]
              return reject( 
                new TypeError("Chaining cycle detected for promise #<Promise>")
              );
            }
            if (x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          });
        } else if (this.status === REJECTED) {
          onRejected(this.err);
        } else if (this.status === PENDING) {
          this.onFulfilledCallbackQueue.push(onFulfilled);
          this.onRejectedCallbackQueue.push(onRejected);
        }
      });
      return promise2;
    }
  }
  
  const promise = new MyPromise((res)=>res(1)); // [!code focus:4]
  const p1 = promise.then(()=>p1);
  p1.then(console.log,console.error);
  // TypeError: Chaining cycle detected for promise #<Promise> // [!code error]
  ```

  

## 捕获报错转为`rejected`状态

### 1. 执行器有错误捕获

```js
// MyPromise.js // [!code focus]
class MyPromise {
    constructor(executor) {
        try { // [!code focus:4]
          executor(this.resolve, this.reject);
        } catch (err) {
          this.reject(err);
        }
    }
}

const promise = new MyPromise((resolve, reject) => { // [!code focus:4]
    throw new Error('a new error!');
}); 
promise.then(console.log,console.error); // Error: a new error!
```

### 2. `then`执行有错误并捕获

```js
// MyPromise.js // [!code focus]
// ...
class MyPromise {
    // ...
    then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => { 
      if (this.status === FULFILLED) {
      	queueMicrotask(() => { // [!code focus:17]
          try{
            const x = onFulfilled(this.res);
            if (x === promise2) {
              return reject(
                new TypeError("Chaining cycle detected for promise #<Promise>")
              );
            }
            if (x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === REJECTED) {
        onRejected(this.err);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbackQueue.push(onFulfilled);
        this.onRejectedCallbackQueue.push(onRejected);
      }
    });
    return promise2;
  }
}

const promise = new MyPromise((res, rej)=>res(1)); // [!code focus:4]
promise.then((res)=>{console.log(res);throw new Error('another new error!')}).then(console.log, console.error);
// 1
// TypeError: Chaining cycle detected for promise #<Promise> // [!code error]
```



## 参数`onFulfilled/onRejected`可选

::: tip

为`onFulfilled/onRejected`添加默认值即可。

- `onFulfilled`不存在，那么默认为将已有结果返回给下一个`then`

- `onRejected`不存在，那么默认为将已有的错误继续抛出给下一个`then`	

:::

```js
// MyPromise.js // [!code focus]
// ...
class MyPromise {
    // ...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : res => res;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };
    	const promise2 = new MyPromise((resolve, reject) => { 
      	// ...
        }
  	}
}

const promise = new MyPromise((res, rej)=>res(1)); // [!code focus:4]
const promise2 = new MyPromise((res,rej)=>{ throw new Error('3rd error!'); });
promise.then().then((res)=>{console.log(res);}); // 1
promise2.then().then(console.log, console.error); // Error: 3rd error!
```



## 实现`Promise.resolve()/Promise.reject()`静态方法

```js
// MyPromise.js
// ...
class MyPromise {
    // ...
    static resolve(value) {
        if(value instanceof MyPromise) {
            return value;
        } else {
            return new MyPromise((resolve) => {
                resolve(value);
            })
        }
    }
    static reject(err) {
        return new MyPromise((_resolve, reject) => {
            reject(err);
        })
    }
}

MyPromise.resolve(1); // MyPromise {res: 1, status: 'fulfilled', ...}
MyPromise.resolve(new MyPromise((resolve)=>{resolve(2);})); // MyPromise {res: 2, status: 'fulfilled', ...}
MyPromise.reject(new Error(3)); // MyPromise {err: 3, status: 'rejected', ...}
```



::: details 完整代码

```js
// MyPromise.js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    } else {
      return new MyPromise((resolve) => {
        resolve(value);
      });
    }
  }

  static reject(err) {
    return new MyPromise((_resolve, reject) => {
      reject(err);
    });
  }

  // 存储成功的参数
  res = null;
  // 存储失败的参数
  err = null;
  // 初始状态
  status = PENDING;

  // 存储成功/失败的回调函数
  onFulfilledCallbackQueue = new Array();
  onRejectedCallbackQueue = new Array();

  resolve = (res) => {
    // 如果成功且状态为PENDING
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.res = res;
      // 如果有成功的回调函数就执行
      while (this.onFulfilledCallbackQueue.length > 0) {
        this.onFulfilledCallbackQueue.shift()(res);
      }
    }
  };
  reject = (err) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.err = err;
      // 如果有失败的回调函数就执行
      while (this.onRejectedCallbackQueue.length > 0) {
        this.onRejectedCallbackQueue.shift()(err);
      }
    }
  };

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (res) => res;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.res);
            if (x === promise2) {
              return reject(
                new TypeError("Chaining cycle detected for promise #<Promise>")
              );
            }
            if (x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === REJECTED) {
        onRejected(this.err);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbackQueue.push(onFulfilled);
        this.onRejectedCallbackQueue.push(onRejected);
      }
    });
    return promise2;
  }
}

if (typeof module !== "undefined" && module.exports) {
  // 在 Node.js 环境中
  module.exports = MyPromise;
}
```

:::