---
layout: home
title: zclaw
titleTemplate: 以你本人身份在钉钉里代答的数字分身

hero:
  name: zclaw
  text: 以你本人身份在钉钉里代答的数字分身
  tagline: 只回你还没读过的消息，每一条都带 AI 标识，任何一项检查不通过就停下。免费使用。
  actions:
    - theme: brand
      text: 安装 zclaw
      link: /zclaw/guide/install
    - theme: alt
      text: 安全与合规设计
      link: /zclaw/guide/security

features:
  - title: 以你本人的身份回复
    details: 通过你本机已登录的钉钉命令行工具收发消息，不需要注册钉钉应用，回复出现在你和对方原本的会话里。
  - title: 默认只回未读
    details: 只处理你还没读过、15 分钟以内的消息；群聊只处理 @你 的消息，黑名单里的人一律忽略。
  - title: 每条都带 AI 标识
    details: 发出的每一条消息都带「AI 分身代发」标识，标识文字可以修改，但不能为空。
  - title: 检查不通过就停下
    details: 身份、组织、授权或 Agent 参数任何一项对不上，这一轮就不拉消息、不调模型、不发送。
  - title: 召唤分身干活
    details: 在会话里发 @me 加一句任务，由你启用的高权限 Agent 查证后，把结果发回这个会话。
  - title: 终端面板
    details: 分身不在线时，用终端面板分诊未读、预览会话、起草回复，由你亲自接管。
---

::: warning 启用前请阅读
zclaw 以你本人的身份发消息。启用前请阅读 [安全与合规设计](/zclaw/guide/security)，确认所在组织允许使用数字分身代答，并了解默认开启的「同事单聊召唤」。
:::

## 适合谁

- 在 macOS 上工作，希望不方便看钉钉时，有分身先替自己答复常见问题的人。
- 想在钉钉会话里直接召唤 Agent 查证、整理，再把结论发回会话的人。
- 需要清楚掌控「谁能触发、能做什么、何时停下」的人。

## 名称说明

zclaw 由 DingClaw 更名而来，更名仍在进行中。目前安装包名为 `dingclaw`，命令为 `dingclawd`，本站文档照实使用这些名称。

## 运行要求

- macOS，Python 3.10 及以上
- 钉钉命令行工具 dws，且所在组织已授权 dws 访问钉钉数据
- 至少一个命令行 Agent：Qoder CLI、Claude Code 或 Codex

## 下一步

- [介绍](/zclaw/guide/)
- [安装](/zclaw/guide/install)
- [快速开始](/zclaw/guide/getting-started)
- [安全与合规设计](/zclaw/guide/security)
