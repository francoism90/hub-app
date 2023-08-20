import { createRouter, createWebHistory } from 'vue-router'
import { useSession } from '@/composables'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const { initialize, state } = useSession()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(savedPosition || { left: 0, top: 0, behavior: 'smooth' })
      }, 150)
    })
  },
  routes: [
    {
      path: '/',
      alias: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        layout: AppLayout,
        middleware: 'auth'
      }
    },
    {
      path: '/video/:id/:slug?',
      name: 'video',
      component: () => import('../views/VideoView.vue'),
      props: true,
      meta: {
        layout: AppLayout,
        middleware: 'auth'
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: {
        layout: AppLayout,
        middleware: 'auth'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        layout: AuthLayout,
        middleware: 'guest'
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/LogoutView.vue'),
      meta: {
        layout: AuthLayout,
        middleware: 'auth'
      }
    },
    {
      path: '/421',
      name: 'rate-limited',
      component: () => import('../views/ServerError.vue'),
      meta: {
        layout: AuthLayout,
        middleware: 'guest'
      }
    },
    {
      path: '/500',
      name: 'server-error',
      component: () => import('../views/ServerError.vue'),
      meta: {
        layout: AuthLayout,
        middleware: 'guest'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: {
        layout: AuthLayout,
        middleware: 'guest'
      }
    }
  ]
})

router.beforeEach(async (to) => {
  const middleware = to.meta?.middleware || undefined

  // Refresh user object on each router change
  await initialize()

  if (!state.id && middleware === 'auth' && to.name !== 'login') {
    return { name: 'login' }
  }
})

export default router
