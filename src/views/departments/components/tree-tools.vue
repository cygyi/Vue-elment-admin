<template>
  <!-- 封装树形结构组件 -->
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col><span>{{ treeNode.name }}</span></el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isTree" command="emit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isTree" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments, getDepartDetail } from '@/api/departments'

export default {
  name: 'TreeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isTree: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 点击操作按钮时触发
    handleCommand(type) {
      if (type === 'add') {
        // 点击的是添加子部门按钮
        // 自定义事件将 node节点传给父组件
        this.$emit('addDepart', this.treeNode)
      } else if (type === 'emit') {
        // 点击的是编辑部门按钮
        this.$emit('emitDepart', this.treeNode)
      } else {
        // 点击的是删除按钮 调用删除方法
        // 提示用户是否确定删除
        this.$confirm('您是否要删除该部门', '提示').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 自定义事件让父组件更新数据
          this.$emit('delDepart')
          // 提示删除成功
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
