<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <template #left>
          <span>共{{ pages.total }}条数据</span>
        </template>
        <template #right>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="excelData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showEmployee = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-card v-loading="loading" style="margin-top: 15px">
        <el-table border="border" :data="list">
          <el-table-column type="index" sortable label="序号" />
          <el-table-column prop="username" sortable label="姓名" />
          <el-table-column prop="mobile" sortable label="手机号" />
          <el-table-column prop="workNumber" sortable label="工号" />
          <el-table-column :formatter="formatterEmployees" prop="formOfEmployment" sortable label="聘用形式" />
          <el-table-column prop="departmentName" sortable label="部门" />
          <!-- 利用插槽和过滤器处理时间格式 -->
          <el-table-column prop="timeOfEntry" sortable label="入职时间">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column sortable label="操作" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-row style="height: 60px" type="flex" justify="center" align="middle">
          <el-pagination
            :current-page="pages.page"
            :page-size="pages.size"
            :total="pages.total"
            layout="prev, pager, next"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
      <!-- 新增员工弹层 -->
      <add-employee :show-employee.sync="showEmployee" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees' // 员工枚举对象
import addEmployee from '@/views/employees/components/add-employee'
import { formatDate } from '@/filters'

export default {
  components: {
    addEmployee
  },
  data () {
    return {
      list: [],
      pages: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false, // 进度条
      showEmployee: false // 弹层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工资料
    async getEmployeeList () {
      // 开启进度条 发起请求
      this.loading = true
      const { total, rows } = await getEmployeeList(this.pages)
      this.pages.total = total
      this.list = rows
      // 关闭进度条
      this.loading = false
    },
    // 切换分页
    pageChange (newPage) {
      this.pages.page = newPage
      this.getEmployeeList()
    },
    // 格式化单列的数据
    formatterEmployees (row, column, cellValue, index) {
      const obj = EmployeesEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee (id) {
      try {
        // 提示是否删除 发起请求 重新获取 提示成功
        await this.$confirm('是否删除该员工？', '提示')
        await deleteEmployee(id)
        await this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出员工excel表格
    async excelData () {
      // 定义一个与数据对应的表头 进行中英文转换
      const headersRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 获取所有的员工数据 一次性
      const { rows } = await getEmployeeList({ page: 1, size: this.pages.total })
      // 将数组转成我们需要的数据格式
      const data = this.formatJson(rows, headersRelations)
      // 复杂表头和合并数据
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      // 懒加载导入js文件
      import('@/vendor/Export2Excel').then(excel => {
        // excel是导入js文件成功后的文件对象
        excel.export_json_to_excel({
          header: Object.keys(headersRelations),
          data,
          filename: '员工资料表',
          multiHeader,
          merges
        })
      })
    },
    // 对应顺序 对象转成数组的办法
    formatJson (rows, header) {
      // rows获取的所有员工信息 header是定义好的对应表头对象
      // 这里是返回整个数组
      return rows.map(item => {
        // 这里是返回每个数组
        return Object.keys(header).map(key => {
          // 获取对应的英文key值 从item中将值返回到数组中
          // 判断是否需要转换时间格式和聘用形式
          if (header[key] === 'timeOfEntry' || header[key] === 'correctionTime') {
            // 导入转化时间格式方法 转换格式在返回
            return formatDate(item[header[key]])
          } else if (header[key] === 'formOfEmployment') {
            // 利用员工枚举数据 转换聘用形式格式
            const type = EmployeesEnum.hireType.find(obj => obj.id === item[header[key]])
            return type ? type.value : '未知'
          }
          return item[header[key]] // 这里是返回每个值
        })
      })
    }
  }
}
</script>

<style>

</style>
