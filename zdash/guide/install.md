# 安装

## 运行要求

- macOS 或 Linux
- Node.js 22.14 及以上
- 内置主题需要支持真彩色的终端；不支持时可以改用终端自身的配色，见 [常见问题](/zdash/faq)

## 安装

```bash
npm install --global @adongguo/zdash
zdash --version
```

::: warning 注意包名
请安装带作用域的 `@adongguo/zdash`。npm 上不带作用域的 `zdash` 是另一个无关的包。
:::

## 升级

```bash
npm install --global @adongguo/zdash@latest
```

## 从 yxdash 迁移

zdash 由 yxdash 更名而来，新包只提供 `zdash` 命令。旧的配置和环境变量在 2.0.0 之前继续可用：

- `~/.config/zdash/` 下没有对应文件时，zdash 会读取并继续写入 `~/.config/yxdash/` 中的 `config.yaml`、`focus.json` 和 `links.json`。
- 工作目录里的 `.yxdash.yaml` 仍然有效，优先级低于同一目录下的 `.zdash.yaml`。
- `ZDASH_*` 环境变量为空时，读取对应的 `YXDASH_*`。

要完成迁移，把 `~/.config/yxdash/` 下的文件复制到 `~/.config/zdash/`，并把环境变量改为 `ZDASH_*` 前缀。确认可用后，可以卸载旧包：

```bash
npm uninstall --global @adongguo/yxdash
```

## 本机文件

| 内容 | 位置 |
|---|---|
| 配置 | `~/.config/zdash/config.yaml` |
| 焦点集 | `~/.config/zdash/focus.json` |
| 本地关联 | `~/.config/zdash/links.json` |
| 运行日志 | `~/.local/state/zdash/zdash.log`，设置了 `XDG_STATE_HOME` 时位于其下的 `zdash/` |

## 卸载

```bash
npm uninstall --global @adongguo/zdash
```

如需同时清除本地数据，删除 `~/.config/zdash/` 和 `~/.local/state/zdash/`。
