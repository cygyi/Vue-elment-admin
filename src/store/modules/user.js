import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getStaffPhoto } from '@/api/user'
import { resetRouter } from '@/router'

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
    // 获取用户资料
    const res = await login(data)
    // 设置token
    await context.commit('setToken', res)
    // 存入时间戳
    setTimeStamp()
  },

  // 获取用户资料
  async getUserInfo(context) {
    const res = await getUserInfo()
    // 获取头像
    const StaffPhoto = await getStaffPhoto(res.userId)
    // 将获取的个人信息存储到vuex
    await context.commit('setUserInfo', { ...res, ...StaffPhoto })
    // 后面权限需要
    return res
  },

  // 退出登录
  logout (context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
    // 删除动态路由 调用router文件的重置路由的方法
    resetRouter()
    // 删除Vuex的路由权限数据
    // 一个子模块调用另一个子模块的mutations方法 如果没有命名空间默认挂在全局 可以直接调用
    // 但如果添加了命名空间 就需要在调用的时候加上第三个参数 是个对象 将里面的root属性设为true
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
