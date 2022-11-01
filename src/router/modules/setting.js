// 公司设置
// 导出路由规则
import Layout from '@/layout'
export default {
  path: '/setting',
  name: 'setting',
  component: Layout,
  children: [{
    // 设置为空 是二级路由的默认规则 一级路由路径也会显示二级组件
    path: '',
    component: () => import('@/views/setting'),
    meta: {
      title: '公司设置',
      icon: 'setting'
    }
  }]
}
