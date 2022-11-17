<template>
  <!-- 员工权限弹层 -->
  <el-dialog title="员工权限" :visible="isShow" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 权限选项 label既是存储也是显示 label存储要是和显示不一致 要在标签内使用{{}}显示 -->
      <el-checkbox v-for="item in List" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getStaffPhoto } from '@/api/user'
import { saveTheRole } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    // 弹层显示
    isShow: {
      type: Boolean,
      default: false
    },
    // 用户id
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data () {
    return {
      List: [],
      roleIds: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取员工信息
    async getRoleList () {
      const { rows } = await getRoleList()
      this.List = rows
    },
    // 获取员工权限 （打开弹层调用）因为父组件传递数据是异步 所以没有办法通过this.userId取得id 通过父组件去调用方法 将id传过来
    async getStaffPhoto (id) {
      const { roleIds } = await getStaffPhoto(id)
      this.roleIds = roleIds
    },

    // 点击确定
    async btnOK () {
      await saveTheRole({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('保存角色成功')
      // 关闭弹层
      this.$emit('update:isShow', false)
      // 可以通过this.$parent直接修改父组件的数据
      // this.$parent.isShow = false
    },
    // 点击取消
    btnCancel () {
      // 清空数据
      this.roleIds = []
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style scoped>

</style>
