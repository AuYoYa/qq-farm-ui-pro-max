import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import api from '@/api'
import { adminToken, clearLocalAuthState } from '@/utils/auth'
import { menuRoutes } from './menu'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

let validatedUser = ''
let validatingPromise: Promise<boolean> | null = null

async function ensureTokenValid() {
  const loginMarker = String(adminToken.value || '').trim()
  if (!loginMarker)
    return false

  if (validatedUser && validatedUser === loginMarker)
    return true

  if (validatingPromise)
    return validatingPromise

  validatingPromise = api.get('/api/auth/validate', {
    timeout: 6000,
  }).then((res) => {
    const ok = !!(res.data && res.data.ok)
    if (ok)
      validatedUser = loginMarker
    return ok
  }).catch(() => false).finally(() => {
    validatingPromise = null
  })

  return validatingPromise
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        ...menuRoutes.map(route => ({
          path: route.path,
          name: route.name,
          component: route.component,
        })),
        {
          path: 'help',
          name: 'help',
          component: () => import('@/views/HelpCenter.vue'),
        },
        {
          path: 'farm-tools',
          name: 'farm-tools',
          component: () => import('@/views/FarmTools.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
  ],
})

router.beforeEach(async (to, _from) => {
  NProgress.start()

  if (to.name === 'login') {
    if (!adminToken.value) {
      validatedUser = ''
      return true
    }
    const valid = await ensureTokenValid()
    if (valid)
      return { name: 'dashboard' }
    validatedUser = ''
    clearLocalAuthState()
    return true
  }

  if (!adminToken.value) {
    validatedUser = ''
    return { name: 'login' }
  }

  const valid = await ensureTokenValid()
  if (!valid) {
    validatedUser = ''
    clearLocalAuthState()
    return { name: 'login' }
  }

  return true
})

router.afterEach(() => {
  NProgress.done()
})

router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed')) {
    console.warn('捕获到动态模块加载错误，准备重新加载目标路由:', to.fullPath)
    window.location.href = to.fullPath
  }
})

export default router
