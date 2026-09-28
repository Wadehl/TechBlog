---
title: Codex Subagent 实现解析与 Pi Collaboration Plugin 实践
date: 2026-09-22
description: 拆开 Codex Subagent 的实现，并对照 Pi Collaboration Plugin 的用法。
outline: deep
---

# Codex Subagent 实现解析与 Pi Collaboration Plugin 实践

> 写于 2026-09-22

![Subagent 协作概念图](/posts/codex-subagent/01.png)

## 一、引言

### 1. 单Agent运行很慢，不只看模型响应速度

一个完整的任务中，Agent 往往要连续完成很多事情：读代码、找调用方、设计方案、修改文件、运行测试、检查回归。任务一长，问题就出现了：

- 前面的探索没有结束，后面的实现只能等着；
- 多个彼此独立的检查，只能一个个排队执行；
- 每个阶段都要回到主 Agent，重新理解“现在做到哪了”；
- 用户只能看到一个很长的同步过程，无法知道哪些工作已经可以先交付。

比如说，一个 Agent 需要完成三个彼此独立的任务：

```go
const scout = await run("查找受影响模块");
const tests = await run("设计回归测试");
const review = await run("检查兼容性风险");
```

这段代码的核心问题，不只是“没有并发”，而是**任务派发与结果等待被绑定在同一个调用里**。

### 2. Subagent 模式

#### （1）常见的协作模式

Subagent 也可以组织成不同的协作形态：

| 模式 | 谁保留最终控制权 | 典型用途 |
| --- | --- | --- |
| Agents as tools | Root Agent | Root 派发专家，综合结果后回答用户 |
| Handoff | 被转交的 Agent | 把整件事交给更合适的专家继续处理 |
| Parallel / Map-Reduce | Root Agent | 多个 Child 独立探索，Root 汇总结果 |
| Chain | 最后一个 Agent | 分析 → 计划 → 实现 → 审查的流水线 |

## 二、Mailbox-Codex 架构

### 1. Codex 的 Subagent 协作逻辑

Codex 把 Subagent 的协作拆成四个独立边界。Root 先派发任务，Child 在自己的上下文中执行；结果不会自动改写 Root 的上下文，而是先进入 Mailbox，等待 Root 显式收取：

```text
spawn_agent  → 创建 Child，立即返回 { agentId, sessionId }
send_message → 给 Child 排队消息，不主动启动新回合
wait_agent   → 等待 Mailbox 中任意一个更新
followup     → 给空闲 Child 追加任务
```

这里的身份、消息和等待是三个不同的协议对象：身份回答“正在协作的是谁”，消息回答“要交付什么”，等待回答“Root 何时主动接收”。

### 2. 先看整体架构图：两条路径

![Mailbox-Codex 时序图](/posts/codex-subagent/02.png)

完整的派发、执行与收取路径见图。

### 3. 五个角色各自负责什么

| 角色 | 只需要记住的一件事 |
| --- | --- |
| Root Agent | 决定何时派发、何时调用 `wait_agent`，并保留最终回答权 |
| Collaboration Tools | 把模型的 ToolCall 翻译成 Runtime 调用，不保存生命周期 |
| Agent Runtime | 分配身份、登记状态、收束终态、管理 Mailbox |
| Subagent | 在独立上下文中执行任务，并报告完成或失败 |
| Mailbox | 暂存尚未被 Root 收取的完成或失败消息 |

工具层通过 `spawn_agent` 与 `wait_agent` 两个 `ToolSpec` 暴露派发和等待边界，具体定义见 `multi_agents_spec.rs`。

### 4. Runtime 核心

Runtime 包含两张核心表格：Registry 与 Mailbox

![](/posts/codex-subagent/03.png)

`AgentRegistry` 回答“Child 现在是什么状态”；`Mailbox` 回答“有哪些终态消息还没有被 Root 收取”；`wait_agent` 负责把待交付消息交给 Root。状态是事实，消息是待消费的交付。

### 5. 一次 round-trip：从派发到收取

![Subagent round-trip 时序图](/posts/codex-subagent/04.png)

### 6. Mailbox 与 `wait_agent`：关键边界

Codex 的 Rust 实现把跨 Agent 消息放进 `InputQueue` 的 Mailbox，并由 `wait_agent` 暴露等待边界。下面的片段来自 `input_queue.rs` 与 `multi_agents_spec.rs`：

