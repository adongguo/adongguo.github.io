# 快速开始

从初始化完成到分身发出第一条回复。每一步都可以停下来检查：在你执行 `enable-sending` 之前，zclaw 不会发出任何消息。

::: warning 开始前
请确认所在组织允许使用数字分身代答，并阅读 [安全与合规设计](/zclaw/guide/security)。
:::

## 1. 写好人设

`init` 已在 `~/.dingclaw/` 下生成人设工作区：

| 文件 | 用途 |
|---|---|
| `IDENTITY.md` | 你是谁、负责什么 |
| `SOUL.md` | 说话的语气和原则 |
| `skill/` | 分身可以用到的专业知识 |
| `knowledge/people.md` | 常联系的人 |

生成回复的 Agent 不直接读取这些文件，zclaw 会按权限档位把内容拼进提示词。写完后，可以查看普通档实际拼出的内容：

```bash
~/.dingclaw/bin/dingclaw skill restricted
```

## 2. 验证钉钉接口

```bash
dingclawd verify-contracts
```

它用你的 dws 身份逐项检查 zclaw 需要的接口，其中发送检查只发到你自己的会话。核对输出无误后，记录验证结果：

```bash
dingclawd verify-contracts --attest --yes
```

任何一项没有通过，验证结果都不会被记录。

## 3. 验证 Agent

```bash
dingclawd verify-template --agent qoder --tier restricted
```

zclaw 只运行与内置模板完全一致的 Agent 命令。探测通过、核对无误后记录：

```bash
dingclawd verify-template --agent qoder --tier restricted --attest --yes
```

## 4. 启用发送

```bash
dingclawd doctor
```

当 `doctor` 只剩 `send_enabled is false` 这一项时，执行：

```bash
dingclawd enable-sending --yes
```

还有其他未完成的项时，`enable-sending` 会拒绝执行并列出它们。

## 5. 先跑一轮，再常驻

```bash
dingclawd poll
```

`poll` 只执行一轮，适合先观察效果。确认无误后加载后台服务，之后每次登录都会自动启动：

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.dingclaw.<标识>.plist
```

运行日志写在 `~/.local/state/dingclaw/launchd.out.log`。

## 6. 验证第一条回复

请一位同事给你发一条单聊消息，你先不要点开。下一轮轮询时，分身会以你的身份回复，消息带有「[AI 分身代发]」标识。

## 7. 用终端面板接管

```bash
dingclawd tui
```

面板只负责展示和操作，是否发送、能不能触发，都由 zclaw 服务本身判断。

## 随时停止

```bash
launchctl bootout gui/$(id -u)/com.dingclaw.<标识>
```

也可以在配置中把 `send_enabled` 改为 `false`，下一次发送前生效。

## 下一步

- [安全与合规设计](/zclaw/guide/security)
- [配置](/zclaw/reference/config)
- [命令行](/zclaw/reference/cli)
