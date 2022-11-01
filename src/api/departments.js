import request from '@/utils/request'

// 封装获取组织结构请求
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}
