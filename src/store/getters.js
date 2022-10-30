const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立token的快捷方式
  name: state => state.user.userInfo.username, // 建立用户名的快捷方式
  userId: state => state.user.userInfo.userId, // 建立id的快捷方式
  staffPhoto: state => state.user.userInfo.staffPhoto // 建立头像路径的快捷方式
}
export default getters
