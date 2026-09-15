# 常见问题

## 装好之后会马上开始自动回复吗？

不会。`init` 生成的配置中发送开关关闭，也不会加载后台服务。你需要依次完成接口验证、Agent 验证，再执行 `dingclawd enable-sending --yes`，并手动加载后台服务，分身才会开始回复。

## 会回复我已经读过，或者很久以前的消息吗？

默认不会。分身只处理你还没读过、15 分钟以内的消息。

## 会在群里乱说话吗？

群聊只处理 @你 的消息。同事在群里召唤分身的功能默认关闭，需要你主动打开 `group_avatar_summon_enabled`。

## 对方知道是 AI 回复的吗？

知道。每条消息正文前都带「[AI 分身代发]」标识，纯文本消息还带钉钉原生的 AI 标记。标识文字可以修改，但不能为空。

## 同事能让分身执行命令吗？

在你打开召唤通道（`self_command_enabled`）并启用了高权限档之后，可以：同事在和你的单聊里发「@你的名字 任务」，就会以高权限档执行。这个开关（`peer_summon_enabled`）默认开启，不需要时设为 `false`。详见 [安全与合规设计](/zclaw/guide/security)。

## 分身会不会重复发送？

发送结果不确定时，zclaw 会把这条标记为待核对，不会自动重发。

## 当天额度用完会怎样？

分身回复一句固定说明，告知这条消息没有进入智能处理，不再调用 Agent。额度按档位分别计算，可以在配置中调整。

## 怎么立即停止分身？

执行 `launchctl bootout gui/$(id -u)/com.dingclaw.<标识>` 停止后台服务，或者在配置中把 `send_enabled` 改为 `false`。

## 支持哪些 Agent？

Qoder CLI、Claude Code 和 Codex。Agent 需要先在本机安装并登录，再通过 `verify-template` 验证。

## 支持哪些平台？

目前只支持 macOS。

## 为什么安装包和命令还叫 dingclaw？

zclaw 由 DingClaw 更名而来，更名仍在进行中。目前请使用 `pipx install dingclaw` 安装，命令为 `dingclawd`。

## 收费吗？

zclaw 免费使用。使用的 Agent 和模型服务按各自的规则计费。

## 如何反馈问题或建议？

请提交到 [问题反馈](https://github.com/adongguo/dingclaw/issues)。
