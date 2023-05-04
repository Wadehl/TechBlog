---
layout: doc
outline: deep
---

# 深入浅出Typescript

## 基础类型

1. ### boolean, number, string

2. ### 枚举enum

   ::: code-group

   ```typescript[enum.ts]
   enum Fruit {
       apple, // 0
       orange, // 1
       banana // 2
   }
   
   enum Fruit2 {
       apple2 = 1, // 1
       orange2, // 2
       banana2 = 100, // 100
       watermelon2 // 101
   }
   ```

   ```javascript[enum.js]
   "use strict"
   var Fruit;
   (function (Fruit)) {
    	Fruit[Fruit["apple"] = 0] = "apple";
   	Fruit[Fruit["orange"] = 1] = "orange";
   	Fruit[Fruit["banana"] = 2] = "banana";
   })(Fruit || (Fruit = {}));
   
   var Fruit2;
   (function (Fruit2)) {
    	Fruit[Fruit["apple2"] = 1] = "apple2";
   	Fruit[Fruit["orange2"] = 2] = "orange2";
   	Fruit[Fruit["banana2"] = 100] = "banana2";
   	Fruit[Fruit["watermelon2"] = 101] = "watermelon2";	
   })(Fruit2 || (Fruit2 = {}));
   ```

   :::

   正反映射:information_desk_person:: `Fruit["A"] = 0 <-> Fruit[0] = "A"`， 即`key`与`value`一一对应

3. ### any, unknown, void

   `unknown`是`any`的一个代替类型，`unknown`只能被赋值。

4. ### never

   `never`表示那些永远不会存在的值，标明错误的返回状态。

   ```ts
   function test(x: string | number): boolean {
       if (typeof x === 'string') {
           return true;
       } else if (typeof x === 'number') {
           return false;
       }
       return throwError('参数格式有误');
   }
   
   function throwError(message: string): never {
       throw new Error(message);
   }
   ```

   

5. ### 数据类型 []

6. ### 元组类型 tuple

7. ### 函数类型
   
   定义：TS定义函数类型要定义输入参数类型和返回值类型
   
   输入参数：参数支持可选参数和默认参数
   
   输出参数：输出可以自动推断，也可以定义，没有返回值的时候定义为void
   
   函数重载：名称相同但是参数不同，可以通过重载支持多种类型参数
   
    ```ts
    function add(x: number[]): number 
    function add(x: string[]): string
    function add(x: any[]): any {
        if (typeof x[0] === 'string') {
            return x.join();
        }
        if (typeof x[0] === 'number') {
            return x.reduce((prev, current)=> prev + current);
        }
    }
   
8. ### 接口 interface

   定义：接口是为了定义`Object`类型

   特点：

   - 可选: ?
   - 只读：`readonly`
   - 可以描述函数类型
   - 可以描述自定义属性

9. ### 类

   特点：

   - 增加了 `public`, `private`, `protected`
   - 抽象类：
     - 只能被继承，不能被实例化
     - 作为基类，抽象方法必须被子类实现
   - `interface` 约束类，使用`implements`关键字



## 高级类型

1. ### 联合类型 `|`

2. ### 交叉类型 `&`

3. ### 类型断言 `as xxx`

4. ### 类型别名 `type & interface`

   - 相同点：
     1. 都可以定义对象或函数
     2. 都允许继承
   - 不同点：
     1. `interface`是Ts用来定义对象的，type是用来定义别名方便实用
     2. `type`可以定义基本类型，`interface`不允许
     3. `interface`可以合并并重复声明，`type`不行

5. ### 泛型 `<T>`

::: tip 一个🌰

#### 应用场景

​	定义一个`print`，这个函数功能是把传入的参数打印出来，再返回这个参数，传入参数的类型是`string`，函数返回`string`

```ts
function print(arg: string): string {
    console.log(arg);
    return arg;
}
```

​	如果此时想要改为，传参`number`类型，返回`number`类型

```ts
function print(arg: number): number {
    console.log(arg);
    return arg;
}
```

​	函数体本质没有任何区别，只是修改了函数的参数类型，如果此时我希望传入`boolean`返回`boolean`呢？还是需要修改参数类型吗- 🙅非常麻烦

- 我们可以使用`any`，这样就不会限制类型了，但是就失去了`一一对应`的关联关系。

- 使用`泛型`解决问题

  ```ts
  function print<T>(arg: T): T {
      console.log(arg);
      return arg;
  }
  ```

在我们传入参数后，我们可以使用以下两种方式定义`<T>`

```ts
print<string>("Hello World!"); // 传入string，定义T为string

print("Hello World!"); // ts自动推断类型
```



:::

#### 基础操作符

1. `typeof`

   ```ts
   interface Person {
       name: string;
       age: number;
   }
   const sem: Person = {name: 'Kevin', age: 22};
   
   type Sem = typeof sem; // type Sem = Person
   ```

2. `keyof`

   ```ts
   interface Person {
       name: string;
       age: number;
   }
   
   type K1 = keyof Person; //"name" | "age"
   type K2 = keyof Person[]; //"length" | "toString" | "pop" | "push" | "concat" | "join"
   ```

3. `in` 遍历枚举类型

   ```ts
   type Keys = "a" | "b" | "c"
   
   type Obj = {
       [p in keys]: any
   } // {a: any, b: any, c: any}
   ```

4. `T[K]` 索引访问

   ```ts
   interface IPerson {
       name: string;
       age: number;
   }
   
   let type1: IPerson['name']; // string
   let type2: IPerson['age']; // number
   ```

5. `extends` 泛型约束

   

#### 工具类型

1. `Partial<T>` 将属性变为可选
2. `Required<T>` 将属性变为必选
3. `Readonly<T>` 将属性变为只读
4. `Pick, Record...` 

```ts
type Partial<T> = {
    [p in keyof T]?: T[P]; 
};

type Required<T> = {
    [p in keyof T]-?: T[P];
};

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
```



::: details 一个实战🌰

`request`中泛型受到了`API`的约束，`url`可以是`/book/detail`与`/book/comment`, `obj`可以是`{id: number}`或`{id: number, comment: string}`（取决于T）。

```ts
import axios from 'axios';

interface API {
    '/book/detail': {
        id: number,
    },
    '/book/comment': {
        id: number,
        comment: string
    }
}

function request<T extends keyof API>(url: T, obj: API[T]) {
    return axios.post(url, obj);
}

request('/book/comment', { // [!code error]
    id: 1,
    comment: '非常棒!'
})

// Case1: 路径错误
request('/book/test', {
    id: 1
})
// Case2: 参数错误
request('/book/detail', {
    id: 1,
    comment: '非常棒!' // [!code error]
})
```

:::
