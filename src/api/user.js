import request from '@/utils/request'

// 登录请求
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户资料请求
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    methods: 'post'
  })
}

export function logout() {

}
