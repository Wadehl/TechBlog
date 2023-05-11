# var,let,const 区别

## var

::: tip

在ES5中，顶层对象的属性和全局变量是等价的，用`var`声明的变量既是全局变量，也是顶层变量

注意：顶层对象，在浏览器环境指的是`window`对象，在 `Node` 指的是`global`对象，但是`Node`环境并不会挂载到`global`上

:::

```js
var a = 10;
console.log(window.a); // 10

// 变量提升
console.log(b); // undefined 执行过程：var b -> console.log -> b=20 
var b = 20;

// var可以重复定义
var c = 30;
var c = 40;
console.log(c); // 40 

var d = 10;
function fun() {
    d = 20;
}
fun();
console.log(d); // 20

// 如果改为以下，则函数内的变量变为局部变量
var d = 10;
function fun2() {
    var d = 20;
}
fun2();
console.log(d); // 10
```

## let

::: tip

`let`是`ES6`新增的命令，用来声明变量

用法类似于`var`，但是所声明的变量，只在`let`命令所在的代码块内有效

:::

```js
// 只在所处代码块有效
{
    let a = 10;
}
console.log(a); // ReferenceError: a is not defined. 

// 不存在变量提升
console.log(b);
let b = 20; // ReferenceError: Cannot access 'b' before initialization

// 作用域内存在let时，作用域不受外界影响 —— 暂时性死区
var c = 123;
if (true) {
    c = 'abc'; // ReferenceError: Cannot access 'c' before initialization
    let c;
}

// 【同一个作用域内】不允许重复定义
let d = 30;
let d = 40;
console.log(d); // SyntaxError: Identifier 'd' has already been declared

// 这种情况没有问题，因为不是同一个作用域内
let d = 20;
{
    let d = 30;
    console.log(d); //30
}
console.log(d); // 20
```



## const

::: tip

`const`声明一个只读的常量，一旦声明，常量的值就不能改变（针对基础类型）

:::

```js
const a = 10;
a = 20; // TypeError: Assignment to constant variable.

// 声明的时候必须定义值
const b; // SyntaxError: Missing initializer in const declaration

// 定义对象
const c = {};

// 对对象重新赋值是不允许的，但是可以对对象的值进行赋值
c = {}; // TypeError: Assignment to constant variable.
c.prop = 30;
console.log(c.prop); // 30
```

::: tip 能够为const的对象添加新的值的原因

`const`实际上保证的并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动

对于简单类型的数据，值就保存在变量指向的那个内存地址，因此等同于常量

对于复杂类型的数据，变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的，并不能确保改变量的结构不变

:::

## 总结

- 变量提升
- 暂时性死区
- 块级作用域
- 重复声明
- 修改声明的变量
- 使用 尽量使用`const`，减少使用`var`