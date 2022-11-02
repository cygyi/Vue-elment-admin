import request from '@/utils/request'

// 获取角色信息列表
export function getRoleList (pages) {
  return request({
    url: '/sys/role',
    params: pages
  })
}

// 获取公司信息
export function getCompanyInfo (companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 删除单个角色列表
export function deleteRole (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 获取单个角色列表
export function getRoleDetail (id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 更新修改的角色列表
export function updateRole (data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 新增角色请求
export function addRole (data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
