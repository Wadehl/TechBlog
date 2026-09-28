---
title: 滚动抽奖组件的实现与性能优化
date: 2025-03-24
description: 滚动抽奖组件的实现方式，以及滚动过程中的性能处理。
outline: deep
---

# 滚动抽奖组件的实现与性能优化

> 写于 2025-03-24

## 背景

为了提升游戏的新用户获取率，我们需要开发了一个抽奖活动。该活动通过丰富的奖品设置，吸引潜在玩家参与活动并加入游戏。为了提高直播中的效果与用户的参与度和满意度，该组件需要具备流畅的动画效果和良好的性能表现，以确保用户体验。

## 抽奖组件状态管理

**1.抽奖状态**：

`isRunning`: 是否正在抽奖

`isSlowingDown`: 是否正在减速

`showResult`: 是否显示结果

`currentPhase`: 当前动画阶段

- `idle`：闲置状态

- `acceleration`：加速状态

- `constant`：匀速状态

- `deceleration`：减速状态

- `stopping`：暂停状态

**2.动画参数**：

`scrollPosition`: 滚动位置

`scrollSpeed`: 滚动速度

**3.奖品和候选人**：

通过hook请求接口轮询获取候选号码，并单独请求接口获取本次抽奖结果。

## 抽奖的主要流程

### 初始化：

1. 在组件挂载时初始化可用的奖品列表与候选人名单 `candidates`
2. 设置初始的滚动状态与位置
3. 轮询动态更新候选人名单

### 抽奖过程：

1. 点击开始按钮：重置状态，启动加速动画
2. 点击暂停按钮：请求后端获取抽奖结果，启动暂停动画
3. 动画完成：展示最终结果，居中并重点展示

### 动画实现：

1. 使用 `requestAnimationFrame` 实现平滑动画
2. 通过计算得到每一帧的位置和不透明度
3. 使用缓动函数使加速和减速效果更自然

## 抽奖实现核心逻辑

### 前置条件

- 可视范围内一次性展示最多7个号码

![](/posts/lottery-scroll/01.png)

### 无限滚动策略

1. 核心DOM结构

```xml
<div class="lottery-window" :style="{ height: `${ITEM_HEIGHT * 7}px` }">
    <div
      v-for="{ number, originalIndex } in displayNumbers"
      :key="originalIndex"
      class="lottery-number"
      :class="{
        highlight: isHighlighted(originalIndex),
        'near-center': isNearCenter(originalIndex),
        visible: true,
        result: isResultNumber(number, originalIndex),
      }"
      :style="{
        transform: `translateY(calc(${
          originalIndex * ITEM_HEIGHT
        }px - ${scrollPosition}px))`,
        opacity: calculateOpacity(originalIndex),
        height: `${ITEM_HEIGHT}px`,
      }"
    >
      {{ number }}
    </div>
  </div>
```

2. 数据准备

（1）将候选号码重复多次（累加数量到所需的数量）以创建一个足够长的数组仅用于展示 displayNumbers

```js
const initDisplayNumbers = () => {
    // 创建一个足够长的号码列表，以便滚动
    // 为了避免可见的回滚，我们需要创建更多的重复数据
    const repeatedNumbers = [];
    
    // 获取当前候选人数量
    const candidatesCount = candidates.value.length;
    
    // 目标总数量
    const targetTotalCount = 200;
    
    // 如果候选人数量已经超过，则不需要重复
    if (candidatesCount >= targetTotalCount) {
      displayNumbers.value = [...candidates.value];
      return;
    }
    
    // 计算需要重复的次数，向上取整确保总数量满足要求
    const repeatCount = Math.ceil(targetTotalCount / candidatesCount);
    
    // 重复添加候选人数据
    for (let i = 0; i < repeatCount; i++) {
      repeatedNumbers.push(...candidates.value);
    }
    
    displayNumbers.value = repeatedNumbers;
    
    // console.log(`候选人数量: ${candidatesCount}, 重复次数: ${repeatCount}, 总数量: ${repeatedNumbers.length}`);
  };
```

（2）滚动位置管理

- 使用scrollPosition记录当前滚动位置
- 随着动画进行，scrollPosition不断增加
- 通过CSS的transform: translateY实现元素位置的移动

（3）无限滚动的关键代码实现

