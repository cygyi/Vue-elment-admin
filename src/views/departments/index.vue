<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-tree="false" />
        <!--        树形结构-->
        <el-tree
          :data="depart"
          :props="defaultProps"
          default-expand-all
        >
          <tree-tools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from '@/views/departments/conponents/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: { TreeTools },
  data () {
    return {
      // 头部的数据
      company: {},
      // 树形内容数据
      depart: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments () {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人' }
      this.depart = tranListToTreeData(res.depts, '')
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 30px;
  font-size:14px;
}
</style>
