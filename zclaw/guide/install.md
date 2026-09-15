# 安装

## 运行要求

- macOS
- Python 3.10 及以上，推荐使用 [pipx](https://pipx.pypa.io/) 安装
- 钉钉命令行工具 dws，且所在组织已授权 dws 访问钉钉数据
- 至少一个已在本机登录的命令行 Agent：Qoder CLI（默认）、Claude Code 或 Codex
- 终端面板需要 Node.js 20 及以上；未安装时自动改用简化版面板

## 1. 安装并登录 dws

dws 由钉钉官方提供，安装方式以 [钉钉开放平台](https://open.dingtalk.com/) 为准，也可以通过 npm 安装：

```bash
npm install -g dingtalk-workspace-cli --registry=https://registry.npmmirror.com
dws --version
```

用设备码登录你的组织，把 `<corpId>` 换成组织的 corpId：

```bash
dws auth login --device --profile <corpId> --format json
dws auth status --profile <corpId> --format json
```

`auth status` 显示已认证且令牌有效，即表示登录完成。

## 2. 安装 zclaw

```bash
pipx install dingclaw
dingclawd --version
```

本站文档对应 0.4.6 及以上版本。

## 3. 初始化

```bash
dingclawd whoami
dingclawd init --owner-name <你的显示名> --agent qoder
dingclawd doctor
```

- `whoami` 只读，确认 dws 登录的是你本人，并找到你的两个不可变钉钉 ID。
- `init` 生成配置、人设工作区和后台服务描述文件。`--agent` 可选 `qoder`、`claude`、`codex`。
- `doctor` 列出启用前还需要完成的每一项。

`init` 不会打开发送，也不会加载后台服务。接下来按 [快速开始](/zclaw/guide/getting-started) 完成验证并启用。

## 本机文件

| 内容 | 位置 |
|---|---|
| 配置（权限必须为 0600，且不能是符号链接） | `~/.config/dingclaw/config.json` |
| 人设工作区 | `~/.dingclaw/` |
| 状态数据库与运行日志 | `~/.local/state/dingclaw/` |
| 后台服务 | `~/Library/LaunchAgents/com.dingclaw.<标识>.plist` |

## 升级

1. 停止后台服务：

   ```bash
   launchctl bootout gui/$(id -u)/com.dingclaw.<标识>
   ```

2. 备份 `~/.local/state/dingclaw/` 下的 `state.db`，以及同名的 `-wal`、`-shm` 文件。
3. 升级并检查。`doctor` 会完成数据库结构迁移：

   ```bash
   pipx upgrade dingclaw
   dingclawd doctor
   ```

4. 用 `dingclawd poll` 确认一轮运行正常，再重新加载后台服务：

   ```bash
   launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.dingclaw.<标识>.plist
   ```

## 卸载

1. 停止后台服务，并删除 `~/Library/LaunchAgents/com.dingclaw.<标识>.plist`。
2. 卸载程序：

   ```bash
   pipx uninstall dingclaw
   ```

3. 如需同时清除本地数据，删除 `~/.config/dingclaw/`、`~/.dingclaw/` 和 `~/.local/state/dingclaw/`。

dws 的登录状态由 dws 自己管理，卸载 zclaw 不会影响它。
