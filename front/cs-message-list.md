---
title: 在线客服后台：消息列表渲染机制
date: 2026-06-05
description: 聊天消息列表的虚拟滚动、高度测量，以及历史位置跳转。
outline: deep
---

# 在线客服后台：消息列表渲染机制

> 写于 2026-06-05

聊天消息列表要同时处理三件事：消息高度不固定（图片、富文本、不同屏宽）、历史消息可能很长、滚动还得跟手。做法是只渲染视口附近的节点，再用一段连续的历史块支撑「跳到某条旧消息」。

## 三层分工

![](/posts/cs-message-list/01.png)

- **数据层**维护已加载的消息块，以及这些块在完整时间线上的顺序。往下只输出当前允许渲染的连续片段。
- **测量层**用 ResizeObserver 记下每条已渲染消息的真实高度，键是消息 id，值是像素。还没渲染过的条目先按 60px 估算，滚进窗口后再换成实测值。卸载 DOM 时不删这张表，同一条消息再次进入视口直接查表。
- **窗口层**用 `scrollTop` 和高度表算出 `startIndex` / `endIndex`，再用上下两块 padding 把滚动条撑成「全部都在」的长度。

测量回调一次可能带进多条高度变化。如果用 `reactive` 的 Map，每次 `set` 都会让依赖它的计算重跑一遍。这里用 `ref` 包 Map：先在旧实例上改完，最后 `sizeMap.value = new Map(sizeMap.value)`，一批变化只触发一次。

## 窗口怎么裁

从上往下累加高度，真实值优先，没有就用 60px。第一个累计高度超过 `scrollTop - 300` 的条目作为起点。300px 来自 `overscan = 5`，也就是视口外预先多挂 5 条，快速上滚时少出空白。终点用同样的办法探到 `scrollTop + containerHeight + 300`。

贴底时不按估算裁尾部，直接渲染到最后一条，底部 padding 归零。新消息到来时，如果还靠默认高度猜窗口，最新的气泡可能落在窗口外面。贴底的判定是容器底部剩余距离小于 200px：

```js
const isNearBottom = computed(() => {
  const el = containerRef.value;
  if (!el) return true;
  return el.scrollHeight - scrollTop.value - el.clientHeight < 200;
});
```

窗口范围必须在渲染前算出来。IntersectionObserver 只能看已经挂上的节点，所以它只负责「加载更多」的触发，不参与起止索引。

## DOM

![](/posts/cs-message-list/02.png)

消息仍在正常文档流里。上下两个空 div 垫出被裁掉的高度。高度表逐渐变准之后，padding 从估算收敛到实测，用户能感觉到的主要是滚动条长短的细微变化。

输入框被拖高时，容器高度变化会让窗口重算一次，浏览器也可能顺手改 `scrollTop`，再触发一轮滚动计算。多走一轮，结果是对的。

## 跳到某一条

定位分两步。

先用高度表把目标大致滚进渲染窗口，未测量的仍按 60px 加。目标节点挂上之后，不再信这张表，改读它和容器的 `getBoundingClientRect()`。上面的图片如果后加载、把目标顶下去，就按差值把 `scrollTop` 修回来，让目标停在视口中部：

```js
const targetRect = targetEl.getBoundingClientRect();
const containerRect = el.getBoundingClientRect();
const targetMid = targetRect.top - containerRect.top + targetRect.height / 2;
el.scrollTop += targetMid - el.clientHeight / 2;
```

用户一旦用滚轮或触摸接管，修正马上停。另外设 30 秒上限，避免异常时一直改滚动位置。目标自身测完就停是不够的：上方大图可能更晚才撑开，停早了，偏差会留在页面上。

## 历史里的洞

一条历史会话是一个块。完整顺序在元信息列表里，已加载的块只是其中一段。相邻已加载块在完整顺序里不连续，中间就是洞。例如顺序是 A、B、C、D，手里只有 A 和 C，A 与 C 之间的 B 还没加载。

![](/posts/cs-message-list/03.png)

渲染只取从头开始的连续段。遇到第一个洞，洞前面的块可见，洞后面的全部不可见。这样列表里不会出现一块空白。

跳转到某条旧消息时，按完整顺序找到目标块，补上它和前后各一块，按原顺序合并进已有数据，已在内存里的不重复请求。合并后再从头部收一次连续段，算出目标在可见列表中的下标，交给上面的滚动定位。

![](/posts/cs-message-list/04.png)

这次加载如果中途换了会话，用一个递增的版本号丢掉过期结果，避免旧请求写回当前列表。

新消息到达时先插进当前块，让气泡马上出现；随后用一次全量结果覆盖这一块，纠正顺序。正在看历史、当前块不在列表里时，只提示有新消息，不改正在看的那段。

## 为什么用 padding，不用 translateY

成熟的虚拟列表多半用 `translateY` 加绝对定位。聊天列表要经常往上接历史，这种做法有两个麻烦：绝对定位的节点不进文档流，浏览器的 `overflow-anchor` 选不中它们，往前插入后视口会漂；每插一批，后面所有项的偏移都要重算。

| 方案 | padding | translateY |
| --- | --- | --- |
| 文档流 | 消息留在正常流里 | 绝对定位，脱离文档流 |
| 向上插入 | 只改顶部占位高度 | 重算后续每一项的偏移 |
| overflow-anchor | 可以选中消息节点 | 绝对定位节点不会被选为锚点 |

高度差的主动修正是主路径。图片懒加载、字体晚到这类事先量不到的变化，交给 `overflow-anchor` 兜底。页头、分隔线和页脚显式设 `overflow-anchor: none`，避免它们被当成锚点。
