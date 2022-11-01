import request from '@/utils/request'

// 封装获取组织结构请求
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}

// 封装组织结构删除部门请求
export function delDepartments (id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

// 封装新增子部门请求
export function addDepartments (data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
