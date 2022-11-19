import { constantRoutes } from '@/router'

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

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
