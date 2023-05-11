# this指向

::: tip 总结

1. 普通函数
   - `this`指向`window`
2. 对象
   - `this`在对象调用的时候指向对象
   - 先赋值再调用，看调用的地方
3. `new`
   - 创建临时对象
   - 将`this`指向临时对象
   - 执行构造函数
   - 返回临时对象

:::

```js
function fun() {
  console.log(this); // 普通函数
}
fun(); // 浏览器环境-Window，Node环境-global

const Obj = {
  name: "Kevin",
  showName: function () {
    console.log(this.name, this);
  },
};

Obj.showName(); // Kevin Obj
const getName = Obj.showName; // undefined Window(Node环境 - global)
getName();

function ShowName() {
    this.name = "Kevin";
}

const GetName = new ShowName();
console.log(GetName.name); // Kevin
console.log(ShowName.name); // ShowName 函数的属性
```

