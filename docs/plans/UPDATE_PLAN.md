# QQ Farm Bot UI 2.1 版本更新计划

## 📋 项目概述

**当前版本**: qq-farm-bot-ui-main (单包架构，含 AI 服务)  
**目标版本**: qq-farm-bot-ui-main 2.1 (多包 workspace，纯农场自动化)  
**文档生成日期**: 2026-02-27

---

## 一、核心架构变化

### 1.1 项目结构重构

**变化**: 从单一 `package.json` 改为 pnpm workspace 多包管理

**旧架构**:
```
qq-farm-bot-ui-main/
├── package.json (单一)
├── core/ (后端)
├── web/ (前端)
├── openviking-service/ (AI 服务)
└── AI 相关脚本
```

**新架构**:
```
qq-farm-bot-ui-main 2.1/
├── package.json (根)
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── core/
│   ├── package.json (独立)
│   └── src/
├── web/
│   ├── package.json (独立)
│   └── src/
└── docker-compose.yml
```

**影响**:
- ✅ 依赖管理更清晰
- ✅ 构建流程更规范
- ✅ 支持独立开发和测试
- ✅ 便于 Docker 容器化部署

### 1.2 AI 服务完全移除

**删除文件清单**:
- `ai-autostart.js` - AI 自动启动器
- `ai-services-daemon.js` - AI 守护进程
- `test-autostart.js` - AI 启动测试
- `core/src/services/qwenAIAssistant.js` - 千问 AI 助手
- `core/src/services/contextManager.js` - 上下文管理器
- 整个 `openviking-service/` 目录 (9 个文件)

**删除功能**:
- ❌ AI 编程助手集成
- ❌ 千问 3.5 Plus + OpenViking 服务
- ❌ 所有 AI 相关启动脚本和文档

---

## 二、后端核心更新计划

### 2.1 新增 20 个核心服务文件

**位置**: `core/src/services/`

#### 农场自动化服务 (12 个)

| 文件名 | 功能描述 | 优先级 |
|--------|---------|--------|
| `farm.js` | 农场操作 (收获、浇水、除草、除虫、施肥) | 🔴 高 |
| `friend.js` | 好友互动 (偷菜、帮忙、黑名单管理) | 🔴 高 |
| `task.js` | 任务系统 (每日任务、成就) | 🔴 高 |
| `mall.js` | 商城 (种子、肥料购买) | 🟡 中 |
| `warehouse.js` | 仓库管理 (自动出售、库存) | 🔴 高 |
| `email.js` | 邮件系统 | 🟡 中 |
| `qqvip.js` | VIP 特权 | 🟢 低 |
| `share.js` | 分享奖励 | 🟢 低 |
| `monthcard.js` | 月卡奖励 | 🟢 低 |
| `invite.js` | 邀请系统 | 🟢 低 |
| `openserver.js` | 开服奖励 | 🟢 低 |
| `scheduler.js` | 定时任务调度器 (核心) | 🔴 高 |

#### 基础设施服务 (8 个)

| 文件名 | 功能描述 | 优先级 |
|--------|---------|--------|
| `json-db.js` | JSON 数据库工具 (原子写入、文件锁) | 🔴 高 |
| `logger.js` | 模块化日志 (Winston 集成) | 🔴 高 |
| `push.js` | 推送服务 (Pushoo 集成) | 🟡 中 |
| `qrlogin.js` | 二维码登录 | 🔴 高 |
| `status.js` | 状态同步 | 🔴 高 |
| `stats.js` | 操作统计 | 🟡 中 |
| `analytics.js` | 数据分析 | 🟡 中 |
| `account-resolver.js` | 账号解析器 | 🟡 中 |

### 2.2 新增 Protocol Buffers 协议定义

**位置**: `core/src/proto/`

