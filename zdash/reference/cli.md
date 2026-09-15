# 命令行

```text
zdash [view] [选项]
```

不带 `--json` 或 `--plain` 且标准输出是终端时，打开交互式看板；否则输出结构化结果，适合脚本和 Agent 使用。

## 视图

| view | 视图 |
|---|---|
| `bugs` | 缺陷 |
| `reqs` | 需求 |
| `sprint` | 迭代 |
| `focus` | 焦点 |
| `tasks` | 任务 |

交互模式下不指定 view 时，打开配置中的 `defaultView`，默认是迭代视图。非交互输出不指定 view 时，固定输出缺陷视图。

## 通用选项

| 选项 | 说明 |
|---|---|
| `--json` | 输出 JSON |
| `--plain` | 输出 TSV；标准输出不是终端时默认使用 |
| `--section <n\|标题子串>` | 只输出指定分区，适用于 `bugs`、`reqs`、`tasks` |
| `--limit <n>` | 每个分区最多输出 n 条 |
| `--config <path>` | 指定配置文件，等价于 `ZDASH_CONFIG` |
| `--profile <name>` | 选择配置中的 profile，等价于 `ZDASH_PROFILE` |
| `-h`，`--help` | 帮助 |
| `-v`，`--version` | 版本 |

## 迭代视图选项

| 选项 | 说明 |
|---|---|
| `--sprint <current\|ID\|名称子串>` | 选择迭代，默认 `current` |
| `--assignee <self\|名字\|用户 ID>` | 按负责人过滤 |
| `--group-by <stage\|assignee\|type>` | 分组维度，默认 `stage` |
| `--with-bugs` | 同时输出缺陷，默认只输出需求 |

## 焦点集

焦点集只保存在本机的 `focus.json` 中，不修改云效。

```bash
zdash focus add <编号> [--id <长 ID>]
zdash focus rm <编号>
zdash focus ls [--json | --plain]
```

`zdash focus --json` 输出焦点视图，会逐项查询云效详情；`focus ls` 只读取本地文件。只有 `focus add` 需要令牌。

## 本地关联

把工作项关联到本机的工作目录和 zmux 工作区，需要在配置中设置 `links.enabled: true`。

```bash
zdash link add <编号> --workspace <工作区> [--item-dir <绝对路径>] [--worktree <绝对路径>]... [--branch <分支>] [--id <长 ID>]
zdash link rm <编号> [--workspace <工作区>]
zdash link ls [<编号>] [--json | --plain]
zdash link open <编号> [--workspace <工作区>]
```

- `--worktree` 可以给多次，会整体替换已保存的 worktree 列表；一次都不给时保留原值；`--no-worktree` 清空列表。
- `link open` 切换到关联的 zmux 工作区。zmux 可执行文件的查找顺序为 `ZMUX_BIN`、`links.zmuxBin`、`PATH` 中的 `zmux`。

## 输出格式

所有 JSON 输出都带有 `view`、`organizationId`、`project`、`baseUrl` 和 `generatedAt`。其余顶层字段按视图不同：

| 视图 | 主要字段 |
|---|---|
| `bugs`、`reqs`、`tasks` | `sections`：分区列表，每项含 `title`、`total`、`fetched`、`warnings`、`error` 与 `items` |
| `sprint` | `sprint`（迭代信息）、`groupBy`、`assignee`、`total`、`people`（每人计数）、`groups`（分组及其 `items`） |
| `focus` | `total`、`returned`、`counts`（按类别计数）、`groups`（分组及其 `items`，每项另有 `settled` 表示是否已完结） |

每个工作项的字段：`serialNumber`、`subject`、`url`、`categoryId`、`workitemType`、`status`、`statusStageId`、`priority`、`seriousLevel`、`assignedTo`、`creator`、`sprint`、`labels`、`gmtCreate`、`gmtModified`。启用本地关联时还有 `localLinks`。

缺陷、需求和任务视图的 TSV 列依次为：`section`、`serialNumber`、`status`、`priority`、`seriousLevel`、`type`、`assignedTo`、`subject`、`url`，第一行为表头。

输出中的文本字段会清除终端控制字符，可以放心交给 `jq -r` 等工具。

## 退出码

| 退出码 | 含义 |
|---|---|
| `0` | 成功 |
| `1` | 查询或执行失败 |
| `2` | 参数或配置错误 |
| `3` | 功能未启用，例如未开启本地关联时使用 `link` |

## 示例

```bash
zdash bugs --json --section 1                       # 我的未解缺陷
zdash sprint --json --group-by assignee --with-bugs # 当前迭代按负责人分组，含缺陷
zdash reqs --plain | awk -F'\t' '{print $2, $8}'    # 需求编号与标题
```
