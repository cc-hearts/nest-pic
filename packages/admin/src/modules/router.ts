import { isDev } from '@/configs'
import { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'

const constantRoutes = [
  {
    path: '/',
    redirect: '/home/pic',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes, ...constantRoutes],
})

export const setup = ({ app }: { app: App }) => {
  if (isDev) {
    console.log(routes)
  }
  app.use(router)
}
