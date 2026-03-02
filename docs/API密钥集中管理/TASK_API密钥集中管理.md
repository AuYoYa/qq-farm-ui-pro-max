# TASK: API 密钥集中管理方案

## 实施总揽
- [ ] 阶段 1：构建持久化与后端配置层
- [ ] 阶段 2：控制层路由注入与业务无感解耦
- [ ] 阶段 3：前端界面建设与对接

---

## 拆解任务细则 (Atomize tasks)

### 阶段 1：构建持久化与后端配置层
- [ ] 修改 `core/src/models/store.js`
  - [ ] 增加 `DEFAULT_THIRD_PARTY_API_CONFIG` 配置项模板。
  - [ ] 在 `globalConfig` 初始化模型里引入该项，并在解析和保存时 (`normalize` 与 `sanitizeGlobalConfigBeforeSave`) 加载。
  - [ ] 提供 `getThirdPartyApiConfig` 和 `setThirdPartyApiConfig` 两个导出函数予以控制层调用。

### 阶段 2：控制层路由注入与业务无感解耦
- [ ] 修改 `core/src/controllers/admin.js`
  - [ ] 注册增加 `GET /api/admin/third-party-api` 及 `POST /api/admin/third-party-api` 接口，强制启用鉴权中间件拦截非管理员。
  - [ ] 定位所有涉及微信 API 交互（`/api/qr/create`, `/api/qr/check` 下 `action=getqr/checkqr/jslogin` 等处），去除 `CONFIG.wx...` 引用，动态查询当前最新的第三方配置并参与参数构建。
- [ ] 修改 `core/src/config/config.js`
  - [ ] 如果其他模块还在用默认配置，保留硬编码作为旧版兼容，但实际上运行态直接吃 `store` 优先的动态对象。

### 阶段 3：前端界面建设与对接
- [ ] 修改 `web/src/stores/setting.ts`
  - [ ] 补齐 `SettingsState` 里 `thirdPartyApi` 字段类型定义。
  - [ ] 在 `useSettingStore` 里增加新的拉取和存取接口动作 `fetchThirdPartyApi`, `saveThirdPartyApi`。
- [ ] 修改 `web/src/views/Settings.vue`
  - [ ] 在超管视觉控制区（判定 `isAdmin === true` 的区域）新增一个卡片面板：“第三方 API 设置”。
  - [ ] 提供修改微信 `ApiKey`, `ApiUrl`, `AppId` 的三项表单输入，并配备一键保存防阻断交互气泡。
