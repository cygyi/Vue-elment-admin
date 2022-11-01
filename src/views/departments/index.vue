<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-tree="false" @addDepart="addDepart" />
        <!--        树形结构-->
        <el-tree
          :data="depart"
          :props="defaultProps"
          default-expand-all
        >
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepart="getDepartments" @addDepart="addDepart" />
        </el-tree>
        <!-- 弹层 -->
        <add-dept :show-dialog="showDialog" :tree-node="node" />
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from '@/views/departments/conponents/tree-tools'
import addDept from '@/views/departments/conponents/add-dept'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: { TreeTools, addDept },
  data () {
    return {
      // 头部的数据
      company: {},
      // 树形内容数据
      depart: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 弹层数据
      showDialog: false,
      // 点击节点
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取部门结构
    async getDepartments () {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.depart = tranListToTreeData(res.depts, '')
    },
    // 显示弹层 添加部门
    addDepart(node) {
      this.showDialog = true
      // 将节点保存
      this.node = node
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
