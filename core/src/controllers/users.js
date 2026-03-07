const userStore = require('../models/user-store');

/**
 * 用户管理控制器
 * 处理用户相关的 HTTP 请求
 */

/**
 * 获取用户列表（仅管理员）
 */
async function getAllUsers(req, res) {
    try {
        const users = await userStore.getAllUsers();
        res.json({ ok: true, users });
    } catch (error) {
        console.error('获取用户列表失败:', error.message);
        res.status(500).json({ ok: false, error: '获取用户列表失败' });
    }
}

/**
 * 获取用户详情（带密码，仅管理员）
 */
async function getAllUsersWithPassword(req, res) {
    try {
        const users = await userStore.getAllUsersWithPassword();
        res.json({ ok: true, users });
    } catch (error) {
        console.error('获取用户详情失败:', error.message);
        res.status(500).json({ ok: false, error: '获取用户详情失败' });
    }
}

/**
 * 更新用户信息（仅管理员）
 */
async function updateUser(req, res) {
    try {
        const { username } = req.params;
        const { expiresAt, enabled } = req.body;

        const updates = {};
        if (expiresAt !== undefined) updates.expiresAt = expiresAt;
        if (enabled !== undefined) updates.enabled = enabled;

        const result = await userStore.updateUser(username, updates);
        if (!result) {
            return res.status(404).json({ ok: false, error: '用户不存在' });
        }

        res.json({ ok: true, user: result });
    } catch (error) {
        console.error('更新用户失败:', error.message);
        res.status(500).json({ ok: false, error: '更新用户失败' });
    }
}

/**
 * 删除用户（仅管理员）
 */
async function deleteUser(req, res) {
    try {
        const { username } = req.params;
        const result = await userStore.deleteUser(username);

        if (!result.ok) {
            return res.status(400).json(result);
        }

        res.json({ ok: true });
    } catch (error) {
        console.error('删除用户失败:', error.message);
        res.status(500).json({ ok: false, error: '删除用户失败' });
    }
}

/**
 * 修改密码（根据当前登录用户自动隔离）
 */
async function changePassword(req, res) {
    try {
        // 从 req.currentUser 获取用户名（由 authRequired 中间件设置）
        const username = req.currentUser?.username;
        const role = req.currentUser?.role;
        const { oldPassword, newPassword } = req.body;

        if (!username) {
            return res.status(401).json({ ok: false, error: '未登录' });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ ok: false, error: '缺少必要参数' });
        }

        // 管理员：简化校验，仅要求 ≥4 位
        // 普通用户：完整复杂度校验（≥6位 + 字母 + 数字）
        if (role === 'admin') {
            if (newPassword.length < 4) {
                return res.status(400).json({ ok: false, error: '密码长度至少 4 位' });
            }
        } else {
            const { validatePassword } = require('../utils/validators');
            const pwdValidation = validatePassword(newPassword);
            if (!pwdValidation.valid) {
                return res.status(400).json({ ok: false, error: pwdValidation.error });
            }
        }

        // 管理员走简化密码修改（跳过 user-store 内部的强密码校验）
        const result = (role === 'admin' && userStore.changeAdminPassword)
            ? await userStore.changeAdminPassword(username, oldPassword, newPassword)
            : await userStore.changePassword(username, oldPassword, newPassword);

        if (!result.ok) {
            return res.status(400).json(result);
        }

        res.json({ ok: true, message: `用户 ${username} 密码修改成功` });
    } catch (error) {
        console.error('修改密码失败:', error.message);
        res.status(500).json({ ok: false, error: '修改密码失败' });
    }
}

module.exports = {
    getAllUsers,
    getAllUsersWithPassword,
    updateUser,
    deleteUser,
    changePassword
};
