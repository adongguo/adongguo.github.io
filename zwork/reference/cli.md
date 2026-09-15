# 命令行

`zwork` 命令行位于应用包内的 `Contents/Resources/bin/zwork`，链接到 `PATH` 的方法见 [快速开始](/zwork/guide/getting-started#_5-使用命令行)。执行 `zwork --help` 或 `zwork <命令> --help` 查看完整参数。

## zwork desktop

控制正在运行的 zwork 桌面应用。它通过本机的控制 socket 通信，使用 zwork 每次启动时重新生成的令牌鉴权。

| 命令 | 说明 |
|---|---|
| `zwork desktop ping` | 检查桌面应用是否在响应 |
| `zwork desktop sessions [--query <文字>]` | 列出会话，可以按名称或目录过滤 |
| `zwork desktop open <会话 ID>` | 在桌面应用中打开已有会话 |
| `zwork desktop new [--dir <路径>] [--prompt <文字>] [--send]` | 新建对话，可以指定工作目录和第一句话；加 `--send` 立即发送 |
| `zwork desktop send <会话 ID> <文字>` | 向会话发送一条消息 |
| `zwork desktop stop <会话 ID>` | 停止会话中正在进行的回合 |
| `zwork desktop commands` | 列出桌面应用可以执行的命令 |
| `zwork desktop run <命令 ID> [--arg KEY=VALUE]...` | 按 ID 执行桌面命令 |
| `zwork desktop theme [<主题 ID>\|system]` | 查看当前主题，或切换主题、跟随系统 |
| `zwork desktop pet on\|off\|toggle` | 显示、隐藏或切换 XiYang 桌面伙伴 |
| `zwork desktop tabs [list]` | 列出工作区及其标签页 |
| `zwork desktop tabs select <会话 ID>` | 激活会话所在的标签页 |
| `zwork desktop tabs close <会话 ID>` | 关闭会话所在的标签页，会话本身保留 |
| `zwork desktop focus` | 把桌面窗口切到前台 |
| `zwork desktop install-skill [--force]` | 把 zwork-desktop 技能安装到 `~/.agents/skills`，让 Agent 学会控制 zwork |

所有 `desktop` 子命令都支持 `--json`，输出原始 JSON 结果。

### 退出码

| 退出码 | 含义 |
|---|---|
| `0` | 成功 |
| `1` | 执行失败 |
| `3` | 桌面应用没有运行 |
| `4` | 鉴权失败 |
| `5` | 桌面应用正在运行，但暂时没有可以处理请求的窗口 |

## 其他命令

| 命令 | 说明 |
|---|---|
| `zwork session`（`zwork s`） | 在终端中开始或继续交互式对话 |
| `zwork run` | 执行指令文件或标准输入中的任务 |
| `zwork configure` | 交互式配置 zwork |
| `zwork info` | 显示 zwork 的信息；`--verbose` 同时显示当前配置，`--check` 测试 Provider 连接 |
| `zwork doctor` | 检查本机配置是否可用 |
| `zwork recipe` | 校验配方、生成配方链接 |
| `zwork skills` | 技能相关工具 |
| `zwork schedule`（`zwork sched`） | 管理定时任务 |
| `zwork review` | 用 zwork 评审当前的代码差异 |
| `zwork completion <shell>` | 生成命令补全脚本 |

## 配置与环境变量

命令行与桌面应用共用 `~/.config/zwork/config.yaml`，同名环境变量优先于配置文件。

| 变量 | 说明 |
|---|---|
| `ZWORK_PROVIDER`、`ZWORK_MODEL` | 默认使用的 Provider 与模型 |
| `ZWORK_MODE` | 默认模式：`auto`（自主）、`smart_approve`（智能）、`approve`（手动）、`chat`（仅聊天） |
| `ZWORK_DISABLE_KEYRING` | 不使用系统钥匙串，凭据改存到 `~/.config/zwork/secrets.yaml` |
| `ZWORK_DISABLE_AUTO_DOWNLOAD` | 设为 `1` 或 `true` 时，桌面应用不自动下载更新 |
| `YUNXIAO_ACCESS_TOKEN` | 云效个人访问令牌 |
