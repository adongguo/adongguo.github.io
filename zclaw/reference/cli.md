# 命令行

安装后使用 `dingclawd` 命令。除 `whoami` 和 `init` 外，各命令默认读取 `~/.config/dingclaw/config.json`，可以用 `--config <路径>` 指定其他配置文件。执行 `dingclawd --version` 查看版本。

## 初始化

| 命令 | 说明 |
|---|---|
| `whoami` | 只读。确认 dws 登录的是你本人，并列出你的不可变钉钉 ID |
| `init --owner-name <显示名>` | 生成配置、人设工作区和后台服务描述文件，不打开发送、不加载服务 |

`init` 的常用参数：

| 参数 | 说明 |
|---|---|
| `--agent qoder\|claude\|codex` | 启用的 Agent，默认 `qoder` |
| `--dws-profile <corpId>` | 指定 dws 的组织，默认使用当前登录的组织 |
| `--force` | 配置文件已存在时覆盖它 |

## 检查与启用

| 命令 | 说明 |
|---|---|
| `doctor` | 检查配置、dws 授权与各项验证，列出启用前还欠的每一项；升级后运行时会完成数据库结构迁移 |
| `status` | 查看实例状态，以及是否已具备自动发送条件 |
| `verify-contracts` | 探测 zclaw 需要的钉钉接口，发送检查只发给你自己；核对后加 `--attest --yes` 记录结果 |
| `verify-template --agent <Agent> --tier <档位>` | 探测 Agent 命令是否与内置模板一致，档位为 `restricted` 或 `privileged`；核对后加 `--attest --yes` 记录结果 |
| `enable-sending --yes` | 其余检查全部通过时打开发送 |

## 运行

| 命令 | 说明 |
|---|---|
| `poll` | 执行一轮：拉取、筛选、生成并发送回复 |
| `run` | 常驻循环，每一轮重新读取配置；后台服务就是以这个命令运行 |
| `pull-now` | 人工立即触发一轮，**会真实回复消息**，不要当作只读检查使用 |
| `tui` | 打开终端面板 |

## 只读查看

以下命令只读取，不修改任何状态。

| 命令 | 说明 |
|---|---|
| `inbox` | 收件箱列表，`--hours` 默认 24 |
| `conversations` | 最近的会话，`--limit` 默认 100 |
| `messages --conversation-id <ID>` | 某个会话的最近消息，`--limit` 默认 8 |
| `timeline` | 所有会话按时间混合，`--hours` 默认 8 |
| `search --query <关键词>` | 搜索聊天记录，`--days` 默认 30 |

## 黑名单

| 命令 | 说明 |
|---|---|
| `blacklist add --user-id <userId>` | 加入黑名单，命令返回后不会再有发给这个人的新消息 |
| `blacklist remove --user-id <userId>` | 移出黑名单 |
| `blacklist list` | 查看黑名单 |

## 查看人设内容

`init` 在 `~/.dingclaw/bin/` 下生成了 `dingclaw` 辅助脚本。查看普通档实际拼进提示词的内容：

```bash
~/.dingclaw/bin/dingclaw skill restricted
```

## 终端面板常用键位

在面板中按 `?` 查看完整键位。

| 按键 | 操作 |
|---|---|
| `1`–`5` | 切换视图：分诊、全部会话、时间线、未读、找我的 |
| `j` / `k`，`↓` / `↑`，`⌃N` / `⌃P` | 上下移动 |
| `Enter`，`l` | 打开会话 |
| `Tab` | 在列表和会话之间切换 |
| `/` | 筛选当前列表 |
| `s` | 跨会话搜索聊天记录 |
| `⌃F` | 搜人并开始聊天 |
| `:`，`⌃K` | 命令面板 |
| `a`，`⌃T` | 让分身起草回复 |
| `i` | 撰写消息 |
| `m` / `t` | 静音 / 置顶会话 |
| `r`，`⌃L` | 刷新 |
| `R` | 标为已读 |
| `M` | 切换分身模式，需要确认 |
| `q` | 退出 |

撰写框中，`Enter` 发送，`⌃G` 打开外部编辑器，`Esc` 收起并保留草稿。
