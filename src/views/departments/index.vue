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
          <tree-tools slot-scope="{ data }" :tree-node="data" @emitDepart="emitDepart" @delDepart="getDepartments" @addDepart="addDepart" />
        </el-tree>
        <!-- 弹层 -->
        <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDept="getDepartments" />
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from '@/views/departments/components/tree-tools'
import addDept from '@/views/departments/components/add-dept'

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
    },
    // 显示弹层 编辑部门
    emitDepart(node) {
      this.showDialog = true
      // 将节点保存
      this.node = node
      // 通过ref获取组件的实例 调用它的方法进行获取当个部门 防止异步
      this.$refs.addDept.getDepartDetail(node.id)
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
