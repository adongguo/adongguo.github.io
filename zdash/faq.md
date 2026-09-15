# 常见问题

## 支持哪些平台？

macOS 和 Linux，需要 Node.js 22.14 及以上。

## 安装后运行的不是 zdash？

请确认安装的是带作用域的 `@adongguo/zdash`。npm 上不带作用域的 `zdash` 是另一个无关的包，可以先卸载它再重新安装：

```bash
npm uninstall --global zdash
npm install --global @adongguo/zdash
```

## 启动时提示找不到配置或令牌？

- 配置按 `ZDASH_CONFIG`、当前目录的 `.zdash.yaml`、`~/.config/zdash/config.yaml` 的顺序查找。
- 令牌来自环境变量 `YUNXIAO_ACCESS_TOKEN`，或配置中的 `token_cmd`。

两者缺少任何一项时，zdash 会打印引导信息并以退出码 2 结束。参考 [快速开始](/zdash/guide/getting-started)。

## 为什么仓库里的 .zdash.yaml 不能设置 token_cmd？

`token_cmd` 会在你的机器上执行命令。为了避免克隆下来的仓库借配置执行命令，工作目录里的配置不允许设置 `token_cmd`、`links.file` 和 `links.zmuxBin`。请把它们写在 `~/.config/zdash/config.yaml` 中。

## 会修改云效里的数据吗？

只有你在界面中明确执行的编辑，例如修改状态、负责人或新增评论，才会写入云效。焦点集和本地关联只保存在本机，`--json` 和 `--plain` 输出始终只读。

## 开启鼠标后无法选中文字？

按住 `Shift` 拖动，即可交还终端进行文字选择。也可以在配置中设置 `ui.mouse: false`，或临时设置环境变量 `ZDASH_NO_MOUSE=1`。

## 颜色显示异常，或者界面有残影？

- 终端不支持真彩色时，设置 `ZDASH_THEME=terminal`，或在配置中设置 `ui.theme: terminal`，改用终端自身的配色。
- 在终端复用器中出现残影时，设置 `ZDASH_FULL_REPAINT=1` 关闭增量渲染。

## 看板为什么变回了列表？

看板只支持按状态阶段分组。切换到按负责人或类型分组后会显示为列表；`views.sprint.style` 为 `auto` 时，终端宽度小于 `boardMinWidth`（默认 100 列）也会显示为列表。

## 修改负责人时找不到某个同事？

负责人候选来自当前视图中出现过的成员，以及你自己。可以先切换到包含该同事的视图或迭代，再进行修改。

## 程序异常退出怎么排查？

查看运行日志 `~/.local/state/zdash/zdash.log`。需要更多信息时，设置 `ZDASH_LOG_LEVEL=debug`，启动失败时可以加上 `ZDASH_DEBUG=1` 打印调用栈。

## 收费吗？

zdash 免费使用。

## 如何反馈问题或建议？

请提交到 [问题反馈](https://github.com/adongguo/zdash/issues)。
