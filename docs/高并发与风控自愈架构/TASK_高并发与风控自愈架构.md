# 核心优化拆解：高并发与风控自愈架构 (Phase 2)

## Phase 1: 解决数据库并发回查 (防启动雪崩)
- [x] 1.1 `core/src/models/store.js`：提供一个 `getAccountsFull(ids)` 或者修改 `getAccounts` 方法，支持无损全量拉取账号配置与 `auth_data`。
- [x] 1.2 `core/src/runtime/runtime-engine.js`：将 `startAllAccounts()` 的 `store.getAccounts()` 改为带权限配置的全量拉取。
- [x] 1.3 `core/src/controllers/admin.js`：将后台 API 触发的部分一键启动，或者新增账号时可能带残缺指纹的地方，与新的批量方法结合。
- [x] 1.4 `core/src/runtime/data-provider.js`：如果有冗余的针对单个请求的 `getAccountFull` 兜底，可以评估移除或保留。

## Phase 2: "1002003" 封禁风控软着陆与自愈
- [x] 2.1 给 Runtime 注入一个 `suspendUntil` 状态变量。
- [x] 2.2 `core/src/models/user-store.js` 或状态中心：扩展供前端呈现的运行时“被休眠”状态 (Suspended)。
- [x] 2.3 `core/src/services/farm.js`：在执行捕捉到 `1002003` 封禁（截获字符串）时，不要再提示封禁弹窗恐吓，而是触发 `suspendUntil = 现时间 + 30分钟`。
- [x] 2.4 `core/src/services/friend.js`：与 2.3 同样机制，同步检测休眠标记。
- [x] 2.5 拦截放行：主挂机循环如果判定在这个时间点没有越过 `suspendUntil`，直接 Skip 跳过当次巡视，进入沉默。

## Phase 3: 全量熔断退避机制与防风控探针 (Jitter)
- [x] 3.1 引入 `errorConsecutiveCount`，如果巡回方法连续报错超过阈值，不使用基础休眠，而是进入 `5s -> 15s -> 60s` 的指数退避 (Exponential Backoff)，一旦返回成功或有工作产出则重置计数。
- [x] 3.2 对所有批量好友动作（如 `runBatchWithFallback` 或 `sleep`），替换并引入 Jitter（抖动）函数 `sleep(BASE + Math.floor(Math.random() * WAVE))`，防止机械规律发包。
- [x] 3.3 文档撰写记录更新。
