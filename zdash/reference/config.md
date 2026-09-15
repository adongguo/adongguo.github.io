# 配置

## 配置文件位置

zdash 按以下顺序查找配置，使用找到的第一个：

1. 环境变量 `ZDASH_CONFIG`，或 `--config` 指定的文件
2. 当前工作目录下的 `.zdash.yaml`
3. `~/.config/zdash/config.yaml`

工作目录下的 `.zdash.yaml` 不允许设置 `token_cmd`、`links.file` 和 `links.zmuxBin`，避免仓库里的配置在你的机器上执行命令。

## 基本

| 键 | 默认值 | 说明 |
|---|---|---|
| `organizationId` | 必填 | 云效组织 ID |
| `project` | 必填 | 云效项目 ID |
| `baseUrl` | 必填 | 云效 OpenAPI 地址，需带 `https://` |
| `edition` | 按 `baseUrl` 判断 | `central` 或 `region`；地址为 `openapi-rdc.aliyuncs.com` 时视为中心版 |
| `token_cmd` | 无 | 输出令牌的命令，只读取第一行，超时 10 秒；设置了环境变量 `YUNXIAO_ACCESS_TOKEN` 时优先使用环境变量 |
| `defaultView` | `sprint` | 交互模式默认打开的视图：`bugs`、`reqs`、`sprint`、`focus`、`tasks` |
| `refresh.intervalSeconds` | `300` | 自动刷新间隔（秒），`0` 表示关闭 |
| `refresh.onFocus` | `true` | 终端重新获得焦点时刷新 |

## 视图分区

`views.bugs`、`views.reqs`、`views.tasks` 各自包含 1–9 个分区。写了 `sections` 就会替换该视图的全部默认分区。

```yaml
views:
  bugs:
    sections:
      - title: 我的未解
        filters: { category: Bug, assignedTo: self, statusNames: ["待确认", "再次打开", "处理中"] }
      - title: 本迭代全部
        filters: { category: Bug, sprint: current }
```

| 键 | 说明 |
|---|---|
| `title` | 分区标题 |
| `filters.category` | 必填，工作项类别，例如 `Bug`、`Req`、`Task`，多个用逗号分隔 |
| `filters.assignedTo`、`filters.creator` | 负责人、创建人；`self` 表示你自己 |
| `filters.sprint` | 迭代 ID，`current` 表示当前迭代，多个用逗号分隔 |
| `filters.projectIds` | 项目 ID 列表 |
| `filters.statusNames` | 状态名列表 |
| `filters.statusStage` | 状态阶段 ID，多个用逗号分隔 |
| `filters.workitemType`、`filters.tag`、`filters.priority`、`filters.seriousLevel`、`filters.subject` | 类型、标签、优先级、严重程度、标题 |
| `filters.createdAfter`、`filters.createdBefore`、`filters.updatedAfter`、`filters.updatedBefore` | 日期，格式为 `YYYY-MM-DD` |
| `statusOrder` | 按状态排序：每一项是一个状态名，或一组并列的状态名 |

## 迭代视图

| 键 | 默认值 | 说明 |
|---|---|---|
| `views.sprint.groupBy` | `statusStage` | 分组维度：`statusStage`、`assignee`、`type` |
| `views.sprint.defaultAssignee` | `self` | 打开时的负责人过滤：`self`、`all` 或用户 ID |
| `views.sprint.categories` | `Req` | 显示的工作项类别 |
| `views.sprint.showBugs` | `false` | 是否同时显示缺陷 |
| `views.sprint.showCompleted` | `false` | 是否显示已完成的迭代 |
| `views.sprint.stageNames` | `{}` | 状态阶段 ID 到显示名的映射 |
| `views.sprint.style` | `list` | `list` 列表；`board` 看板；`auto` 终端足够宽时使用看板 |
| `views.sprint.boardMinWidth` | `100` | `auto` 切换到看板所需的最小终端列数，范围 40–400 |
| `views.focus.maxItems` | `50` | 焦点集最多容纳的工作项数，范围 1–200 |

## 列

`columns.bugs`、`columns.reqs`、`columns.tasks` 指定表格列，可选值：`serialNumber`、`status`、`seriousLevel`、`priority`、`assignedTo`、`creator`、`workitemType`、`sprint`、`subject`、`gmtCreate`、`gmtModified`。

