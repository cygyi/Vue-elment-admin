// 设置权限拦截
import router from '@/router'
import store from '@/store'
// 引入进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 定义一个白名单
const whiteList = ['/login', '/404']
// 设置路由守卫
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  nprogress.start()
  // 判断是否有token
  if (store.getters.token) {
    // 如果有token 判断是否去登录页 是跳转主页 不是放行
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 判断是否在白名单内
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  // 手动强制关闭一次进度条
  nprogress.done()
})
// 路由后置守卫
router.afterEach(() => {
  // 关闭进度条
  nprogress.done()
})
