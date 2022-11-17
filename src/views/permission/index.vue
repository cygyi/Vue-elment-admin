<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template #right>
          <el-button type="primary" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-table border="border" :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" @click="updatePermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增编辑弹层 -->
      <el-dialog :title="title" :visible="isShow">
        <el-form label-width="120px">
          <el-form-item label="名称" style="width: 90%;">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="标识" style="width: 90%;">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="描述" style="width: 90%;">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="启用" style="width: 90%;">
            <el-switch v-model="formData.enVisible" inactive-value="0" active-value="1" />
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK(formData.id)">确认</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  reqAddPermission,
  reqDelPermission,
  reqGetPermissionDetail,
  reqGetPermissionList,
  reqUpdatePermission
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'

export default {
  data () {
    return {
      list: [],
      isShow: false,
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    }
  },
  computed: {
    title () {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.reqGetPermissionList()
  },
  methods: {
    // 获取所有权限
    async reqGetPermissionList () {
      // 将数据转成树形数组 含有children子级数组的数组 element表格组件会自定义识别成树形表格
      this.list = tranListToTreeData(await reqGetPermissionList(), '0')

      console.log(this.list)
    },

    // 点击删除权限
    async delPermission (id) {
      try {
        // 确定是否删除 发起删除权限请求 重新渲染页面 提示用户
        await this.$confirm('确认要删除该权限吗', '提示')
        await reqDelPermission(id)
        await this.reqGetPermissionList()
        this.$message.success('删除权限成功')
      } catch (error) {
        console.log(error)
      }
    },

    // 添加权限 判断是父级还是子级
    addPermission (type, pid) {
      this.isShow = true
      this.formData.type = type
      this.formData.pid = pid
    },

    // 编辑权限
    async updatePermission (id) {
      this.formData = await reqGetPermissionDetail(id)
      this.isShow = true
    },

    // 点击确定
    async btnOK (id) {
      // 判断formData里是否有id 有就是编辑 没有就是新增
      if (id) {
        // 编辑
        await reqUpdatePermission(this.formData)
        await this.reqGetPermissionList()
        this.$message.success('编辑权限成功')
        this.btnCancel()
      } else {
        // 新增
        await reqAddPermission(this.formData)
        await this.reqGetPermissionList()
        this.$message.success('新增权限成功')
        this.btnCancel()
      }
    },
    // 点击取消
    btnCancel() {
      this.isShow = false
      this.formData = {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    }
  }
}
</script>

<style>

</style>
