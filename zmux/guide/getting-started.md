# 快速开始

## 1. 组织你的终端

| 操作 | 快捷键 |
|---|---|
| 新建工作区 | ⌘ N |
| 向右分屏 / 向下分屏 | ⌘ D / ⌘ ⇧ D |
| 新建标签页 | ⌘ T |
| 在工作区之间切换 | ⌘ 1–8，或 ⌃ ⌘ ] / ⌃ ⌘ [ |
| 重命名工作区 | ⌘ ⇧ R |

完整列表见 [快捷键](/zmux/reference/shortcuts)。

## 2. 使用命令行

在 zmux 的终端里，`zmux` 命令可以直接使用：

```bash
zmux list-workspaces
zmux identify
```

如果想在其他终端里使用，按 ⌘ ⇧ P 打开命令面板，运行 **Shell Command: Install 'zmux' in PATH**，命令会安装到 `/usr/local/bin/zmux`。

## 3. 接入编码 Agent

先安装你使用的编码 Agent 命令行工具，确保它在 `PATH` 中，然后执行：

```bash
zmux hooks setup
```

zmux 会安装它能找到的所有受支持 Agent 的钩子，并列出跳过的项目。也可以只为某个 Agent 安装：

```bash
zmux hooks setup codex
```

安装钩子后，侧栏会显示 Agent 的运行状态，重新打开 zmux 时可以续接 Agent 会话。Claude Code 需要在设置中开启 Claude 集成。

## 4. 让 Agent 通知你

任何脚本或 Agent 都可以发送通知：

```bash
zmux notify --title "构建完成" --body "测试全部通过"
```

终端程序发出的 OSC 9、OSC 99、OSC 777 通知同样会触发通知环。按 ⌘ ⇧ U 跳到最新的未读通知，⌘ I 打开通知面板。

## 5. 调整配置

- zmux 自身的设置：全局配置在 `~/.config/zmux/zmux.json`，项目内可以放 `.zmux/zmux.json`。
- 终端的主题、字体和配色沿用 `~/.config/ghostty/config`。
- 修改后按 ⌘ ⇧ , 或执行 `zmux reload-config` 重新加载。
- 也可以按 ⌘ , 打开设置界面调整。

## 6. 恢复会话

退出 zmux 时会自动保存当前会话，重新打开时自动还原。需要手动恢复上一次的会话时，按 ⌘ ⇧ O，或执行：

```bash
zmux restore-session
```
