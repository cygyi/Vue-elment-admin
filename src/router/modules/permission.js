// 权限管理
// 导出路由规则
import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [{
    // 设置为空 是二级路由的默认规则 一级路由路径也会显示二级组件
    path: '',
    component: () => import('@/views/permission'),
    meta: {
      title: '权限管理',
      icon: 'lock'
    }
  }]
}
