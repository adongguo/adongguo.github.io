# 安装与更新

## 系统要求

macOS 12 及以上，支持 Apple Silicon。

## 下载

打开 [最新版本](https://github.com/adongguo/zwork/releases/latest)，下载两个文件：

- `ZWork-<版本>-arm64.dmg`：安装包
- `ZWork-<版本>-arm64.sha256`：校验文件

## 校验

把两个文件放在同一目录，在终端中执行：

```bash
shasum -a 256 -c --ignore-missing ZWork-<版本>-arm64.sha256
```

校验文件同时包含 DMG 和更新用 zip 两行，`--ignore-missing` 会跳过没有下载的 zip。DMG 一行输出 `OK` 表示安装包完整。

## 安装

1. 打开 DMG，把应用拖入「应用程序」文件夹。
2. 从「应用程序」中打开 zwork。安装包已经过签名与 Apple 公证。

## 自动更新

- zwork 启动后会检查 GitHub 上的新版本，之后大约每 6 小时检查一次。
- 新版本在后台下载，下载完成后点击「重启以更新」完成安装。有未保存的文件时，会先提醒你。
- 安装前会校验更新包的签名、Apple 公证和版本号，任何一项不符都不会安装。
- 不想自动下载时，在「设置 → 应用」中关闭「自动下载更新」，或设置环境变量 `ZWORK_DISABLE_AUTO_DOWNLOAD=1`。之后仍可以手动检查和下载。

自动更新要求 zwork 位于「应用程序」文件夹，并且你对该文件夹有写入权限。直接从磁盘映像中运行，或者 macOS 从临时副本运行 zwork 时，不会自动更新。

::: tip 从 1.51.0 升级
1.51.0 不会检查更新，请手动下载并安装一次新版本，之后即可自动更新。
:::

## 卸载

1. 退出 zwork，把应用从「应用程序」移到废纸篓。
2. 如需同时清除本地数据，删除以下目录：
   - `~/Library/Application Support/ZWork/`
   - `~/.config/zwork/`
   - `~/.local/share/zwork/`
   - `~/.local/state/zwork/`
3. 在「钥匙串访问」中删除名为「ZWork Safe Storage」和「zwork」的项目。