```js
  if (scrollPosition.value >= totalHeight - singleLoopHeight * 5) {
     const newPosition = scrollPosition.value % singleLoopHeight + singleLoopHeight * 5;
     scrollPosition.value = newPosition;
     
     // 同时调整目标位置和结果位置
     if (targetScrollPosition.value > 0) {
       targetScrollPosition.value = targetScrollPosition.value % singleLoopHeight + singleLoopHeight * 5;
     }
     
     if (resultPosition.value > 0) {
       resultPosition.value = resultPosition.value % singleLoopHeight + singleLoopHeight * 5;
     }
   }
```

`核心逻辑解释：`

- `scrollPosition.value % singleLoopHeight`：计算在一个完整循环内的相对位置
- `singleLoopHeight * 5`：偏移量，确保重置后的位置在合适的范围内
- `scrollPosition` 会不断重置，避免数值太大导致出现精度问题

（3）视觉优化策略

- 不是真正的"无限"，而是在滚动到一定位置时，将位置重置回前面的某个等效位置
- 由于视觉上号码是循环且重置时保持相对位置不变，确保视觉上的连续性（因为序列是一致的）
- 当位置超过阈值（`totalHeight` - `singleLoopHeight` \* `5`）时触发重置
- 线性计算元素与中心的距离，已实现中间区域视觉效果更加明显

```js
// 计算透明度
const calculateOpacity = (index: number) => {
  // 使用单个循环的高度而不是总高度，确保透明度计算正确
  const singleLoopHeight = candidates.value.length * ITEM_HEIGHT;
  
  // 计算当前位置在单个循环内的相对位置
  const currentPos = scrollPosition.value % singleLoopHeight;
  
  // 计算当前索引在单个循环内的相对位置
  const indexPos = (index * ITEM_HEIGHT) % singleLoopHeight;
  
  // 计算最短距离（考虑循环）
  let distance = Math.abs(indexPos - currentPos);
  // 考虑循环边界情况，取最短路径
  if (distance > singleLoopHeight / 2) {
    distance = singleLoopHeight - distance;
  }

  // 增加可见范围，确保高速滚动时上方的数字不会消失
  // 中心区域完全不透明
  if (distance < (1 / 2) * ITEM_HEIGHT) {
    return 1;
  }
  // 中心区域附近的数字半透明，扩大可见范围
  else if (distance < 4 * ITEM_HEIGHT) {
    // 使用线性插值计算透明度，但保持最小透明度
    return Math.max(
      0.3,
      1 - ((distance - (1 / 2) * ITEM_HEIGHT) / 3.5) * ITEM_HEIGHT
    );
  }
  // 远离中心的数字低透明度但不完全消失
  else {
    return 0.2;
  }
};
```

### 停止策略的制定

目前，我们的抽奖逻辑通过后端实现，是需要我们前端通过获取接口返回的结果后再进行展示的。

在这过程中，会有以下一些问题因素导致不可控制：

1. 抽奖在开始前会不断的进行轮询刷新名单与匀速滚动，我们对开始时候的序号与暂停后结果的序号中间间隔是不可知的；
2. 轮询过程中的号码个数因需考虑后端接口性能问题，限制了返回的个数，可能出现结果并不在展示的名单内的问题（只靠滚动无论如何都不可能出现）；

因此，我们的暂停策略制定为以下策略：

1. 在点击暂停按钮后，再进行接口请求的动作（点击开始就获取结果，中途假如抽奖页面崩溃的话，就会出现未暂停即出结果的问题）
2. 获取到结果后，进行渐进式减速策略，我们会去计算该过程中前进的固定数量位置（因为内容从减速到停止的速度函数与个数是可计算的）
3. 在停止到结束经历数量个数的位置添加结果到数组内（避免问题2的发生）
4. 缓动到目标位置后直接停止，避免指向的位置过偏，指向上面或下面超过1/2的情况（超出1/2会导致是非预期结果出现非中间区域样式）

![](/posts/lottery-scroll/02.png)

核心实现代码如下：

1. 暂停抽奖