```go
pub(crate) struct InputQueue {
    activity_tx: watch::Sender<InputQueueActivity>,
    mailbox_pending_mails: Mutex<VecDeque<PendingMailboxCommunication>>,
}

struct PendingMailboxCommunication {
    communication: InterAgentCommunication,
    start_options: TurnStartOptions,
    _diagnostics_guard: GaugeGuard,
}
go
pub fn create_wait_agent_tool_v2(options: WaitAgentTimeoutOptions) -> ToolSpec {
    ToolSpec::Function(ResponsesApiTool {
        name: "wait_agent".to_string(),
        description: "Wait for a mailbox update from any live agent, including queued messages and final-status notifications. The wait also ends early when new user input is steered into the active turn. Does not return the content; returns either a summary of which agents have updates (if any), an interruption summary for steered input, or a timeout summary if no activity arrives before the deadline."
            .to_string(),
        strict: false,
        defer_loading: None,
        parameters: wait_agent_tool_parameters_v2(options),
        output_schema: Some(wait_output_schema_v2().into()),
    })
}
```

如果 Root 还没有等待，消息会留在 Mailbox；调用 `wait_agent` 后，Runtime 才把更新交给 Root，在`wait_agent`调用之前，Root 可以继续进行自己的任务。`timeout_ms` 只结束本次等待，不取消 Subagent。

> 总结：Registry 记录“产生了什么”，Mailbox 保存“Root 还没收走什么”，`wait_agent` 决定“现在收哪一条”。\*\*

## 三、通过 Pi 来实现

前两章只讨论 Codex 的抽象实现，Pi 作为一个「可插拔的运行时宿主」。可以先参考 [Pi 官方 Subagent Extension Example](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions/subagent)，它把 Subagent 作为工具交给 Root 调度。现在才把这套协议映射到 Pi Extension：由 Pi 子进程生成 Subagent，使用 JSONL 传输运行事件，并通过 `sessionId` 恢复持久化会话。

### 1. 核心实现：Runtime 先拿到身份，再异步结算

实现顺序应该是：

```text
状态模型 → spawn / settle → Mailbox / waitAny → JSONL Transport → Pi Tools → TUI 展示
```

因此，最重要的契约是 `spawn` 不等待 Launcher。

基于 TypeScript 核心实现 [runtime.ts](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/runtime.ts)：

```ts
spawn(request: SpawnRequest): { agentId: AgentId; sessionId: string } {
  // 身份信息先返回；并发上限只约束“正在运行”的 Child 数量。
  if (this.maxConcurrency && this.running >= this.maxConcurrency) {
    throw new Error("max concurrency reached");
  }

  this.running += 1;
  const id = randomUUID();
  const sessionId = request.sessionId ?? randomUUID();
  const childRequest = { ...request, sessionId };

  // Registry 记录事实状态，Mailbox 为这个 Child 建立待消费队列。
  this.registry.set({ id, sessionId, request: childRequest, status: "running" });
  this.mailBoxMessages.set(id, []);

  // Launcher 在后台执行；成功和失败都必须进入同一个 settle 边界。
  this.launch(childRequest).then(
    (result) => {
      this.settle({ id, sessionId, request: childRequest, status: "completed", result });
    },
    (error) => {
      this.settle({
        id,
        sessionId,
        request: childRequest,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    },
  );

  // 这里不能 await launch，否则 spawn_agent 就变成同步调用。
  return { agentId: id, sessionId };
}
```

这段代码体现了 Codex 的关键边界：`spawn_agent` 工具调用先得到身份信息，Launcher 在后台运行；只有完成或失败时，Runtime 才调用 `settle`，同时更新 Registry 并向 Mailbox 投递终态消息。`finalText` 不在 `spawn_agent` 返回，而是在 Child 结算后进入 Mailbox。

`waitAny` 不关心具体的 `agentId`，只消费最先到达的 Mailbox 更新。没有现成消息时，Runtime 才把本次调用登记为等待者：

```ts
async waitAny(options: { timeout_ms?: number } = {}) {
  if (this.posted.length) {
    const agentId = this.posted.shift()!;
    const messages = this.mailBoxMessages.get(agentId) ?? [];
    this.mailBoxMessages.set(agentId, []);
    // 一次 wait 消费一个已投递的 Child 队列。
    return { agentId, messages };
  }
  if (!this.running) throw new Error("No Agent");

  // 没有现成消息时，才把当前调用挂入等待队列。
  let resolveWaiter!: (delivery: AnyWaitDelivery) => void;
  const waiterPromise = new Promise<AnyWaitDelivery>((resolve) => {
    resolveWaiter = resolve;
    this.anyWaiters.push(resolveWaiter);
  });
  if (!options.timeout_ms) return waiterPromise;

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("waitAny timeout")), options.timeout_ms);
    });

    // 超时只结束本次等待，不取消正在运行的 Child。
    return await Promise.race([waiterPromise, timeoutPromise]);
  } finally {
    // 无论消息先到还是超时，都要移除残留 waiter，避免后续误唤醒。
    const index = this.anyWaiters.indexOf(resolveWaiter);
    if (index >= 0) this.anyWaiters.splice(index, 1);
  }
}
```

