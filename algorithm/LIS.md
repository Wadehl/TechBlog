# [最长递增子序列算法](https://leetcode.cn/problems/longest-increasing-subsequence/description/)

## 为什么会接触到这个算法呢？
在看Vue3 `diff`算法的关键源码`patchKeyedChildren`的时候，有一种可能的情况，新旧节点不同的地方是乱序的。
比如：

```js
c1: a b c d e f g h
c2: a b e c d i g h
```

通过前面的头尾比对后，剩下不同的序列为`'cdef'与'ecdi'`,此时，因为对于`DOM`来说，性能肯定是`修改属性 > 移动节点 > 新增节点`的，所以我们尽量争取使用`patch`去修改原来的节点，顺序不同的话旧`move`更改顺序，多余的删除，新来的添加就好了。

那么针对`move`来说，如何可以使得移动的节点移动的位置以及数目最少呢？我们可以看成固定一些节点不动，其他的移动。归纳可以发现，当我们保持一串递增的不连续的节点不动的话，我们移动节点的代价是最低的。

## 我们先弄个简单的解法1

这里利用的是`DP`，因为到第`i`个数最长的序列来说，它等于前面`j`个数里面符合条件`arr[i]>arr[j]`的`dp[j]+1`，所以我们很容易得到状态方程：
$$
\begin{align}
dp[i] =
\begin{cases}
 \max(dp[i], dp[j]+1), & if(a[j]>a[i]) \\
 1, & else
\end{cases} 
\end{align}
$$
因此：

```js
const getSequenceLength = (arr) => {
    const len = arr.length;
    if (!len) {
        return 0;
    } 
    let maxAns = 1;
    const dp = new Array(len).fill(1);
    for(let i=0;i<len;i++) {
        for(let j=0;j<i;j++) {
            if(arr[j]<arr[i]) {
                dp[i] = Math.max(dp[i], dp[j]+1);
            }
            maxAns =Math.max(maxAns, dp[i]);
        }
    }
    return maxAns;
}
```

我们可以得到，我们这个算法最后的时间复杂度为`O(n^2)`，空间复杂度为`O(n)`



## Vue的解法

在`vue`中，使用了**贪心+二分**的办法来获取正确的数组长度，如何保证呢？
为了能让数组能够更长，我们认为前面的数递增的间隔越小，那么我们后面就能维护更长的数组，这是因为`1,2,3`与`1,3,5`来说，间隔越大，能够塞下的数字会越少。因此，我们每次遍历到一个数`ai`的时候，我们将比末尾更大的数`push`到队尾，如果遇到比队尾小的数，我们就拿这个数替换掉可以搜索到的比当前数`ai`更大但最接近的一个数，这个搜索的过程我们可以使用二分找到这个边界值。我们如何证明正确呢？

1. 感性上说就是，我们替换的值并不会影响我们这个队列的长度，因为我们替换的并不是最大的值，而是中间的值，对于这个序列结果不会有副作用。
2. 我们也可以利用理性一些的反证证明：
3. 当 k<ik < ik<i，若 `tails[k]>=tails[i]`，代表较短子序列的尾部元素的值 `>` 较长子序列的尾部元素的值。这是不可能的，因为从长度为 `i` 的子序列尾部倒序删除 `i−1` 个元素，剩下的为长度为 `k` 的子序列，设此序列尾部元素值为 `v`，则一定有 `v<tails[i]` （即长度为 `k` 的子序列尾部元素值一定更小）， 这和 `tails[k]>=tails[i]` 矛盾。

因此我们快速写出代码

```js
const getSequenceLength = (arr) => {
    const len = arr.length;
    const result = [0]; // 这里存的是递增序列的下标
    let i,j,u,v,c;
    for(i=0;i<len;i++) {
        const arrI = arr[i];
        j = result[result.length-1]; // 即当前序列最大的数的下标
        if(arr[j]<arrI) {
            result.push(i); // 挪到最末尾
            continue;
        }
        u=0; v=result.length-1;
        // 二分查找
        while(u<v) {
            c = ((u+v)/2) | 0;
            if(arr[result[c]]<arrI) {
                u = c+1;
            } else {
                v = c;
            }
        }
        // 这里我们希望arr[result[u]]是大于arrI的边界值
        if(arr[result[u]] > arrI) {
            result[u] = i; // 还是寸下标
        }
   
    }
    return result.length;
}
```



::: tip

但是其实我们都知道，通过这个方法，我们只能获得正确的数组长度，无法获得正确的顺序，因为这种算法忽略了顺序只考虑了值。

在Vue中，额外添加了一个p数组，这个p数组能够在最后通过回溯的方法，获取最终的正确的顺序

:::

## Vue.getSequence

```js
const getSequence = (arr) => {
    const len = arr.length;
    const result = [0]; // 这里存的是递增序列的下标
    const p = arr.slice(); // 复制一遍arr（浅拷贝），p存的是result内的数！！
    let i,j,u,v,c;
    for(i=0;i<len;i++) {
        const arrI = arr[i];
        j = result[result.length-1]; // 即当前序列最大的数的下标
        if(arr[j]<arrI) {
            p[i] = j; // p存储的是result插入前一个位置，是result的值
            result.push(i); // 挪到最末尾
            continue;
        }
        u=0; v=result.length-1;
        // 二分查找
        while(u<v) {
            c = ((u+v)/2) | 0;
            if(arr[result[c]]<arrI) {
                u = c+1;
            } else {
                v = c;
            }
        }
        // 这里我们希望arr[result[u]]是大于arrI的边界值
        if(arr[result[u]] > arrI) {
            if(u>0) {
                // 排除一些情况
                p[i] = result[u-1]; //还是寸前一个下标
            }
            result[u] = i; // 还是寸下标
        }
   
    }
    // 开始回溯
    u = result.length;
    v = result[u-1]; // 最后一项
    while(u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    
    return result;
}
```



