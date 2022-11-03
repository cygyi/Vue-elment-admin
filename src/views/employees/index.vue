<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <template #left>
          <span>共{{ pages.total }}条数据</span>
        </template>
        <template #right>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
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
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees' // 员工枚举对象

export default {
  data () {
    return {
      list: [],
      pages: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false
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
    }
  }
}
</script>

<style>

</style>
