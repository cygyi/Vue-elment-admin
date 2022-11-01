import request from '@/utils/request'

// 封装获取员工简单列表请求
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
