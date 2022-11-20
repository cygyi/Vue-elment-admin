const getters = {
  roles: state => state.user.userInfo.roles, // 用户权限信息
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立token的快捷方式
  name: state => state.user.userInfo.username, // 建立用户名的快捷方式
  userId: state => state.user.userInfo.userId, // 建立id的快捷方式
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立头像路径的快捷方式
  companyId: state => state.user.userInfo.companyId, // 建立公司id的快捷方式
  routes: state => state.permission.routes // 建立动态路由的权限快捷方式
}
export default getters
