# Lazy Man

## 题目描述

实现一个LazyMan
要求如下：

```js
LazyMan('Tony).eat('
lunch
').sleep(10).eat('
dinner
');
// 输出：
//  Hi I am Tony
//  Eat lunch
//  Wait for 10 seconds
//  Wake up after 10 seconds
//  Eat dinner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// 输出：
//  Wait for 5 seconds
//  Wake up after 5 seconds
//  Hi I am Tony
//  Eat lunch
//  Eat dinner
//  Wait for 10 seconds
//  Wake up after 10 seconds
//  Eat junk food

```

## 实现

### 链式调用的实现

所谓链式调用，就是返回一个对象，这个对象可以继续调用方法，直到调用结束，而这里，其实返回的对象就是一个与自己一样的LazyMan，即`return this`
，并且，每个方法都要返回一个`this`

我们可以写出以下代码：

```js
function LazyMan(name) {
  this.name = name;

  this.eat = function () {
    return this;
  };
  this.sleep = function () {
    return this;
  };
  this.sleepFirst = function () {
    return this;
  };
  return this;
}
```

### 执行顺序的考虑

那么现在，我们观察一下执行顺序，我们可以看到：`sleepFirst`会优于其他所有方法执行，而`sleep`会暂时中断其他方法的执行
我们考虑到，延迟执行方法依赖于`setTimeout`，而`setTimeout`
又是一个宏任务，他会在当前宏任务执行后，才能继续执行，所以`sleepFirst`与`sleep`
在同一个宏任务内的话，一定是最后执行的，就不满足题意了，而且`sleepFirst`还需要优先于所有方法执行
这让我们想到了，我们其实可以先将所有要执行的方法存起来，然后按照一定的顺序排序后依次执行，这样就可以满足题意了

那么其实我们可以用一个队列实现，普通的任务我们按执行顺序存入队列，而`sleepFirst`
的任务我们按照优先级存入队列，然后依次执行即可，并且每个方法里面都应该是一个任务，即函数，用于存储到队列中，并且需要注意一下`this`的指向问题
尝试写一下代码：

```js
function LazyMan(name) {
  this.name = name;
  this.queue = [];
  const fn = function () {
    console.log(`Hi I am ${name}`);
  };
  this.queue.push(fn); // 先将第一个任务存入队列
  this.eat = function (food) {
    const fn = () => {
      console.log(`Eat ${food}`);
    };
    this.queue.push(fn); // 因为按顺序执行，全部进入队尾
    return this;
  };
  this.sleep = function (delay) {
    const fn = () => {
      console.log(`Wait for ${delay} seconds`);
      setTimeout(() => {
        console.log(`Wake up after ${delay} seconds`);
      }, delay * 1000);
    };
    this.queue.push(fn); // sleep也是按照顺序执行，所以进入队尾
    return this;
  };
  this.sleepFirst = function (delay) {
    const fn = () => {
      console.log(`Wait for ${delay} seconds First`);
      setTimeout(() => {
        console.log(`Wake up after ${delay} seconds`);
      }, delay * 1000);
    };
    this.queue.unshift(fn); // sleepFirst是优先级最高的，所以进入队首
    return this;
  };
  return this;
}
```

到目前为止，我们已经成功在每一次调用方法的时候，都在对应的队列中按照执行顺序添加好了任务，现在还差最后一步，那就是如何执行队列中的任务了。这里我们使用一个`next`
函数实现，每次当前任务执行完成后，都调用`next`直至队列为空，即在任务中执行`next`方法，代码如下：

```js
function LazyMan(name) {
  this.name = name;
  this.queue = [];
  const fn = () => {
    console.log(`Hi I am ${name}`);
    this.next();
  };

  this.next = function () {
    if (this.queue.length) {
      const fn = this.queue.shift();
      fn && fn();
    }
  };

  this.queue.push(fn); // 先将第一个任务存入队列
  this.eat = function (food) {
    const fn = () => {
      console.log(`Eat ${food}`);
      this.next();
    };
    this.queue.push(fn); // 因为按顺序执行，全部进入队尾
    return this;
  };
  this.sleep = function (delay) {
    const fn = () => {
      console.log(`Wait for ${delay} seconds`);
      setTimeout(() => {
        console.log(`Wake up after ${delay} seconds`);
        this.next();
      }, delay * 1000);
    };
    this.queue.push(fn); // sleep也是按照顺序执行，所以进入队尾
    return this;
  };
  this.sleepFirst = function (delay) {
    const fn = () => {
      console.log(`Wait for ${delay} seconds First`);
      setTimeout(() => {
        console.log(`Wake up after ${delay} seconds`);
        this.next();
      }, delay * 1000);
    };
    this.queue.unshift(fn); // sleepFirst是优先级最高的，所以进入队首
    return this;
  };
  return this;
}
```

最后，就剩下最初的`start`的，我们只需要在构造中调用`this.next`即可，但是这里还是需要注意一个问题，就是`next`执行的时机问题，我们需要在所有方法执行完毕后，再执行`next`
因此，只需要把`next`放到下个宏任务中执行即可

## 最终代码

<iframe src="https://stackblitz.com/edit/js-7cgw7k?devToolsHeight=33&embed=1&file=index.js&theme=dark&view=both" style="width: 100%; height: 1200px;"></iframe>
