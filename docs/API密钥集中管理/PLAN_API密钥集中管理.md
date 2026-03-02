# 第三方 API 密钥集中管理方案

## 需求共识 (Goal & Consensus)
- **目标**：将现散落在代码和 `config.js` 环境变量中的第三方业务 API Key 集中管理，实现“控制台化”配置，避免换环境或迭代时反复跨文件硬编码修改。
- **作用范围**：当前项目与外部功能性交互强相关的 API 配置（微信扫码 API：`wxApiKey`, `wxApiUrl`, `wxAppId`）。
- **排除范围**：不涉及通知告警渠道的 Token（由各用户独立维护），也不涉及内部开发助理 Coding AI 的环境变量。

## 系统设计与边界约束
1. **数据持久层**：利用现有高效的 `store.js` Json 持久化基础设施。针对全局配置域 `globalConfig` 进行扩容，加入 `thirdPartyApi` 模块。
   - 所有写入自动通过 `saveGlobalConfigImmediate` 刷盘至 `store.json`。
2. **鉴权分离**：由于 API Key 属于高敏感数据资产，前端仅允许 `role === 'admin'` 的超级管理员通过受保护的 HTTP 接口读写。
3. **调用解耦**：改造业务消费端 (`admin.js` 内部的微信获取和扫码轮询 fetch 处)，剥离对 `CONFIG` 的直接依赖，改为请求前即时调用 `store.getThirdPartyApiConfig()` 拉取配置映射。

## 接口契约
### 1. `GET /api/admin/third-party-api`
- **Auth**: 需要管理员 `x-admin-token`。
- **Response**:
```json
{
  "ok": true,
  "data": {
    "wxApiKey": "xxx",
    "wxApiUrl": "xxx",
    "wxAppId": "xxx"
  }
}
```

### 2. `POST /api/admin/third-party-api`
- **Auth**: 需要管理员 `x-admin-token`。
- **Payload**:
```json
{
  "wxApiKey": "yyy",
  "wxApiUrl": "yyy",
  "wxAppId": "yyy"
}
```
- **Response**: 返回更新后的完整配置。

## 涉及改造文件 (Impact Scope)
- `core/src/config/config.js`：清理硬编码逻辑或将其转化为降级默认值。
- `core/src/models/store.js`：注入 `thirdPartyApi` 对象，完善序列化规范化约束。
- `core/src/controllers/admin.js`：新增专属 Express 路由，调整微信登录拉取部分的数据上下文引用。
- `web/src/stores/setting.ts`：增加对应通信管道与状态树。
- `web/src/views/Settings.vue`：加入 Vue 3 Composition API 管理下的前端录入面板。
