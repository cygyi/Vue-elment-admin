const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立token的快捷方式
  name: state => state.user.userInfo.username // 建立用户名的快捷方式
}
export default getters
