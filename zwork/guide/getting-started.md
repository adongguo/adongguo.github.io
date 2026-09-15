# 快速开始

## 1. 连接模型

首次打开 zwork 时会显示欢迎页。选择一个模型提供商，填写 API Key 或在浏览器中登录，完成后点击「开始使用」。

想使用命令行 Agent 时，先在本机安装并登录对应工具，zwork 只会列出这台 Mac 上可以运行的 Provider。例如：

- **Qoder CLI**：安装后执行 `qodercli login`。
- **Codex**：安装适配器 `npm install -g @agentclientprotocol/codex-acp`，再运行 `codex` 按提示登录。

## 2. 连接云效

打开「设置 → 工作台」，填写以下信息后点击「保存并测试」：

| 字段 | 说明 |
|---|---|
| API 地址 | 公共云为 `https://openapi-rdc.aliyuncs.com`；其他版本填写你所用云效的 OpenAPI 地址 |
| 组织 ID | 使用公共云时必填 |
| 个人访问令牌 | 在云效中创建的个人访问令牌 |

令牌只保存在本机钥匙串中，不会进入对话。也可以通过环境变量 `YUNXIAO_ACCESS_TOKEN` 提供令牌。

## 3. 选择模式

默认的「自主」模式会自动批准工具调用，Agent 可以直接执行命令、编辑和删除文件。希望重要操作先经过你确认时，在「设置 → 聊天 → 模式」中切换为「智能」或「手动」。

## 4. 开始工作

| 操作 | 方式 |
|---|---|
| 新建工作区 | ⌘ N，为工作区命名并选择所在文件夹 |
| 打开目录 | ⌘ O |
| 新建聊天 | ⌘ T |
| 把工作项交给 Agent | 在工作项上点击「交给 Agent」 |
| 跳转到会话 | ⌘ E |
| 命令面板 | ⌘ ⇧ P |

在输入框中按 `Enter` 发送，`⇧ Enter` 换行。

完整列表见 [快捷键](/zwork/reference/shortcuts)。

## 5. 使用命令行

zwork 自带 `zwork` 命令行，位于应用包内的 `Contents/Resources/bin/zwork`，不会自动加入 `PATH`。安装在「应用程序」文件夹时，可以这样链接到自己的 `PATH` 目录：

```bash
mkdir -p ~/.local/bin
ln -sf /Applications/ZWork.app/Contents/Resources/bin/zwork ~/.local/bin/zwork
zwork desktop ping
```

请确认 `~/.local/bin` 已在 `PATH` 中。

`zwork desktop` 用于控制正在运行的 zwork，详见 [命令行](/zwork/reference/cli)。
