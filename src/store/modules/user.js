import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  // 取出token
  token: getToken()
}
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
const actions = {
  async login(context, data) {
    // 发起请求
    const res = await login(data)
    // 设置token
    await context.commit('setToken', res)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