```js
if (isRunning.value) {
    // 获取抽奖结果（改到点击停止后）
    isResultReady.value = false;
    try {
      const resultData = (await fetchResult()) as string; // 获取结果
      result.value = resultData;
      isResultReady.value = true; // 标记结果已准备好
      isLoading.value = false; // 加载完成
    } catch (error) {
      console.error("未知错误，请刷新页面重试", error);
      // ...重置所有相关状态的逻辑代码
      return;
    }
    // 开始减速过程
    isSlowingDown.value = true;
    // 从匀速阶段切换到减速阶段
    currentPhase.value = "deceleration";
    phaseStartTime.value = performance.now();

    // 设置剩余滚动次数
    remainingScrolls.value = totalScrollsBeforeStop;

    // 计算目标位置：当前位置加上适当的距离，确保结果在视野中
    const itemHeight = ITEM_HEIGHT;

    // 计算当前可见的中心位置索引
    const currentCenterIndex = Math.floor(scrollPosition.value / itemHeight);

    // 固定滚动的位置数量，不再依赖于速度，确保每次停止的位置更加一致
    const fixedScrollsToAdd = 7; // 固定滚动7个位置

    // 计算目标索引位置
    const targetIndex = currentCenterIndex + fixedScrollsToAdd;

    // 设置目标滚动位置
    targetScrollPosition.value = targetIndex * itemHeight;

    // 在目标位置插入结果
    insertResultAtPosition(targetIndex);

    // 记录结果位置
    resultPosition.value = targetIndex * itemHeight;
    return;
  }
```

2. 插入结果到目标位置

```js
const insertResultAtPosition = (targetIndex: number) => {
  // 确保索引在有效范围内
  if (targetIndex >= displayNumbers.value.length) {
    targetIndex = targetIndex % displayNumbers.value.length;
  }

  // 先清除所有可能已存在的结果
  for (let i = 0; i < displayNumbers.value.length; i++) {
    if (displayNumbers.value[i] === result.value) {
      displayNumbers.value[i] = candidates.value[i % candidates.value.length];
    }
  }

  // 在目标位置插入结果
  displayNumbers.value[targetIndex] = result.value;
  resultIndex.value = targetIndex;
};
```

## 性能优化

### **核心性能优化-虚拟列表**

通过上面的逻辑，我们已经实现了列表无限滚动的动画逻辑，假如用户设备性能无限好的情况下，我们已经实现了这个抽奖组件。

但是设备配置不可能无限好，因此需要优化存在性能问题：

我们通过了 for 遍历 `displayNumbers` 来渲染至少200个的DOM节点实现了无限滚动，其数量是不可控的（假如后端100ms就能一次性返回成千上万条数据），因此会出现页面卡顿的问题。

针对该问题，其出现的情况实际上就是因为DOM全量渲染导致的，实际上我们需要看到的DOM节点只有七个，我们只需要保证这七个号码能够正常渲染即可（虚拟列表）。

![](/posts/lottery-scroll/01.png)

我们只需要通过已有的状态变量 scrollPosition ，然后再通过每个号码的固定高度 ITEM\_HEIGHT ，即可计算出完整的可视范围的元素集合 visibleNumbers。

```js
const visibleRange = computed(() => {
  const centerIndex = Math.floor(scrollPosition.value / ITEM_HEIGHT);
  const buffer = 3;
  const start = Math.max(0, centerIndex - buffer);
  const end = Math.min(displayNumbers.value.length - 1, centerIndex + buffer);
  
  return { start, end, offset: start * ITEM_HEIGHT };
});

// 计算可见的号码列表
const visibleNumbers = computed(() => {
  if (!displayNumbers.value.length) return [];
  
  const { start, end } = visibleRange.value;
  return displayNumbers.value.slice(start, end + 1).map((number, index) => ({
    number,
    originalIndex: start + index
  }));
});
```

最后，将v-for渲染的 displayNumbers 改为 visibleNumbers 即可。

### 其他使用到的性能优化点

1.无限滚动

这里的无限滚动是通过固定列表重复序列表示无限的数据，通过动态的刷新 `scrollPosition` 与使用 `transform` ，触发GPU加速避免了布局重排，对性能有一定的帮助；

```js
transform: `translateY(calc(${originalIndex * ITEM_HEIGHT}px - ${scrollPosition}px))`
```

2.CSS优化

使用CSS提示和优化属性，提前告知浏览器预期的变化，使其能够做出优化准备；

```css
will-change: transform, opacity;
backface-visibility: hidden;
transform-style: preserve-3d;
-webkit-font-smoothing: antialiased;
```

3.按需请求加载和轮询优化

当正式开始抽奖的时候，会通过 `useRequest` 暴露的 `cancel` 方法去取消已经创建的轮询，并且通过参数 `pollingWhenHidden: false` 去避免当页面不可视时，仍然自动轮询的问题。

```js
const { cancel } = useRequest(fetchCandidates, {
  pollingInterval: 30000, // 30s轮询
  pollingWhenHidden: false,
  // ...
});
```

4. 使用 requestAnimationFrame 进行固定步长的动画优化

