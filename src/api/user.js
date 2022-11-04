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
    method: 'post'
  })
}

// 获取个人信息头像
export function getStaffPhoto(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