**16 个 .proto 文件**:
1. `game.proto` - 游戏核心协议
2. `corepb.proto` - 核心协议
3. `plantpb.proto` - 植物相关协议
4. `friendpb.proto` - 好友相关协议
5. `taskpb.proto` - 任务协议
6. `mallpb.proto` - 商城协议
7. `userpb.proto` - 用户协议
8. `itempb.proto` - 物品协议
9. `sharepb.proto` - 分享协议
10. `emailpb.proto` - 邮件协议
11. `redpacketpb.proto` - 红包协议
12. `illustratedpb.proto` - 图鉴协议
13. `visitpb.proto` - 访问协议
14. `notifypb.proto` - 通知协议
15. `shoppb.proto` - 商店协议
16. `qqvippb.proto` - QQ VIP 协议

### 2.3 API 接口精简

**文件**: `core/src/controllers/admin.js`

**删除内容**:
- ❌ 用户管理系统 (注册、登录、续费、修改密码)
- ❌ 卡密管理 (生成、验证、删除、批量操作)
- ❌ 多用户权限控制 (管理员/普通用户)
- ❌ 账号所有权验证中间件
- ❌ 用户状态检查中间件 (封禁、过期)
- ❌ AI 状态监控 API

**简化内容**:
- ✅ 登录接口改为单管理员密码验证
- ✅ 移除 token-user 映射，仅保留 token 验证
- ✅ 代码从 944 行减少到 737 行 (-22%)

### 2.4 数据存储简化

**文件**: `core/src/models/store.js`

**删除配置**:
- ❌ 偷菜过滤配置 (`stealFilter`)
- ❌ 偷好友过滤配置 (`stealFriendFilter`)
- ❌ 植物黑名单/白名单
- ❌ 好友黑名单/白名单

**配置调整**:
- 默认肥料策略从 `'both'` 改为 `'none'`
- 代码从约 670 行减少到约 503 行 (-25%)

### 2.5 新增工具类

**位置**: `core/src/utils/`

| 文件 | 功能 |
|------|------|
| `proto.js` | Protocol Buffers 序列化工具 |
| `network.js` | 网络请求封装 |
| `utils.js` | 通用工具函数 |
| `qrutils.js` | 二维码处理工具 |

### 2.6 新增游戏配置数据

**位置**: `core/src/gameConfig/`

| 文件 | 内容 |
|------|------|
| `Plant.json` | 植物属性配置 (生长时间、收益等) |
| `ItemInfo.json` | 物品信息配置 (种子、肥料、道具) |
| `RoleLevel.json` | 角色等级配置 (经验要求、解锁功能) |

---

## 三、前端全面重构计划

### 3.1 技术栈升级

| 组件 | 旧版本 | 新版本 | 变化 |
|------|--------|--------|------|
| 构建工具 | Vite 5.x | Vite 7.3.1 | ⬆️ 升级 |
| Vue | 3.4.x | 3.5.25 | ⬆️ 升级 |
| TypeScript | 5.4.x | 5.9.3 | ⬆️ 升级 |
| 状态管理 | 无/Composition API | Pinia 3.0.4 | ✅ 新增 |
| CSS 框架 | 自定义 | UnoCSS 66.5.12 | ✅ 新增 |
| 工具库 | 无 | @vueuse/core 14.2.1 | ✅ 新增 |
| 图标 | 无 | @iconify-json | ✅ 新增 |
| 路由 | 基础 | Vue Router 5.0.3 | ✅ 规范化 |

### 3.2 新增页面组件

**位置**: `web/src/views/`

| 文件 | 功能 | 优先级 |
|------|------|--------|
| `Login.vue` | 登录页 (重构，300+ 行) | 🔴 高 |
| `Dashboard.vue` | 仪表板 (重构) | 🔴 高 |
| `Personal.vue` | 个人中心 | 🔴 高 |
| `Accounts.vue` | 账号管理 | 🔴 高 |
| `Friends.vue` | 好友列表 | 🟡 中 |
| `Analytics.vue` | 数据分析 | 🟡 中 |
| `Settings.vue` | 设置页面 | 🟡 中 |

### 3.3 新增功能组件

**位置**: `web/src/components/`

