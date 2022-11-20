import { constantRoutes, asyncRouter } from '@/router'

const state = () => {
  return {
    // 默认是静态路由的访问权
    routes: constantRoutes
  }
}

const mutations = {
  setRouter (state, newVal) {
    state.routes = [...constantRoutes, ...newVal]
  }

}

const actions = {
  // 筛选有权限的路由 跟获取的用户权限进行筛选 得到用户拥有权限的数组
  filterRoutes ({ commit, dispatch }, menus) {
    const routes = []
    menus.forEach(key => {
      // key 就是每个用户的权限标识 从动态路由中筛选跟key匹配的路由
      routes.push(...asyncRouter.filter(item => item.name === key))
    })
    // 调用mutations
    commit('setRouter', routes)
    // return数组 这个return是返回给路由使用的 这个state数据是给左侧菜单使用的
    return routes
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