| 视图 | 默认列 |
|---|---|
| 缺陷 | `serialNumber`、`status`、`seriousLevel`、`priority`、`assignedTo`、`subject` |
| 需求 | `serialNumber`、`workitemType`、`status`、`priority`、`assignedTo`、`subject` |
| 任务 | `serialNumber`、`status`、`priority`、`assignedTo`、`sprint`、`subject` |

## 界面

| 键 | 默认值 | 说明 |
|---|---|---|
| `ui.theme` | 内置主题 | 设为 `terminal` 时使用终端自身的配色和背景 |
| `ui.accentColor`、`ui.markColor` | 主题默认 | 强调色、标记色，格式为 `#RRGGBB` |
| `ui.borderStyle` | `round` | `round`、`single`、`double`、`classic` |
| `ui.animations` | `true` | 是否启用动画 |
| `ui.previewPosition` | `auto` | 预览面板位置：`auto`、`right`、`bottom` |
| `ui.footer` | `auto` | 底栏提示：`auto`、`minimal` |
| `ui.density` | `auto` | 行密度：`auto`、`compact`、`comfortable` |
| `ui.detailBar` | `auto` | 详情栏：`auto`、`always`、`off` |
| `ui.rowDot` | `auto` | 行首圆点显示的字段：`auto`、`priority`、`seriousLevel`、`off` |
| `ui.statusColors` | `{}` | 按状态名覆盖状态颜色：`green`、`yellow`、`cyan`、`red`、`gray`、`none` |
| `ui.boardCardGap` | `true` | 看板卡片之间留空行 |
| `ui.titleFirst` | `false` | 把标题放在第一列 |
| `ui.rowScroll` | `true` | 列太多时横向滚动，而不是隐藏列 |
| `ui.breakpoints` | `sm: 52`、`md: 80`、`lg: 120` | 响应式布局的终端列数断点 |
| `ui.mouse` | `true` | 是否启用鼠标 |

默认情况下，状态颜色按阶段区分：确认阶段为黄色，完成为绿色，取消为灰色，其余不着色。

## 日志与本地关联

| 键 | 默认值 | 说明 |
|---|---|---|
| `log.level` | `info` | `off`、`error`、`warn`、`info`、`debug` |
| `log.file` | 无 | 日志文件的绝对路径 |
| `links.enabled` | `false` | 启用工作项与本机目录、zmux 工作区的关联 |
| `links.file` | `~/.config/zdash/links.json` | 关联注册表的绝对路径 |
| `links.zmuxBin` | `PATH` 中的 `zmux` | zmux 可执行文件 |

## 多个组织或项目

用 `profiles` 在一个文件里维护多套完整配置，各 profile 之间不继承设置：

```yaml
defaultProfile: work
profiles:
  work:
    organizationId: "<组织 ID>"
    project: "<项目 ID>"
    baseUrl: "https://openapi-rdc.aliyuncs.com"
  demo:
    organizationId: "<另一个组织 ID>"
    project: "<项目 ID>"
    baseUrl: "https://openapi-rdc.aliyuncs.com"
```

选择顺序：`--profile`、`ZDASH_PROFILE`、`defaultProfile`，只有一个 profile 时直接使用它。

## 环境变量

| 变量 | 说明 |
|---|---|
| `YUNXIAO_ACCESS_TOKEN` | 云效个人访问令牌，优先于 `token_cmd` |
| `ZDASH_CONFIG` | 配置文件路径 |
| `ZDASH_PROFILE` | 使用的 profile |
| `ZDASH_FOCUS_FILE` | 焦点集文件路径 |
| `ZDASH_LINKS_FILE` | 本地关联注册表路径，优先于 `links.file` |
| `ZDASH_LOG_FILE`、`ZDASH_LOG_LEVEL` | 日志文件与级别 |
| `ZDASH_EDITOR` | 编辑描述和评论时使用的编辑器，其次读取 `VISUAL`、`EDITOR` |
| `ZDASH_THEME` | 设为 `terminal` 时使用终端自身配色 |
| `ZDASH_MARK_COLOR` | 标记色 |
| `ZDASH_NO_MOUSE` | 设为 `1` 时关闭鼠标 |
| `ZDASH_NO_ALTSCREEN` | 设为 `1` 时在主屏幕渲染 |
| `ZDASH_FULL_REPAINT` | 设为 `1` 时关闭增量渲染，用于解决残影 |
| `ZDASH_DEBUG` | 设为 `1` 时在启动失败后打印调用栈 |
| `ZMUX_BIN` | zmux 可执行文件，优先于 `links.zmuxBin` |

开关类变量只认值 `1`。