**优化原理**：与 setInterval 或 setTimeout 相比，requestAnimationFrame 与浏览器的渲染周期同步，避免了丢帧和过度渲染

**性能收益**：减少CPU使用率，降低电池消耗，特别是在不可见标签页中会自动暂停执行

**平滑度提升**：保证动画在每次屏幕刷新时只执行一次，提供更流畅的视觉体验

```js
// 使用requestAnimationFrame更新动画
const startAnimation = () => {
	// 固定步长的动画更新
	const fixedTimeStep = 1000 / 60; // 60fps 对应的时间步长
	let accumulatedTime = 0;

	// 累积时间差
	accumulatedTime += realDeltaTime;

	// 使用固定的时间步长更新动画
	while (accumulatedTime >= fixedTimeStep) {
 	   updateAnimation(fixedTimeStep);
 	   accumulatedTime -= fixedTimeStep;
	}
  // ... 其他设置步长等逻辑

  // 将动画更新逻辑抽离为单独的函数
  const updateAnimation = (deltaTime: number) => {
    // 根据当前阶段更新速度
    updateSpeedByPhase(performance.now());

    // 更新滚动位置
    const itemHeight = ITEM_HEIGHT;
    const pixelsPerSecond = scrollSpeed.value * itemHeight;
    // console.log(`pixelsPerSecond: ${pixelsPerSecond}`);
    const scrollDelta = pixelsPerSecond * (deltaTime / 1000);
    // console.log(`scrollDelta: ${scrollDelta}`);
    scrollPosition.value += scrollDelta;
    // console.log(`scrollPosition: ${scrollPosition.value}`);

    // 计算一个完整循环的高度
    const singleLoopHeight = candidates.value.length * ITEM_HEIGHT;
    const totalHeight = displayNumbers.value.length * ITEM_HEIGHT;

    // 优化无限滚动处理
    // 当滚动位置超过一定阈值时，将其重置到合适的位置，保持视觉上的连续性
    if (scrollPosition.value >= totalHeight - singleLoopHeight * 5) {
      // 将位置重置到前面的某个位置，但保持相对位置不变
      // 这样用户不会感觉到任何跳跃
      const newPosition = scrollPosition.value % singleLoopHeight + singleLoopHeight * 5;
      scrollPosition.value = newPosition;
      
      // 如果有目标位置，也需要相应调整
      if (targetScrollPosition.value > 0) {
        targetScrollPosition.value = targetScrollPosition.value % singleLoopHeight + singleLoopHeight * 5;
      }
      
      // 如果有结果位置，也需要相应调整
      if (resultPosition.value > 0) {
        resultPosition.value = resultPosition.value % singleLoopHeight + singleLoopHeight * 5;
      }
    }

    // 如果在减速阶段且接近目标位置，开始微调
    if (
      currentPhase.value === "deceleration" &&
      targetScrollPosition.value > 0
    ) {
      const distance = targetScrollPosition.value - scrollPosition.value;
      if (Math.abs(distance) < 1 * ITEM_HEIGHT) {
        adjustToTargetPosition(distance);
      }
    }
  };

  animationFrame = requestAnimationFrame(animate);
};
```

## 性能对比（以下图片为gif动图，点击后才能够正常查看）

以下是在M4芯片+16G内存机器的性能表现，其他配置的机器可能会有一定差异。

|  | DOM结构 | 号码数量：200 | 号码数量：1000 | 号码数量：10000 | 号码数量：100000 |
| --- | --- | --- | --- | --- | --- |
| 优化前 |  |  |  |  | 当加载10000个号码的时候页面已经无法正常使用了。 |
| 优化后 |  |  |  |  |  |

## 总结

该抽奖组件虽然表现形式与整体逻辑可以较快地理解和完成，但由于其结果展示需要高度稳定性，性能优化变得尤为重要。我们通过以下几个方面进行了优化：

- 虚拟列表优化
  - 将全量渲染改为只渲染可视区域的7个元素
  - 通过scrollPosition和ITEM\_HEIGHT精确计算可视元素
- 滚动性能优化
  - 使用transform触发GPU加速
  - 采用固定列表重复序列实现无限滚动
- 动画性能优化
  - 使用requestAnimationFrame同步浏览器渲染周期
  - 实现固定步长的动画更新
- 其他优化措施
  - CSS优化属性提示
  - 按需请求加载和轮询优化

通过这些优化措施，我们成功实现了一个性能稳定、动画流畅的抽奖组件，既保证了良好的用户体验，又能够适应各种设备配置的要求。