#### 业务组件 (9 个)
- `ThemeToggle.vue` - 主题切换按钮
- `DailyOverview.vue` - 每日概览组件
- `LandCard.vue` - 土地卡片组件
- `FarmPanel.vue` - 农场操作面板
- `BagPanel.vue` - 背包展示面板
- `TaskPanel.vue` - 任务列表面板
- `AccountModal.vue` - 账号编辑弹窗
- `RemarkModal.vue` - 备注编辑弹窗
- `ToastContainer.vue` - 全局提示容器
- `ConfirmModal.vue` - 确认对话框

#### 基础 UI 组件 (5 个)
- `BaseButton.vue` - 基础按钮
- `BaseInput.vue` - 基础输入框
- `BaseSelect.vue` - 基础下拉选择
- `BaseTextarea.vue` - 基础文本域
- `BaseSwitch.vue` - 基础开关

### 3.4 新增 Pinia Stores

**位置**: `web/src/stores/`

| Store | 功能 |
|-------|------|
| `account.ts` | 账号状态管理 |
| `bag.ts` | 背包数据管理 |
| `farm.ts` | 农场数据管理 |
| `friend.ts` | 好友数据管理 |
| `status.ts` | 运行状态管理 |
| `setting.ts` | 设置数据管理 |
| `app.ts` | 应用全局状态 |
| `toast.ts` | 提示消息管理 |

### 3.5 新增配置文件

**位置**: `web/`

| 文件 | 功能 |
|------|------|
| `uno.config.ts` | UnoCSS 配置 |
| `eslint.config.js` | ESLint 配置 |
| `vite.config.ts` | Vite 构建配置 |
| `tsconfig.json` | TypeScript 配置 |
| `tsconfig.app.json` | 应用 TypeScript 配置 |
| `tsconfig.node.json` | Node TypeScript 配置 |
| `router/index.ts` | Vue Router 配置 |

### 3.6 新增布局与 API 封装

| 文件 | 功能 |
|------|------|
| `layouts/DefaultLayout.vue` | 默认页面布局 |
| `api/index.ts` | Axios 封装、统一错误处理 |

---

## 四、部署与 DevOps 计划

### 4.1 Docker 支持

**新增文件**:
- `docker-compose.yml` - Docker Compose 编排配置
- `core/Dockerfile` - Docker 镜像构建文件
- `.dockerignore` - Docker 忽略文件

**Docker Compose 服务**:
- `core` - 后端服务容器
- `web` - 前端构建容器 (或静态文件服务)

### 4.2 CI/CD 配置

**位置**: `.github/workflows/`

| 文件 | 功能 |
|------|------|
| `ci.yml` | 持续集成工作流 (代码检查、测试、构建) |
| `release.yml` | 自动发布工作流 (打标签、打包、发布) |

### 4.3 项目配置

| 文件 | 功能 |
|------|------|
| `pnpm-workspace.yaml` | pnpm 工作区配置 |
| `pnpm-lock.yaml` | 依赖锁定文件 |
| `.gitignore` | Git 忽略文件 |
| `eslint.config.mjs` (core) | ESLint 配置 |
| `eslint.config.js` (web) | ESLint 配置 |

---

## 五、文档清理计划

### 5.1 删除 AI 相关文档 (10 个)

- `README.AI.md` - AI 服务使用说明
- `QUICKSTART.AI.md` - AI 快速入门指南
- `AI-QUICK-REFERENCE.md` - AI 快速参考
- `AUTO-START-GUIDE.md` - 自动启动指南
- `AUTO-START-README.md` - 自动启动说明
- `INTEGRATION_SUMMARY.md` - AI 集成总结
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `TESTING_GUIDE.md` - 测试指南
- `DEPLOYMENT.md` - 部署指南
- `PROJECT_SUMMARY.md` - 项目总结

### 5.2 更新保留文档

- `README.md` - 主文档 (更新架构说明、安装步骤)
- `CHANGELOG.md` - 变更日志 (记录 2.1 版本更新)

---

## 六、实施优先级与步骤

