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
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  nprogress.start()
  // 判断是否有token
  if (store.getters.token) {
    // 如果有token 判断是否去登录页 是跳转主页 不是放行
    if (to.path === '/login') {
      next('/')
    } else {
      // 没有token 根据id判断如果没有id就获取
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // 在这里拿到用户的资料 拿到对应的权限 传给action调用函数
        // 拿到返回的动态路由数组 使用路由的addRoutes方法 添加动态路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // 因为把404页面设置在静态路由 层级在动态路由之上 刷新会造成页面404 需要在添加动态路由将404放在最后
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // addRoutes需要跳转指定路径 这是一个缺陷 无法直接放行
        next(to.path)
      } else {
        next()
      }
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
