# 全平台账号排行榜功能规划

提供在页面交互右上角快速拉起“全平台账号排行榜”的业务功能，非抽屉式而是直接居中的弹窗，显示所有用户的游戏账号指标排名。

## User Review Required
> [!IMPORTANT]
> 1. 数据来源确认：目前未在前端 `GET /api/accounts` 中看到完整的“金币”、“点券”、“挂机时长”等挂钩字段。我们需要确认这部分数据是由现有的 Node.js 底层核心引擎（Core）抛出，还是需要新加特定请求？我们将优先按“后端提供新接口 `GET /api/leaderboard` 或拓展 `GET /api/accounts`”来对接。
> 2. 排行范围：确认“全平台所有账号”是否涵盖所有不同用户组下的 QQ 农场实例，是否需要按本租户过滤（根据特殊系统规约 1，后端会自动隔离，但若是“全平台”，该业务是否需要超级管理员特权，或是绕过租户插件？请确认业务意图）。

## Proposed Changes

### 1. 弹窗 UI 组件层面
#### [NEW] `web/src/components/LeaderboardModal.vue`
- 基于 `Transition` 实现一个居中的 Modal。
- 采用原生或已有的玻璃态模糊面板 UI（参考 `glass-panel` 类）。
- 顶部：左侧显示奖杯 Icon + 标题“平台排行榜”，右侧放置“排序模式下拉框”（按等级、金币、点券、时长）以及“刷新按钮”。
- 核心区：使用 `table` 或者网格布局（Grid）列出所有农场账号：
  - 前三名的排名数字采用鲜艳的金、银、橙色渐变圆底。
  - 数据列：排名 (Ranking), 账号 (Avatar + Nickname + QQUIN), 金币 (枚举换算万), 点券, 挂机时长, 状态 (在线/运行中绿点)。
- 交互逻辑：支持点击背景阴影区域收起、ESC 按键监听并收起、右上角提供 X 关闭按钮收起。

### 2. Layout 布局调整
#### [MODIFY] `web/src/layouts/DefaultLayout.vue`
- 在右上角 `NotificationBell` 组件侧边增设一个悬浮按钮（`BaseButton` 或直接采用原 `[i-carbon-trophy]` 结合玻璃拟物态）。
- 提供 `@click` 触发绑定，切换新建的弹窗组件状态 `showLeaderboard = true`。

### 3. 数据层（Store/API）
#### [MODIFY] `web/src/api/index.ts` 或新建 store
- 新增调用获取排行榜的方法，并引入防抖/节流。
- 接口契约：设计 `GET /api/accounts/leaderboard?sortBy={level|gold|coupons|uptime}`：
  ```json
  {
    "ok": true,
    "data": [
      {
        "ranking": 1,
        "id": "uuid",
        "avatar": "...",
        "nick": "无问西东黎",
        "uin": "123456",
        "gold": 1565000,
        "coupons": 94,
        "uptime": 240,
        "running": true
      }
    ]
  }
  ```

## Verification Plan

### Automated Tests
- 类型校验：执行并确保新增响应式引用及 API 类型在 TypeScript 检查下无任何飘红报错。

### Manual Verification
1. 界面呈现检查：利用测试账号 (`jsh`:`123456`) 登录测试界面 `http://10.211.55.2:2800`。
2. 按钮触达：由于悬浮按钮安置于右上角不干预主题设置，校验悬浮不打架。
3. 弹窗表现：点击奖杯 -> 居中弹出（确保非抽屉侧边滑出）-> 空白点击测试 -> X 键闭合 -> ESC 关闭。
4. 业务数据渲染：切换“按等级/按金币/按点券/按挂机时长”，核对视图内排行更新。