### 🔴 阶段一：核心架构迁移 (预计 1-2 天)

1. ✅ 创建 pnpm workspace 配置
2. ✅ 拆分 `core/package.json` 和 `web/package.json`
3. ✅ 移除所有 AI 相关文件
4. ✅ 更新根目录 `package.json` 脚本
5. ✅ 安装新依赖 (protobufjs、pinia、unocss 等)

### 🔴 阶段二：后端核心更新 (预计 3-4 天)

6. ✅ 精简 `admin.js` API 接口
7. ✅ 简化 `store.js` 数据存储
8. ✅ 实现 `json-db.js` 数据库工具
9. ✅ 实现 `logger.js` 日志服务
10. ✅ 实现 `scheduler.js` 调度器
11. ✅ 实现 `qrlogin.js` 二维码登录
12. ✅ 实现 `status.js` 状态服务
13. ✅ 实现 `farm.js` 农场服务
14. ✅ 实现 `friend.js` 好友服务
15. ✅ 实现 `warehouse.js` 仓库服务
16. ✅ 实现 `task.js` 任务服务

### 🟡 阶段三：前端重构 (预计 4-5 天)

17. ✅ 配置 UnoCSS、TypeScript、ESLint
18. ✅ 实现 Pinia stores (8 个)
19. ✅ 实现基础 UI 组件 (5 个)
20. ✅ 重构 `Login.vue` (登录/注册双模式)
21. ✅ 重构 `Dashboard.vue`
22. ✅ 实现 `Personal.vue`
23. ✅ 实现 `Accounts.vue`
24. ✅ 实现 `Sidebar.vue` 和路由配置
25. ✅ 实现 API 封装
26. ✅ 实现业务组件 (土地卡片、农场面板等)

### 🟡 阶段四：功能完善 (预计 2-3 天)

27. ✅ 实现其余服务 (mall、email、qqvip 等)
28. ✅ 实现 Protocol Buffers 序列化
29. ✅ 实现推送服务 (push.js)
30. ✅ 实现数据分析 (analytics.js)
31. ✅ 实现游戏配置数据加载

### 🟢 阶段五：部署与测试 (预计 1-2 天)

32. ✅ 配置 Docker 和 docker-compose
33. ✅ 配置 CI/CD 工作流
34. ✅ 编写部署文档
35. ✅ 全面功能测试
36. ✅ 性能优化

### 🟢 阶段六：文档与发布 (预计 1 天)

37. ✅ 清理 AI 相关文档
38. ✅ 更新 README.md
39. ✅ 编写 CHANGELOG.md
40. ✅ 发布 2.1 版本

---

## 七、迁移注意事项

### ⚠️ 重要提醒

1. **用户系统完全移除**
   - 从多用户 SaaS 平台变为单用户自用工具
   - 所有用户管理 API 删除
   - 前端 Users.vue 和 Cards.vue 页面删除

2. **卡密系统删除**
   - 不再支持商业化运营功能
   - 卡密生成、验证、续费功能全部移除
   - 注册功能改为可选 (如果需要保留)

3. **AI 服务剥离**
   - 专注农场自动化核心功能
   - 所有 AI 相关启动脚本删除
   - client.js 中的 AI 启动逻辑移除

4. **配置变更**
   - 偷菜过滤配置移除
   - 植物/好友黑白名单移除
   - 默认肥料策略改为 'none'

5. **登录方式简化**
   - 仅保留密码验证
   - 移除用户名 + 密码多用户登录
   - Token 验证逻辑简化

### 📦 数据迁移

**需要迁移的数据**:
- 账号配置数据 (保留)
- 管理员密码哈希 (保留)
- 运行状态数据 (保留)

**不再需要的数据**:
- 用户数据 (user-store.js)
- 卡密数据 (cards)
- AI 相关配置

---

## 八、技术栈对比

### 后端技术栈

