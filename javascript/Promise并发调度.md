# Promise并发调度

::: info 题目

实现一个`scheduler`，能对`Promise`的并发数量进行控制。补充下面的代码：

```js
class Scheduler {
    // ...
}

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

const scheduler = new Scheduler(2);

const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(()=>{ console.log(order); }) );
}

addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4);

scheduler.start();

// 输出：2 3 1 4
```

:::



**1. 先写构造函数**

​	首先看`timeout`，`timeout`最终返回一个`Promise`对象，然后在`addTask`中被调用，`addTask`往调度器`scheduler`中添加的是一个`function`，该函数经过`time`后返回一个`status=fulfilled`的`Promise`对象。

​	考虑到`Promise`自带控制并发的`Promise.all`与`Promise.race`都不能满足限制个数的并发，因此需要换一个考虑的方式。我的思路是，`Scheduler`中使用队列存储所有的`Task`即`addTask`中的箭头函数，每次执行队列中的第一个`Task`，只要有一个`Task`执行成功，就下一`Task`出队并且执行。但是需要保证的是，一次性在队列外执行的`Task`的数量需要少于`limit`，可以使用`running`来表示运行中的`Task`，即`limit >= running`即可。

```js
class Scheduler {
	constructor(limit) {
        this.limit = limit;
        this.running = 0;
        this.tasklist = new Array();
    }
    
    // ...
}
```

**2. 然后看`add`函数**

​	`add`比较简单直接全部入队等待处理就好,task是一个`function`，该函数经过`time`后`返回一个status=fulfilled`的`Promise`对象。

```js
class Scheduler {
    // constructor(){}
    add(task) {
        this.tasklist.push(task);
    }
}
```

**3. `start`函数**

​	`start`表示入队后做什么，入队后当然是需要把队列中的`funciton`执行，那么这里当然是选择`limit`个`task`执行。并且需要考虑如何执行呢？首先，把`tasklist`当做是等待执行队列，`shift`出来的`task`就是执行中的队列了，每次`shift`后，`running++`表示运行中`task`的数量加一，如果`running === limit`就暂停出队，当然，队列为空也不可能出队。这里把执行的逻辑交给一个新的函数`run`，`start`只需要控制初始条件下`run`的个数即可。

```js
class Scheduler {
    // constructor(){}
    // add(){}
    start() {
        let n = this.limit;
        // 这里也可以写成for形式，while形式不可以直接this.limit--，因为limit需要保持不变
        while(n--) {
            this.run();
        }
    }
    run() {
        // 上面已经比较清晰了，不run的条件就是队空或者running达到limit
        if(!this.tasklist.length || this.running >= this.limit) return;
        // task退出等待队列开始运行，因此运行中的个数增加
        const task = this.tasklist.shift();
        this.running++;
        // 注意task是一个函数，返回一个Promise，因此返回新的Promise后，onFulfilled后运行下一个task就好，即在then里面this.run()
        task().then(() => {
            // 当前任务运行完成，下一个任务准备运行，运行中任务数量减少
            this.running--;
            this.run();
        })
    }
}
```

至此，本题完毕。



**4. 代码总结**

```js
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.tasklist = new Array();
    this.running = 0;
  }

  add(task) {
    this.tasklist.push(task);
  }

  start() {
    for (let i = 0; i < this.limit; i++) {
      this.run();
    }
  }

  run() {
    if (!this.tasklist.length || this.running >= this.limit) return;
    this.running++;
    const task = this.tasklist.shift();
    task().then(() => {
      this.running--;
      this.run();
    });
  }
}

// 定时任务
const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

// 实例化调度器
const scheduler = new Scheduler(2);

// 添加任务
const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
};


// 最后结果测试：2 3 1 4
```

