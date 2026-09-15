# 配置

配置文件位于 `~/.config/dingclaw/config.json`，由 `init` 生成完整的键和默认值。文件权限必须为 0600，且不能是符号链接，否则拒绝加载。zclaw 每一轮都会重新读取配置，修改后无需重启。

以下默认值为代码中的默认值。

## 身份与连接

| 键 | 默认值 | 说明 |
|---|---|---|
| `owner_display_name` | 由 `init` 写入 | 你在钉钉里显示的名字，用于识别召唤 |
| `self_mention_names` | `[]` | @ 你时可能出现的其他名字 |
| `self_user_ids` | 由 `init` 写入 | 你的钉钉 userId |
| `self_open_dingtalk_ids` | 由 `init` 写入 | 你的 openDingTalkId，与 userId 必须同时配置 |
| `dws_binary` | 由 `init` 写入 | dws 可执行文件的绝对路径 |
| `dws_profile` | 由 `init` 写入 | dws 的组织，只能是单一组织 |
| `sender_mode` | `init` 写入 `personal` | `personal` 以本人身份发送；`bot` 以同组织的机器人发送，需要额外配置机器人 |

## 发送开关

以下键由命令写入，请不要手动打开。

| 键 | 默认值 | 写入方式 |
|---|---|---|
| `send_enabled` | `false` | `enable-sending --yes` 打开；紧急停止时可以手动改回 `false` |
| `contract_verified`、`verified_contracts` | `false`、`[]` | `verify-contracts --attest --yes` |
| `agent_templates_verified` | `[]` | `verify-template --attest --yes` |

## 回复规则

| 键 | 默认值 | 说明 |
|---|---|---|
| `avatar_mode` | `auto` | `auto` 回复全部命中的消息；`summon` 只处理你召唤过的会话 |
| `unread_gate_enabled` | `true` | 只处理你还没读过的消息 |
| `max_message_age_seconds` | `900` | 跳过更早的消息，范围 60–86400 |
| `poll_interval_seconds` | `180` | 轮询间隔（秒） |
| `max_jobs_per_poll` | `3` | 每一轮最多处理的消息数 |
| `deny_user_ids` | `[]` | 黑名单，按不可变钉钉 userId 匹配 |
| `tier_standard_user_ids` | `[]` | 使用白名单档的人 |
| `ai_disclosure_text` | `[AI 分身代发]` | AI 标识文字，不能为空，最多 40 个字符 |

## 召唤

| 键 | 默认值 | 说明 |
|---|---|---|
| `self_command_enabled` | `false` | 召唤通道总开关，关闭时下列召唤均不生效 |
| `peer_summon_enabled` | `true` | 同事在单聊中「@你的名字 任务」以高权限档执行，见 [安全与合规设计](/zclaw/guide/security) |
| `group_avatar_summon_enabled` | `false` | 同事在群里真实 @你 并写「分身」加任务时，以高权限档执行，回复公开发进群 |
| `robot_summon_names` | `[]` | 你 @ 这些机器人名加任务，等同于 `@me` 加任务；只认你本人发出的消息 |

## Agent 与额度

| 键 | 默认值 | 说明 |
|---|---|---|
| `agents` | 由 `init` 写入 | 启用的 Agent 与档位。新增 Agent 或启用高权限档后，需要对相应档位运行 `verify-template` |
| `agent_config_home` | 空 | 分身专用的 Agent 配置目录，必须是绝对路径。留空时使用你本人的 Agent 配置 |
| `daily_agent_call_limit` | `100` | 普通档每日调用额度 |
| `daily_agent_call_limit_by_tier` | `{}` | 按档位覆盖额度；未设置时白名单档为 30、高权限档为 20 |
| `long_task_enabled` | `true` | 高权限档的长任务：最长 3600 秒，连续 600 秒没有进展即停止 |
| `continuous_tasks_enabled` | `false` | 持续任务：召唤后建立卡片，同一发起人的补充与纠正合并后继续执行 |

## 本机通知

| 键 | 默认值 | 说明 |
|---|---|---|
| `local_notify_scope` | `all` | 哪些消息弹出 macOS 通知：`all`、`unanswered` 或 `off` |
| `local_notify_body` | `excerpt` | 通知内容：`excerpt` 显示消息摘录；`sender_only` 只显示发送人，避免同事的原话出现在锁屏上 |
