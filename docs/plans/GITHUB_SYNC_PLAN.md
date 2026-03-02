# GitHub 同步计划

> 创建时间：2026-03-01  
> 目标：将项目安全脱敏后同步到 GitHub

---

## 📋 目录

1. [敏感信息识别](#敏感信息识别)
2. [脱敏策略](#脱敏策略)
3. [文件分类清单](#文件分类清单)
4. [同步文件夹结构](#同步文件夹结构)
5. [执行步骤](#执行步骤)
6. [后续维护](#后续维护)

---

## 🔍 敏感信息识别

### 1. API 密钥与凭证

| 文件 | 敏感内容 | 风险等级 |
|------|---------|---------|
| `core/.env.ai` | `DASHSCOPE_API_KEY=sk-2cabc0684b6943ef81020be207ec8f17` | 🔴 高危 |
| `openviking-service/.env` | `DASHSCOPE_API_KEY=sk-2cabc0684b6943ef81020be207ec8f17` | 🔴 高危 |
| `core/data/store.json` | `adminPasswordHash`, `offlineReminder.token`, `offlineReminder.endpoint` | 🟡 中危 |
| `core/data/accounts.json` | 用户账号信息（QID、密码等） | 🔴 高危 |
| `core/data/farm-bot.db` | SQLite 数据库（包含所有用户数据） | 🔴 高危 |

### 2. 第三方服务密钥

| 服务 | 用途 | 敏感字段 |
|------|------|---------|
| 阿里云百炼 | AI 编程助手 | `DASHSCOPE_API_KEY` |
| 微信二维码 | 微信扫码登录 | `api_key: ZoBsM8RqTA326a02tWgQOmOb` |
| Pushoo 推送 | 下线通知 | `endpoint`, `token` |

### 3. 个人信息

| 类型 | 位置 | 脱敏方式 |
|------|------|---------|
| QQ 群号 | README.md, 代码注释 | 保留（公开信息） |
| 作者名 | 代码水印 | 保留（公开信息） |
| 测试账号 | 文档示例 | 使用示例账号 `jsh / 123456` |

---

## 🛡️ 脱敏策略

### 策略一：完全排除（不上传）

**目标文件类型：**
- `.env` 文件（除 `.env.example` 外）
- `*.db` 数据库文件
- `*.json` 数据文件（除配置模板外）
- `logs/` 日志目录
- `.llm-chat-history/` 聊天历史
- `.specstory/` 规范历史
- `.agent/` AI 代理配置
- `node_modules/` 依赖包

**实现方式：**
```gitignore
# 敏感数据
.env
*.db
*.db-wal
*.db-shm
data/*.json
data/*.db

# 日志
logs/
*.log

# AI 历史
.llm-chat-history/
.specstory/
.agent/

# 依赖
node_modules/
dist/

# 本地配置
openviking-service/.env
core/.env.ai
```

### 策略二：模板化（提供示例）

**需要创建 `.example` 模板的文件：**

1. **`core/.env.ai.example`**
```bash
# AI 编程助手配置

# OpenViking 服务地址
OPENVIKING_URL=http://localhost:5000

# 阿里云百炼 API Key（千问 3.5 Plus）
# 获取地址：https://dashscope.console.aliyun.com/
DASHSCOPE_API_KEY=sk-your-api-key-here

# 是否启用 AI 编程助手
AI_ASSISTANT_ENABLED=true

# 默认使用上下文记忆
AI_USE_CONTEXT=true

# AI 生成参数
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=4096
```

2. **`openviking-service/.env.example`**（已存在）
```bash
# OpenViking 服务配置

# OpenViking 工作目录
OPENVIKING_WORKSPACE=./openviking_data

# OpenViking 服务端口
OPENVIKING_PORT=5000

# Flask 调试模式
FLASK_DEBUG=False

# 阿里云百炼 API Key（千问 3.5 Plus）
# 获取地址：https://dashscope.console.aliyun.com/
DASHSCOPE_API_KEY=sk-your-api-key-here

# OpenViking 配置文件路径（可选，默认 ~/.openviking/ov.conf）
# OPENVIKING_CONFIG=~/.openviking/ov.conf
```

3. **`core/data/store.json.example`**
```json
{
  "accountConfigs": {},
  "defaultAccountConfig": {
    "automation": {
      "farm": true,
      "friend": true,
      "friend_steal": true,
      "fertilizer": "none"
    },
    "plantingStrategy": "preferred",
    "preferredSeedId": 0,
    "intervals": {
      "farm": 2,
      "friend": 10
    }
  },
  "ui": {
    "theme": "dark",
    "loginBackground": "",
    "colorTheme": "default",
    "performanceMode": true
  },
  "offlineReminder": {
    "channel": "webhook",
    "reloginUrlMode": "none",
    "endpoint": "",
    "token": "",
    "title": "账号下线提醒",
    "msg": "账号下线",
    "offlineDeleteSec": 120
  },
  "adminPasswordHash": "",
  "trialCardConfig": {
    "enabled": true,
    "days": 1,
    "dailyLimit": 50,
    "cooldownMs": 14400000,
    "adminRenewEnabled": true,
    "userRenewEnabled": false,
    "maxAccounts": 1
  }
}
```

4. **`core/data/accounts.json.example`**
```json
{
  "accounts": [],
  "nextId": 1
}
```

### 策略三：代码脱敏

**需要修改的代码文件：**

1. **`core/src/controllers/admin.js`**
   - 行 1072: 微信二维码 API 密钥
   - 行 1100: 微信二维码 API 密钥
   
   **修改为：**
   ```javascript
   // 从环境变量读取，默认值仅用于演示
   const WX_API_KEY = process.env.WX_QR_API_KEY || 'YOUR_WX_API_KEY_HERE';
   ```

2. **`core/src/services/qrlogin.js`**（如包含硬编码密钥）
   - 检查所有第三方 API 密钥
   - 迁移到环境变量

---

## 📁 文件分类清单

### ✅ 可以上传的文件

#### 核心代码
- [x] `core/src/**/*.js` - 所有后端源代码
- [x] `core/package.json` - 依赖配置
- [x] `core/config/**/*.js` - 配置文件
- [x] `core/proto/**/*.proto` - 协议定义
- [x] `core/gameConfig/**/*.json` - 游戏静态数据

#### 前端代码
- [x] `web/src/**/*.vue` - Vue 组件
- [x] `web/src/**/*.ts` - TypeScript 代码
- [x] `web/src/**/*.css` - 样式文件
- [x] `web/package.json` - 前端依赖
- [x] `web/index.html` - 入口 HTML

#### 文档
- [x] `README.md` - 项目说明（需更新）
- [x] `CHANGELOG.DEVELOPMENT.md` - 开发日志
- [x] `docs/**/*.md` - 详细文档
- [x] `pic/**/*.svg` - 架构图和截图
- [x] `PROJECT_ROADMAP.md` - 项目路线图

#### 部署配置
- [x] `docker-compose.yml` - Docker 配置
- [x] `Dockerfile` - 容器镜像
- [x] `.github/workflows/**/*.yml` - GitHub Actions
- [x] `start.sh` / `start.bat` - 启动脚本

#### 示例配置
- [x] `core/.env.ai.example` - AI 配置模板
- [x] `openviking-service/.env.example` - OpenViking 配置模板
- [x] `core/data/store.json.example` - 存储配置模板
- [x] `core/data/accounts.json.example` - 账号配置模板

### ❌ 禁止上传的文件

#### 敏感数据
- [ ] `core/.env.ai` - 包含真实 API 密钥
- [ ] `openviking-service/.env` - 包含真实 API 密钥
- [ ] `core/data/*.json` - 真实用户数据
- [ ] `core/data/*.db` - SQLite 数据库
- [ ] `core/data/*.db-wal` - 数据库日志
- [ ] `core/data/*.db-shm` - 数据库共享内存

#### 日志与历史
- [ ] `logs/` - 运行日志
- [ ] `.llm-chat-history/` - AI 聊天历史
- [ ] `.specstory/` - 规范历史
- [ ] `*.log` - 所有日志文件

#### 依赖与构建
- [ ] `node_modules/` - npm 依赖包
- [ ] `web/dist/` - 构建产物（可选上传）
- [ ] `dist/` - 发布包

#### AI 与代理
- [ ] `.agent/` - AI 代理配置
- [ ] `.cursor/` - Cursor IDE 配置

---

## 📂 同步文件夹结构

### 创建 GitHub 专用文件夹

```bash
# 创建同步文件夹
mkdir -p github-sync

# 复制需要上传的文件
cp -r core/src github-sync/core/
cp -r web/src github-sync/web/
cp -r docs github-sync/
cp -r pic github-sync/
cp -r .github github-sync/

# 复制配置文件
cp README.md github-sync/
cp CHANGELOG.DEVELOPMENT.md github-sync/
cp PROJECT_ROADMAP.md github-sync/
cp docker-compose.yml github-sync/
cp Dockerfile github-sync/
cp start.sh github-sync/
cp start.bat github-sync/

# 复制示例配置
cp core/.env.ai.example github-sync/core/
cp openviking-service/.env.example github-sync/openviking-service/
cp core/data/store.json.example github-sync/core/data/
cp core/data/accounts.json.example github-sync/core/data/

# 复制 package.json
cp package.json github-sync/
cp core/package.json github-sync/core/
cp web/package.json github-sync/web/

# 复制 pnpm 配置
cp pnpm-workspace.yaml github-sync/
cp pnpm-lock.yaml github-sync/
```

### 同步文件夹结构预览

```
github-sync/
├── .github/                    # GitHub Actions 配置
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── core/                       # 后端代码
│   ├── src/                    # 源代码 ✅
│   ├── config/                 # 配置 ✅
│   ├── data/
│   │   ├── store.json.example  # 配置模板 ✅
│   │   └── accounts.json.example # 账号模板 ✅
│   ├── .env.ai.example         # AI 配置模板 ✅
│   └── package.json            # 依赖 ✅
├── web/                        # 前端代码
│   ├── src/                    # 源代码 ✅
│   ├── index.html              # 入口 ✅
│   └── package.json            # 依赖 ✅
├── docs/                       # 文档 ✅
├── pic/                        # 图片 ✅
├── README.md                   # 项目说明 ✅
├── CHANGELOG.DEVELOPMENT.md    # 更新日志 ✅
├── docker-compose.yml          # Docker 配置 ✅
├── Dockerfile                  # 容器镜像 ✅
├── start.sh                    # Linux 启动脚本 ✅
├── start.bat                   # Windows 启动脚本 ✅
├── package.json                # 根配置 ✅
├── pnpm-workspace.yaml         # pnpm 工作空间 ✅
└── pnpm-lock.yaml              # 依赖锁定 ✅
```

---

## 🚀 执行步骤

### 阶段一：准备工作（预计 30 分钟）

#### 1.1 创建 `.gitignore` 文件

在项目根目录创建或更新 `.gitignore`：

```gitignore
# 依赖
node_modules/
.pnpm-store/

# 敏感数据
.env
.env.local
.env.*.local
*.db
*.db-wal
*.db-shm
data/*.json
data/*.db

# 日志
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# AI 历史
.llm-chat-history/
.specstory/
.agent/

# IDE
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.cursor/

# 构建产物
dist/
build/
*.exe
*.app
*.dmg

# 临时文件
*.tmp
*.swp
.DS_Store
Thumbs.db

# 特定敏感文件
openviking-service/.env
core/.env.ai
core/data/*.json
core/data/*.db
```

#### 1.2 创建配置模板

```bash
# 创建 core/.env.ai.example
cat > core/.env.ai.example << 'EOF'
# AI 编程助手配置

# OpenViking 服务地址
OPENVIKING_URL=http://localhost:5000

# 阿里云百炼 API Key（千问 3.5 Plus）
# 获取地址：https://dashscope.console.aliyun.com/
DASHSCOPE_API_KEY=sk-your-api-key-here

# 是否启用 AI 编程助手
AI_ASSISTANT_ENABLED=true

# 默认使用上下文记忆
AI_USE_CONTEXT=true

# AI 生成参数
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=4096
EOF

# 创建 core/data/store.json.example
cat > core/data/store.json.example << 'EOF'
{
  "accountConfigs": {},
  "defaultAccountConfig": {
    "automation": {
      "farm": true,
      "friend": true,
      "friend_steal": true,
      "fertilizer": "none"
    }
  },
  "ui": {
    "theme": "dark",
    "loginBackground": "",
    "colorTheme": "default",
    "performanceMode": true
  },
  "offlineReminder": {
    "channel": "webhook",
    "endpoint": "",
    "token": ""
  },
  "adminPasswordHash": "",
  "trialCardConfig": {
    "enabled": true,
    "days": 1,
    "dailyLimit": 50
  }
}
EOF

# 创建 core/data/accounts.json.example
cat > core/data/accounts.json.example << 'EOF'
{
  "accounts": [],
  "nextId": 1
}
EOF
```

### 阶段二：代码脱敏（预计 1 小时）

#### 2.1 修改硬编码 API 密钥

**文件：`core/src/controllers/admin.js`**

定位到第 1069-1073 行和第 1097-1101 行，修改：

```javascript
// 修改前（第 1072 行）
api_key: 'ZoBsM8RqTA326a02tWgQOmOb'

// 修改后
api_key: process.env.WX_QR_API_KEY || 'YOUR_WX_API_KEY_HERE'
```

#### 2.2 添加环境变量说明

**文件：`README.md`**

在"环境要求"章节后添加：

```markdown
### 环境变量配置

项目使用环境变量管理敏感信息。首次运行前请复制示例配置文件：

```bash
# AI 服务配置
cp core/.env.ai.example core/.env.ai

# OpenViking 服务配置
cp openviking-service/.env.example openviking-service/.env
```

然后编辑 `.env` 文件，填入你的真实 API 密钥。

**重要：** `.env` 文件包含敏感信息，切勿提交到 Git！
```

### 阶段三：创建同步文件夹（预计 30 分钟）

#### 3.1 创建同步脚本

创建 `prepare-github-sync.sh`：

```bash
#!/bin/bash

# GitHub 同步准备脚本
# 用法：./prepare-github-sync.sh

set -e

SYNC_DIR="github-sync"
echo "🚀 开始准备 GitHub 同步文件夹：$SYNC_DIR"

# 清理旧文件夹
if [ -d "$SYNC_DIR" ]; then
    echo "🗑️  清理旧的同步文件夹..."
    rm -rf "$SYNC_DIR"
fi

# 创建新文件夹
echo "📁 创建同步文件夹结构..."
mkdir -p "$SYNC_DIR/core/src"
mkdir -p "$SYNC_DIR/core/config"
mkdir -p "$SYNC_DIR/core/data"
mkdir -p "$SYNC_DIR/core/proto"
mkdir -p "$SYNC_DIR/core/gameConfig"
mkdir -p "$SYNC_DIR/web/src"
mkdir -p "$SYNC_DIR/docs"
mkdir -p "$SYNC_DIR/pic"
mkdir -p "$SYNC_DIR/.github/workflows"

# 复制核心代码
echo "📄 复制后端代码..."
cp -r core/src/* "$SYNC_DIR/core/src/"
cp -r core/config/* "$SYNC_DIR/core/config/"
cp -r core/proto/* "$SYNC_DIR/core/proto/"
cp -r core/gameConfig/* "$SYNC_DIR/core/gameConfig/"

# 复制前端代码
echo "📄 复制前端代码..."
cp -r web/src/* "$SYNC_DIR/web/src/"
cp web/index.html "$SYNC_DIR/web/"

# 复制配置文件
echo "📄 复制配置文件..."
cp package.json "$SYNC_DIR/"
cp core/package.json "$SYNC_DIR/core/"
cp web/package.json "$SYNC_DIR/web/"
cp pnpm-workspace.yaml "$SYNC_DIR/"
cp pnpm-lock.yaml "$SYNC_DIR/"

# 复制示例配置（非敏感）
echo "📄 复制配置模板..."
cp core/.env.ai.example "$SYNC_DIR/core/"
cp openviking-service/.env.example "$SYNC_DIR/openviking-service/"
cp core/data/store.json.example "$SYNC_DIR/core/data/"
cp core/data/accounts.json.example "$SYNC_DIR/core/data/"

# 复制文档
echo "📄 复制文档..."
cp README.md "$SYNC_DIR/"
cp CHANGELOG.DEVELOPMENT.md "$SYNC_DIR/"
cp PROJECT_ROADMAP.md "$SYNC_DIR/"
cp -r docs/* "$SYNC_DIR/docs/"
cp -r pic/* "$SYNC_DIR/pic/"

# 复制部署配置
echo "📄 复制部署配置..."
cp docker-compose.yml "$SYNC_DIR/"
cp Dockerfile "$SYNC_DIR/"
cp start.sh "$SYNC_DIR/"
cp start.bat "$SYNC_DIR/"

# 复制 GitHub Actions
echo "📄 复制 GitHub Actions..."
cp -r .github/workflows/* "$SYNC_DIR/.github/workflows/"

# 创建 .gitignore
echo "📄 创建 .gitignore..."
cat > "$SYNC_DIR/.gitignore" << 'GITIGNORE'
# 依赖
node_modules/
.pnpm-store/

# 敏感数据
.env
.env.local
.env.*.local
*.db
*.db-wal
*.db-shm
data/*.json
data/*.db

# 日志
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# AI 历史
.llm-chat-history/
.specstory/
.agent/

# IDE
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.cursor/

# 构建产物
dist/
build/
*.exe
*.app
*.dmg

# 临时文件
*.tmp
*.swp
.DS_Store
Thumbs.db

# 特定敏感文件
openviking-service/.env
core/.env.ai
core/data/*.json
core/data/*.db
GITIGNORE

# 创建 README（同步说明）
echo "📄 创建同步说明..."
cat > "$SYNC_DIR/SYNC_README.md" << 'SYNCREADME'
# GitHub 同步说明

> 此文件夹为 GitHub 同步专用，包含脱敏后的项目代码

## 📦 文件夹内容

- ✅ `core/src/` - 后端源代码（已脱敏）
- ✅ `web/src/` - 前端源代码（已脱敏）
- ✅ `docs/` - 项目文档
- ✅ `pic/` - 图片资源
- ✅ `*.md` - 项目说明文档
- ✅ `docker-compose.yml` - Docker 配置
- ✅ `.env.*.example` - 配置模板

## 🚫 不包含的内容

- ❌ `.env` 文件（包含真实 API 密钥）
- ❌ `data/*.json`（包含用户数据）
- ❌ `data/*.db`（SQLite 数据库）
- ❌ `logs/`（运行日志）
- ❌ `node_modules/`（依赖包）

## 🔄 同步步骤

1. 在项目根目录执行：
   ```bash
   ./prepare-github-sync.sh
   ```

2. 进入同步文件夹：
   ```bash
   cd github-sync
   ```

3. 初始化 Git 仓库并提交：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GitHub sync version"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

## ⚠️ 重要提示

- 切勿将 `.env` 文件提交到 GitHub
- 使用 `.env.example` 作为配置模板
- 敏感信息请使用环境变量管理

SYNCREADME

echo "✅ GitHub 同步文件夹准备完成！"
echo ""
echo "📁 同步文件夹位置：$PWD/$SYNC_DIR"
echo ""
echo "下一步操作："
echo "1. 检查 $SYNC_DIR/SYNC_README.md 了解同步说明"
echo "2. 进入 $SYNC_DIR 目录"
echo "3. 执行 git init 并推送到 GitHub"
```

#### 3.2 执行同步脚本

```bash
chmod +x prepare-github-sync.sh
./prepare-github-sync.sh
```

### 阶段四：更新 README（预计 1 小时）

#### 4.1 添加最近更新

在 `README.md` 的"新增功能"章节添加：

```markdown
## 🎉 最近更新（v3.3.3 - 2026-03-01）

### 回归修复：深色模式兼容性与性能模式覆盖遗漏

- ✅ 修复 `HelpCenter.vue` 独立重定义 `backdrop-filter`，不受性能模式管控的问题
- ✅ 修复 `Friends.vue` Scoped CSS 中 `.dark` 选择器无法匹配 `<html>` 祖先的问题
- ✅ 修复 `NotificationModal.vue` 底部动作条样式被意外修改的问题

**涉及文件：** `HelpCenter.vue` / `Friends.vue` / `NotificationModal.vue`

### Chrome 闪烁修复与性能模式全面增强

- ✅ 移除 `glass-panel` 的 `will-change`，改用 `contain: layout style paint`
- ✅ 降低 `mesh-orb` 光球模糊值 `blur(80px)` → `blur(60px)`
- ✅ 追加全局 `animation-duration: 0s !important` + `transition-duration: 0s !important`
- ✅ 覆盖 `*` / `*::before` / `*::after` 所有伪元素

**涉及文件：** `style.css` / `HelpButton.vue`

### 好友列表按钮统一与公告弹窗品牌增强

- ✅ 引入 `op-btn` 基础类 + 6 种颜色变体
- ✅ 修复「除草」按钮与其他按钮形状不一致的问题
- ✅ 在「更新公告」弹窗底部注入作者防伪水印

**涉及文件：** `Friends.vue` / `NotificationModal.vue` / `BaseSwitch.vue` / `Settings.vue`

### 自动控制功能提示与推荐建议系统

- ✅ `BaseSwitch.vue` 新增 `hint`/`recommend` prop + CSS Tooltip 气泡
- ✅ `Settings.vue` 全部 18 个开关添加功能解释 + 推荐建议标签
- ✅ 推荐标签三色区分：绿 (开) / 红 (关) / 橙 (视情况)

**涉及文件：** `BaseSwitch.vue` / `Settings.vue`

### 令牌桶进阶优化：紧急通道 & 冗余 Sleep 清理

- ✅ 新增 `sendMsgAsyncUrgent` 紧急通道，防偷不再被好友巡查长队列阻塞
- ✅ 移除 `farm.js` 中 2 处 + `friend.js` 中 5 处冗余 sleep（共 7 处）
- ✅ 排队超过 5 帧时自动打印警告日志

**涉及文件：** `network.js` / `farm.js` / `friend.js`

### 性能优化：SQLite 防争用 & WebSocket 3QPS 令牌桶限流

- ✅ 追加 `busy_timeout = 5000`：并发写入遇锁时自旋最多 5 秒
- ✅ 追加 `wal_autocheckpoint = 1000`：每累积 1000 页自动合并 WAL
- ✅ 在 `sendMsgAsync` 前注入 Token Bucket 异步排队网关
- ✅ 所有业务请求强制以 **3 QPS（每帧 ≥ 334ms）** 匀速发出

**涉及文件：** `database.js` / `network.js`

---
```

#### 4.2 添加两季作物更新说明

在"新增功能"章节添加：

```markdown
### 两季作物兼容性支持（v3.4.0 开发中）

- ✅ 收获后重新检测土地状态，避免两季作物被误铲
- ✅ 智能识别第一季收获后的土地状态（仍在生长第二季）
- ✅ 仅对真正空地和枯死地执行种植操作
- ✅ 异常处理：刷新失败时记录警告，跳过后续处理

**技术实现：**
```javascript
// 收获后重新检测土地状态
if (harvestedLandIds.length > 0) {
    const refreshedReply = await getAllLands();
    const refreshedStatus = analyzeLands(refreshedReply.lands);
    for (const hid of harvestedLandIds) {
        if (refreshedStatus.empty.includes(hid)) {
            allEmptyLands.push(hid);
        } else if (refreshedStatus.dead.includes(hid)) {
            allDeadLands.push(hid);
        }
        // 仍在生长中（两季作物第二季）→ 不处理
    }
}
```

**涉及文件：** `core/src/services/farm.js` - `runFarmOperation` 函数

**测试场景：**
- ✅ 单季作物收获：立即重新种植
- ✅ 两季作物第一季收获：不铲除，等待第二季成熟
- ✅ 两季作物第二季收获：立即重新种植

---
```

### 阶段五：验证与提交（预计 30 分钟）

#### 5.1 检查同步文件夹

```bash
# 进入同步文件夹
cd github-sync

# 检查文件结构
tree -L 3 -I 'node_modules'

# 检查是否包含敏感文件
grep -r "sk-2cabc0684b6943ef81020be207ec8f17" . || echo "✅ 未检测到 API 密钥"
grep -r "ZoBsM8RqTA326a02tWgQOmOb" . || echo "✅ 未检测到微信 API 密钥"

# 检查 .gitignore
cat .gitignore
```

#### 5.2 初始化 Git 仓库

```bash
cd github-sync

# 初始化 Git
git init

# 添加所有文件
git add .

# 检查状态
git status

# 提交
git commit -m "Initial commit: QQ 农场智能助手 GitHub 同步版

- 完整的项目源代码（已脱敏）
- 详细的使用文档
- Docker 部署配置
- GitHub Actions CI/CD
- 配置模板与示例

注意：敏感信息已通过 .env.example 模板管理
请勿将 .env 文件提交到版本控制"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/qq-farm-bot.git

# 推送
git branch -M main
git push -u origin main
```

---

## 📊 后续维护

### 定期同步流程

#### 每周同步（推荐）

```bash
# 1. 回到项目根目录
cd /path/to/qq-farm-bot-ui-main

# 2. 重新生成同步文件夹
./prepare-github-sync.sh

# 3. 进入同步文件夹
cd github-sync

# 4. 检查变更
git status

# 5. 提交并推送
git add .
git commit -m "Weekly sync: $(date +%Y-%m-%d)
- 更新内容 1
- 更新内容 2"
git push
```

### 敏感信息检查清单

每次同步前请确认：

- [ ] 检查 `.env` 文件是否被意外复制
- [ ] 检查 `data/*.json` 是否包含真实用户数据
- [ ] 检查 `data/*.db` 数据库文件
- [ ] 检查日志文件是否被包含
- [ ] 检查代码中是否包含硬编码的 API 密钥
- [ ] 运行 `grep` 搜索敏感关键词

```bash
# 敏感信息检查脚本
cd github-sync

echo "🔍 检查 API 密钥..."
grep -r "sk-[a-zA-Z0-9]\{32\}" . && echo "⚠️  发现阿里云 API 密钥！"

echo "🔍 检查微信 API 密钥..."
grep -r "ZoBsM8RqTA326a02tWgQOmOb" . && echo "⚠️  发现微信 API 密钥！"

echo "🔍 检查密码哈希..."
grep -r "adminPasswordHash.*[a-f0-9]\{64\}" . && echo "⚠️  发现密码哈希！"

echo "🔍 检查数据库文件..."
find . -name "*.db" && echo "⚠️  发现数据库文件！"

echo "🔍 检查 JSON 数据文件..."
find . -path "*/data/*.json" ! -name "*.example" && echo "⚠️  发现数据文件！"

echo "✅ 检查完成"
```

---

## 📝 总结

### 工作量估算

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| 阶段一 | 准备工作（.gitignore、配置模板） | 30 分钟 |
| 阶段二 | 代码脱敏（修改硬编码密钥） | 1 小时 |
| 阶段三 | 创建同步文件夹 | 30 分钟 |
| 阶段四 | 更新 README（添加最近更新） | 1 小时 |
| 阶段五 | 验证与提交 | 30 分钟 |
| **总计** | | **约 3.5 小时** |

### 关键注意事项

1. **🔴 绝对不要上传 `.env` 文件**
2. **🔴 绝对不要上传数据库文件**
3. **🔴 绝对不要上传用户数据**
4. **✅ 使用 `.example` 模板**
5. **✅ 定期执行敏感信息检查**
6. **✅ 在 README 中说明环境变量配置**

### 下一步计划

1. ✅ 执行本计划，创建 `github-sync` 文件夹
2. ✅ 验证脱敏效果
3. ✅ 推送到 GitHub
4. ✅ 配置 GitHub Actions 自动化测试
5. ✅ 添加开源许可证（ISC）
6. ✅ 设置 GitHub 项目页面

---

**计划创建时间：** 2026-03-01  
**执行负责人：** [待填写]  
**GitHub 仓库：** [待填写]
