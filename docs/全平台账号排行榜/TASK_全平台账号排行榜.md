# 任务拆解与执行：全平台账号排行榜

## 阶段1：后端数据对齐与接口准备
- [ ] 分析后端核心引擎，确定账号“金币、点券、挂机时长”字段的具体来源。
- [ ] （如需）在 Node.js Backend / Java Backend `Accounts` 模块补充针对 `GET /api/leaderboard` 或拓展 `GET /api/accounts` API 的全量数据返回与租户范围隔离（或全平台开放）。

## 阶段2：前端状态管理改造 (store)
- [ ] 在 `web/src/stores/account.ts` 中新增调用排行榜 API 的方法，补充排行所需数据的 TypeScript 类型（包含 `ranking`, `accountId`, `avatar`, `nickname`, `uin`, `gold`, `coupons`, `uptime`, `status`）。

## 阶段3：构建组件与 UI 视图
- [ ] 新增 `web/src/components/LeaderboardModal.vue`。
- [ ] 实现基础模态框的居中弹出、退出交互（点击空白、关闭按钮、ESC键）以及毛玻璃背景样式。
- [ ] 实现顶部的排序下拉菜单（等级/金币/点券/时长）及右侧刷新按钮，并绑定对 API 方法的调用。
- [ ] 实现表格核心区 UI，完成账号排名数据渲染，金银铜排名的独立样式设计。

## 阶段4：业务挂载及验证
- [ ] 修改 `web/src/layouts/DefaultLayout.vue`，在右上角通知区添加悬浮榜单入口（奖杯 Icon）。
- [ ] 将前端功能联调跑通，并在 `10.211.55.2:2800` 环境使用指定测试账号 (`jsh`:`123456`) 完成全链路验收，确保拉起无障碍，切换排序逻辑准确无误。
