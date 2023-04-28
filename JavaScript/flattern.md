# 实现数组扁平化，去重并且排序

### 1. 数组扁平化

```js
const arr = [1,2,3,[4,5],[6,[7,[8,9,[10]]]]];

// [1,2,3,[4,5],[6,[7,[8,9,[10]]]]] => [1,2,3,4,5,6,7,8,9,10]

// 1. Array.prototype.flat(depth: number)
// depth为深度，depth为空的时候默认为1
// 当depth = Infinity的时候，即可实现数组完全扁平化

arr.flat(Infinity);

// 2. 递归
Array.prototype.flat1 = function() {
    const result = this.map((val)=>{
        if(Array.isArray(val)) {
            return val.flat1();
        }
        return [val];
    });
    return [].concat(...result);
}

arr.flat1();

// 3. reduce
Array.prototype.flat2 = function() {
    return this.reduce((pre,cur)=>{
        return pre.concat(Array.isArray(cur)?cur.flat2():cur);
    },[])
}

arr.flat2();

// 4. 扩展运算符...
const flat3 = function(arr) {
    while(arr.some((val)=>Array.isArray(val))) {
        arr = [].concat(...arr);
    }
    return arr;
}

flat3(arr);
```



### 2. 去重+排序

```js
// Set()去重
new Set(arr)

// 升序排序
Array.from(new Set(arr)).sort((a,b)=>a-b);
```



# 对象扁平化

```js
const flatternObject = (obj) => {
    const ans = {};
   	
    for(let i in obj) {
        if(!obj.hasOwnProperty(i)) continue;
        
        if((typeof ob[i]) === 'object') {
            let flatObject = flatternObject(ob[i]);
            for(let x in flatObject) {
                if(!flatObject.hasOwnProperty(x)) continue;
                
                ans[`${i}.${x}`] = flatObject[x];
            }
        } else {
            ans[i] = obj[i];
        }
    }
    return ans;
}
```