Pi Tool 层把 `waitAny` 的交付原样转换给模型，因此父 Agent 能看到 `agentId`、完成/失败状态和 `result.finalText`。对应实现见 [tools.ts](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/tools.ts)：

```ts
const delivery = await runtime.waitAny(params);
const details = {
  timed_out: false,
  agentId: delivery.agentId,
  messages: delivery.messages,
};
return textResult(JSON.stringify(details), details);
```

### 2. Pi 子进程和 JSONL

当前项目的 [process-transport.ts](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/process-transport.ts) 使用 Pi 的 JSON 模式启动 Child：

```text
pi --mode json -p --session-id <sessionId> --no-extensions [--provider <provider> --model <model>] <task>
```

这里有三个边界需要分清：

- `sessionId` 负责让新的 Pi 进程恢复同一条持久化会话；
- JSONL 负责在父进程与 Child 之间传输 Pi 事件，不等于会话存储；
- `--no-extensions` 防止 Child 再次加载 Collaboration Extension，避免递归派生 Subagent。

父 Agent 当前的 provider/model 也会传给 Child，保证两边使用同一模型配置。对应的 [createPiJsonProcessSpawner](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/process-transport.ts) 代码可以概括为：

```ts
const sessionId = request.sessionId ?? randomUUID();

return spawn(command, [
  ...argsPrefix,
  "--mode", "json",
  "-p",
  "--session-id", sessionId,
  "--no-extensions",
  ...childModelArgs(), // 继承父 Agent 的 provider/model
  request.task,
], { stdio: ["ignore", "pipe", "ignore"] });
```

[JsonlDecoder](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/jsonl-decoder.ts) 解决 stdout chunk 不等于 JSON 行的问题；网络或进程写入可能把一行 JSON 拆成多个 chunk，因此不能直接对每个 `data` 事件调用 `JSON.parse`。解析后的事件再交给 [createProcessLauncher](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/process-transport.ts) 判断终态：

```go
const decoder = new JsonlDecoder<ChildJsonRecord>();

child.stdout.on("data", (chunk) => {
  // 一个 chunk 可能包含半行、整行或多行 JSONL。
  for (const item of decoder.push(chunk)) onRecord(item);
});
child.stdout.on("end", () => {
  // flush 末尾没有换行符的最后一条记录。
  for (const item of decoder.end()) onRecord(item);
});

child.on("close", () => {
  // 没有 agent_end/final 就不能伪造 finalText。
  if (!settled) reject(new Error("no final"));
});
```

Child 正常结束时，以 `agent_end` 中最后一条 Assistant 文本作为 `finalText`；如果进程关闭前没有 `agent_end` 或 `final` 事件，就进入 Mailbox 的 `failed` 消息。这也是实际调试时看到 `failed: no final` 的来源。

### 3. `resumeFrom` 恢复的是会话

`resumeFrom` 接收旧的 `agentId`，Runtime 找到对应的 `sessionId`，再启动一个新的 Pi Child 打开同一条持久化会话。它不是复用旧进程，而是恢复上下文。对应逻辑见 [runtime.ts](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/runtime.ts) 与 [process-transport.ts](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/packages/collaboration/process-transport.ts)。

### 4. 一次可复现运行

