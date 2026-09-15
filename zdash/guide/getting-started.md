# 快速开始

## 1. 准备令牌

在云效中创建个人访问令牌。zdash 优先读取环境变量 `YUNXIAO_ACCESS_TOKEN`，也可以在配置中用 `token_cmd` 指定一条输出令牌的命令，令牌不会写入磁盘。

在 macOS 上，推荐把令牌存进钥匙串：

```bash
security add-generic-password -s zdash-yunxiao-token -a "$USER" -w
```

命令会提示输入令牌。之后在配置中这样读取：

```yaml
token_cmd: "security find-generic-password -s zdash-yunxiao-token -w"
```

## 2. 写配置

创建 `~/.config/zdash/config.yaml`，填入组织、项目和云效 OpenAPI 地址：

```yaml
organizationId: "<组织 ID>"
project: "<项目 ID>"
baseUrl: "https://openapi-rdc.aliyuncs.com"
token_cmd: "security find-generic-password -s zdash-yunxiao-token -w"
```

- 使用中心版云效时，`baseUrl` 为 `https://openapi-rdc.aliyuncs.com`；其他版本请填写你所用云效的 OpenAPI 地址。
- 出于安全考虑，工作目录里的 `.zdash.yaml` 不允许设置 `token_cmd`，请写在 `~/.config/zdash/config.yaml` 或 `--config` 指定的文件中。

完整配置项见 [配置](/zdash/reference/config)。

## 3. 打开看板

```bash
zdash
```

默认打开迭代视图：当前迭代里分配给你的需求，按状态阶段分组。缺少配置或令牌时，zdash 会打印引导信息并退出。

## 4. 常用操作

| 操作 | 按键 |
|---|---|
| 切换视图 | `1`–`5` |
| 上下移动 | `j` / `k` |
| 切换分区 | `h` / `l` |
| 预览 | `Enter` |
| 在浏览器中打开 | `o` |
| 流转状态 | `m` |
| 编辑 | `e` |
| 加入焦点 | `f` |
| 命令面板 | `⌃K` |
| 键位帮助 | `?` |

完整列表见 [键位](/zdash/reference/keys)。

## 5. 交给脚本和 Agent

```bash
zdash bugs --json --section 1     # 我的未解缺陷
zdash sprint --json               # 当前迭代的需求，按阶段分组
zdash focus --json                # 焦点集中的工作项
```

命令与输出格式见 [命令行](/zdash/reference/cli)。