| 技术 | 旧版本 | 新版本 | 说明 |
|------|--------|--------|------|
| Node.js | 18+ | 18+ | 保持不变 |
| Express | 4.x | 4.x | 保持不变 |
| Socket.IO | 4.x | 4.8.3 | 升级 |
| Protocol Buffers | ❌ | protobufjs 8.0.0 | 新增 |
| 日志 | console | Winston 3.18.3 | 升级 |
| 二维码 | ❌ | qrcode 1.5.4 | 新增 |
| 推送 | pushoo | pushoo 0.1.11 | 保持不变 |

### 前端技术栈

| 技术 | 旧版本 | 新版本 | 说明 |
|------|--------|--------|------|
| Vue | 3.4.x | 3.5.25 | 升级 |
| Vite | 5.x | 7.3.1 | 升级 |
| TypeScript | 5.4.x | 5.9.3 | 升级 |
| 状态管理 | 无 | Pinia 3.0.4 | 新增 |
| CSS | 自定义 | UnoCSS 66.5.12 | 新增 |
| 工具库 | 无 | @vueuse/core 14.2.1 | 新增 |
| 路由 | 基础 | Vue Router 5.0.3 | 规范化 |
| 图标 | 无 | @iconify-json | 新增 |

---

## 九、预计时间与资源

### 时间估算

| 阶段 | 预计时间 | 说明 |
|------|---------|------|
| 阶段一：核心架构迁移 | 1-2 天 | 基础配置、依赖安装 |
| 阶段二：后端核心更新 | 3-4 天 | 服务实现、API 精简 |
| 阶段三：前端重构 | 4-5 天 | 组件开发、状态管理 |
| 阶段四：功能完善 | 2-3 天 | 辅助功能、优化 |
| 阶段五：部署与测试 | 1-2 天 | Docker、CI/CD、测试 |
| 阶段六：文档与发布 | 1 天 | 文档更新、发布 |
| **总计** | **12-17 天** | 约 2-3 周 |

### 人员建议

- **后端开发**: 1 人 (熟悉 Node.js、Express、Protocol Buffers)
- **前端开发**: 1 人 (熟悉 Vue 3、Pinia、TypeScript)
- **测试**: 1 人 (功能测试、性能测试)

---

## 十、风险评估

### 🔴 高风险

1. **数据迁移风险**
   - 用户数据和卡密数据需要妥善处理
   - 建议：提前备份，提供数据导出功能

2. **功能缺失风险**
   - 移除 AI 服务可能影响部分用户
   - 建议：在文档中明确说明定位变化

### 🟡 中风险

3. **技术栈升级风险**
   - Vue 3.5、Vite 7、TypeScript 5.9 可能存在兼容性问题
   - 建议：充分测试，逐步升级

4. **调度器稳定性**
   - 新增的 scheduler.js 是核心组件
   - 建议：编写完善的测试用例

### 🟢 低风险

5. **UI/UX 变化**
   - 前端界面变化较大，用户需要适应
   - 建议：提供更新说明和截图

---

## 十一、验收标准

### 功能验收

- [ ] 账号可以正常登录
- [ ] 农场自动化功能正常运行
- [ ] 好友互动功能正常
- [ ] 定时任务调度正常
- [ ] 数据持久化正常
- [ ] 推送通知正常

### 性能验收

- [ ] 启动时间 < 5 秒
- [ ] API 响应时间 < 200ms
- [ ] 内存占用稳定
- [ ] 无内存泄漏

### 代码质量

- [ ] ESLint 检查通过
- [ ] TypeScript 类型检查通过
- [ ] 关键功能有测试覆盖
- [ ] 文档完整

---

## 十二、后续维护

### 维护重点

1. **农场自动化核心功能** - 持续优化
2. **调度器稳定性** - 监控和改进
3. **前端用户体验** - 收集反馈
4. **性能优化** - 定期分析

### 未来规划

- 支持更多游戏功能
- 优化调度算法
- 增强数据分析能力
- 改进 UI/UX

---

**文档状态**: ✅ 已完成  
**最后更新**: 2026-02-27  
**维护者**: 开发团队
