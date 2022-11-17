<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { reqImportEmployee } from '@/api/employees'

export default {
  name: 'Index',
  methods: {
    async success ({ header, results }) {
      // 定义一个和中文同名的对象
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 循环数组将中文key转成中文的
      const newArr = results.map(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // 判断是不是excel的时间数据
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatExcelDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })

      // 调用导入请求 提示成功 回到上一页
      await reqImportEmployee(newArr)
      this.$message.success('导入员工成功')
      this.$router.back()
    },
    // 转换excel时间格式的方法
    formatExcelDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped>

</style>
