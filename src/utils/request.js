import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
}
)
// 请求拦截器
request.interceptors.request.use(config => {
  // 发起请求之前添加token
  // 判断有木有token
  if (store.getters.token) {
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
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})
export default request
