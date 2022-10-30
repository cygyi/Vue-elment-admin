import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

const state = {
  // 从本地取出token
  token: getToken(),
  // 不给null给个{}是因为无法从null、undefined中获取属性，会引起报错
  userInfo: {}
}
const mutations = {
  // 更新token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 更新用户资料
  setUserInfo(state, res) {
    state.userInfo = res
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 登录
  async login(context, data) {
    // 发起请求
    const res = await login(data)
    // 设置token
    await context.commit('setToken', res)
  },

  // 获取用户资料
  async getUserInfo(context) {
    const res = await getUserInfo()
    // 将获取的个人信息存储到vuex
    context.commit('setUserInfo', res)
    // 后面权限需要
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
