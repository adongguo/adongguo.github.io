# 常见问题

## 支持哪些平台？

macOS 14 及以上，支持 Apple Silicon 与 Intel。

## 支持哪些编码 Agent？

zmux 是终端，任何在终端里运行的 Agent 都可以直接使用。执行 `zmux hooks setup` 后，受支持的 Agent 还能在侧栏显示运行状态，并在重新打开 zmux 时续接会话，包括 Claude Code、Codex、OpenCode、Gemini、Cursor CLI、Qoder 等。

## 通知是怎么触发的？

终端程序通过标准的终端通知序列（OSC 9、OSC 99、OSC 777）发出通知，或者执行 `zmux notify`，都会点亮面板的通知环、在侧栏显示未读标记并弹出系统通知。

## 可以用脚本控制 zmux 吗？

可以。`zmux` 命令行和 Unix socket 可以创建工作区、分屏、发送输入、读取屏幕内容和发送通知。执行 `zmux --help` 查看全部命令。

## 会保存我的会话吗？

会。退出时自动保存窗口、工作区、面板布局、工作目录和滚动缓冲，电脑重启后同样可以还原。正在运行的进程不会被快照，重新打开后以普通终端的形式恢复；接入钩子的 Agent 会自动续接原会话，不需要时可以在「设置 → Terminal」里关闭自动续接。

## 可以自定义快捷键和外观吗？

可以。工作区、分屏和通知相关的快捷键在设置中修改；终端的主题、字体、配色和按键绑定沿用 `~/.config/ghostty/config`；侧栏、标签栏等 zmux 自身的设置在 `~/.config/zmux/zmux.json`。

## 为什么没有内置浏览器？

zmux 不提供内置浏览器，网页链接会在系统默认浏览器中打开。

## 可以和其他终端同时安装吗？

可以。zmux 使用独立的应用标识、配置目录和 socket，不会影响已安装的其他终端。

## 收费吗？

zmux 免费使用。

## 如何反馈问题或建议？

请提交到 [问题反馈](https://github.com/adongguo/zmux/issues)。
