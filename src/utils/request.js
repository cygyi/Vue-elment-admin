import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const TimeOut = 3600 // 设置token超时时间
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
}
)
// 请求拦截器
request.interceptors.request.use(async config => {
  // 发起请求之前 添加token 注入token的时候判断token是否超时
  // 判断有木有token
  if (store.getters.token) {
    // 判断token是否超时 超时 删除token、信息 跳转登录页
    if (isTimeOut()) {
      await store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => Promise.reject(error))
// 响应拦截器
request.interceptors.response.use(response => {
  const { message, success, data } = response.data
  // 判断状态
  if (success) {
    return data
  } else {
    // 提示错误信息
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, async error => {
  // 判断后端提示的token超时错误码
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 等于10002说明token失效
    await store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})

// 计算token是否超时函数
function isTimeOut() {
  // 当前时间减去之前时间 如果大于了超时时间 返回布尔值
  const currentTime = Date.now() // 当前时间
  const Timestamp = getTimeStamp() // 缓存时间
  return (currentTime - Timestamp) / 1000 > TimeOut
}

export default request
