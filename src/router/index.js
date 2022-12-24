import { createRouter, createWebHashHistory } from 'vue-router'
import { Loading } from '@/components/loading/loading.js'
// 路由懒加载
const layout = () => import('@/views/2D/Layout')
const home = () => import('@/views/3D/Home')
const indoor = () => import('@/views/3D/Indoor')
const interior = () => import('@/views/3D/interior')
const advantage = () => import('@/views/2D/Advantage')
const success = () => import('@/views/2D/success-case')
const successlist = () => import('@/views/2D/success-case/success-case-list')
const technology = () => import('@/views/2D/technology')
const us = () => import('@/views/2D/us')

// 路由规则
const routes = [
  {
    path: '/',
    component: home
  },
  {
    path: '/indoor',
    component: indoor
  },
  {
    path: '/interior',
    component: interior
  },
  {
    path: '/advantage',
    component: layout,
    children: [
      {
        path: '',
        component: advantage
      },
      {
        path: '/success',
        component: success
      },
      {
        path: '/technology',
        component: technology
      },
      {
        path: '/us',
        component: us
      },
      {
        path: '/successlist/:id',
        component: successlist
      }
    ]
  }
]

// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior () {
    return {
      left: 0,
      top: 0
    }
  }
})
// const load = new Loading({
//   type: 1,
//   tipLabel: '触及科技',
//   wrap: document.body
// })
//
// // 拦截
// router.beforeEach((to, from, next) => {
//   load.init()
//   next()
// })
//
// // 响应
// router.afterEach((to, from, next) => {
//   load.hide()
//   // next()
// })

export default router
