# 安装与校验

## 系统要求

macOS 14 及以上，支持 Apple Silicon 与 Intel。

## 下载

打开 [最新版本](https://github.com/adongguo/zmux/releases/latest)，下载两个文件：

- `zmux-<版本>.dmg`：安装包
- `zmux-<版本>.sha256`：校验文件

## 校验

把两个文件放在同一目录，在终端中执行：

```bash
shasum -a 256 -c zmux-<版本>.sha256
```

输出 `OK` 表示安装包完整。

## 安装

1. 打开 DMG，把 `zmux.app` 拖入「应用程序」。
2. 首次打开时，macOS 会提示应用来自互联网，确认后即可使用。安装包已经过签名与公证。

zmux 使用独立的应用标识和配置目录，可以与其他终端同时安装。

## 升级

zmux 不会自动更新。有新版本时，下载新的 DMG，退出 zmux 后覆盖安装即可，配置和会话会保留。

## 卸载

1. 退出 zmux，把 `zmux.app` 移到废纸篓。
2. 如需同时清除本地数据，删除以下目录：
   - `~/Library/Application Support/zmux/`
   - `~/.config/zmux/`
   - `~/.zmuxterm/`
