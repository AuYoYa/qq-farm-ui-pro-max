#!/usr/bin/env bash
# QQ 农场 Bot - 一键开发启动脚本 (ARM Mac)
# 先关闭旧进程 → 编译前端 → 启动后端，方便改代码和测试

set -e

# 切换到脚本所在目录（项目根目录）
cd "$(dirname "$0")"

# 关闭占用指定端口的进程
kill_port() {
    local port=$1
    local pids
    pids=$(lsof -ti:"$port" 2>/dev/null) || true
    if [ -n "$pids" ]; then
        echo "  → 关闭端口 $port 上的进程 (PID: $pids)"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

echo "=========================================="
echo "  QQ 农场 Bot - 开发环境启动"
echo "  (ARM Mac 适用)"
echo "=========================================="

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ 未检测到 pnpm，请先安装: npm install -g pnpm"
    exit 1
fi

echo ""
echo "🛑 步骤 0: 关闭已运行的前后端进程..."
kill_port 3000   # 后端管理面板
kill_port 5173  # Vite 前端开发服务器（若单独运行过）
echo "✅ 端口已释放"
echo ""

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    pnpm install -r
fi

echo "🔨 步骤 1/2: 编译前端..."
pnpm build:web
if [ $? -ne 0 ]; then
    echo "❌ 前端编译失败"
    exit 1
fi
echo "✅ 前端编译完成"
echo ""

echo "🚀 步骤 2/2: 启动后端..."
echo "   (按 Ctrl+C 停止)"
echo "=========================================="
pnpm dev:core