验证脚本 [examples/validate-deepseek-mailbox.sh](https://github.com/Wadehl/codex-like-subagent-pi-plugin/blob/base/examples/validate-deepseek-mailbox.sh) 会启动真实 Pi TUI，并要求 Root 依次调度 `s1`、`s2`、`s3`，每次通过 `wait_agent` 收取最先完成的 Mailbox 消息，再按实际到达顺序拼接结果。脚本只从环境变量读取 API Key，不把密钥写入仓库：

```bash
DEEPSEEK_API_KEY='xxx' ./examples/validate-deepseek-mailbox.sh
```

也可以直接执行等价命令：

```bash
DEEPSEEK_API_KEY='xxx' pi --extension ./packages/collaboration/index.ts --provider deepseek --model deepseek-flash --tools spawn_agent,wait_agent '尝试拉起多个 Subagent：s1 等待约 30 秒后输出随机字符串，s2 等待约 10 秒后输出随机字符串。每次收到返回就输出；收到第一条消息后，再创建等待约 10 秒的 s3。直到收到三个完整返回后，按实际获取结果的顺序拼接三个字符串。'
```

预期观察点：`s2` 通常先完成；Root 收到第一条 Mailbox 消息后才创建 `s3`；后续每次 `wait_agent` 都只消费一条尚未读取的终态消息。由于模型响应和进程调度存在波动，最终顺序以实际 Mailbox 到达顺序为准，不能把 `s1`、`s2`、`s3` 的顺序写死。

![Mailbox 验证运行输出](/posts/codex-subagent/05.png)

## 四、后续迭代演进：从主动等待到被动感知

### 1. 现状：主动等待是一条显式取件路径

当前协作模型把“Child 已经完成”和“Root 已经看到结果”拆成两个时刻。Child 独立执行，结束后把完成或失败消息放进 Mailbox；Root 是否马上取走，由自己的工作节奏决定。

这条路径有一个明确的事实关系：Mailbox 是可靠的交付存储，而不是 Root 上下文的自动写入器。Root 不发起等待，Child 的结果就会继续留在 Mailbox 中，不会悄悄改写正在进行的对话。

![Mailbox-Codex 当前主动等待路径](/posts/codex-subagent/06.png)

图中可以看到，成功和失败最终都走同一个交付路径。等待超时只结束这次等待，不会改变 Child 的执行状态；下一次等待仍然可以收取后来到达的终态消息。

### 2. 设计思路：在可靠存储上增加通知通路

被动感知不应该推翻主动等待，而应该在它上面增加一条通知通路：Child 结算时仍然先写入 Mailbox，再把“有新结果”通知 Root。这样，即使通知没有及时进入当前回合，结果也不会丢失；Root 仍然可以通过主动等待补取。

![从主动等待到被动 Steering 的渐进路径](/posts/codex-subagent/07.png)

这套设计把两个问题分开：Mailbox 负责保存事实，通知通路负责提醒 Root。前者保证可靠性，后者改善响应速度。通知也不应该直接修改 Root 的 `messages`，而是排队到安全的消息边界，等待 Agent 自己开启下一轮处理。

### 3. Pi 实现：`sendMessage` 与 Steering

在 Pi Extension 中，通知通路可以映射成 `sendMessage` 加 Steering。核心顺序是“先落 Mailbox，再发通知”：

```ts
async function onChildSettled(run: TerminalRun) {
  // 先保存终态；通知失败时，Root 仍可通过 wait_agent 补取。
  const message = buildMailboxMessage(run);
  mailbox.post(run.id, message);

  if (typeof pi.sendMessage !== "function") return;

  pi.sendMessage(
    {
      customType: "collaboration.subagent",
      content: formatNotification(message),
      display: true,
      details: { agentId: run.id, status: run.status },
    },
    // steer 等待当前工具边界结束；triggerTurn 让空闲 Root 自动开始下一回合。
    { deliverAs: "steer", triggerTurn: true },
  );
}
```

`steer` 的作用是把消息排进 Root 的下一条安全消息边界，而不是把文本硬插入正在生成的 Assistant 消息；`triggerTurn` 则让已经空闲的 Root 自动消费这条消息。重复结算需要使用 `agentId + status` 之类的交付键去重，避免同一个终态被重复推进。

渐进式实现可直接查看 `passive-perception Worktree`，其中 `notifications.ts` 展示了 Mailbox 先落盘、再通过 `sendMessage` 推送 Steering 的完整路径。

## 结语

Subagent 真正改变的不是“多调用几个模型”，而是把任务调度从同步等待中释放出来：Root 负责拆解与汇总，Child 负责独立执行，Mailbox 负责保存可交付事实。先用主动等待建立稳定的交付协议，再用 Steering 增加被动通知，系统就能在可靠性和响应速度之间逐步演进。

对 Pi 而言，最重要的复刻顺序也因此很清楚：先实现身份、状态、Mailbox 和 JSONL 传输，再把 `sendMessage` 接到安全的 Steering 边界。协议稳定后，更多并发策略和用户体验才有可靠的落点。

## 参考资料

1. [Pi 官方 Subagent Extension Example](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions/subagent)
2. [Pi 官方 Extension 开发文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)
3. [OpenAI Codex 源码仓库](https://github.com/openai/codex)
4. [Codex 多 Agent 工具定义：multi\_agents\_spec.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/multi_agents_spec.rs)
5. [Codex 会话输入队列与 Mailbox：input\_queue.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/session/input_queue.rs)
