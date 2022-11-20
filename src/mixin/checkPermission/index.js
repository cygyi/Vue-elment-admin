
export default {
  methods: {
    checkPermission (key) {
      // 判断用户按钮权限有没有这个key
      const { points } = this.$store.getters.roles
      console.log(points)
      if (points) {
        return points.some(item => item === key)
      }
    }
  }

}
