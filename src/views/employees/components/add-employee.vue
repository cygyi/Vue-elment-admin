<template>
  <el-dialog
    title="新增员工"
    :visible="showEmployee"
    @close="btnCancel"
  >
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="username" label="姓名">
        <el-input v-model="formData.username" style="width: 50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item prop="mobile" label="手机">
        <el-input v-model="formData.mobile" style="width: 50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="timeOfEntry" label="入职时间">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item prop="formOfEmployment" label="聘用形式">
        <el-select v-model="formData.formOfEmployment" style="width: 50%" value="" placeholder="请选择">
          <el-option v-for="item in EmployeesEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="workNumber" label="工号">
        <el-input v-model="formData.workNumber" style="width: 50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item prop="departmentName" label="部门">
        <el-input v-model="formData.departmentName" style="width: 50%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="defaultProps" :default-expand-all="true" @node-click="selectNode" />
      </el-form-item>
      <el-form-item prop="correctionTime" label="转正时间">
        <el-date-picker v-model="formData.correctionTime" style="width: 50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <el-row
      type="flex"
      justify="end"
    >
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeesEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'

export default {
  name: 'AddEmployee',
  props: {
    showEmployee: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      EmployeesEnum,
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '姓名为1-4个字符', trigger: 'blur'
        }], // 用户名
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }], // 手机号
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }], // 聘用形式
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }], // 工号
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }], // 部门
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }], // 入职时间
        correctionTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }] // 转正时间
      },
      treeData: [], // 接收树形数组
      showTree: false, // 默认隐藏树形内容
      defaultProps: {
        label: 'name'
      },
      loading: false // 进度条
    }
  },
  methods: {
    // 获取组织结构
    async getDepartments () {
      // 打开进度条
      this.loading = true
      // 获取组织结构 转成树形数组
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      // 显示树形
      this.showTree = true
      // 关闭进度条
      this.loading = false
    },
    // 部门名称回写
    selectNode (node) {
      // 第一个参数是节点对象 拿到数据回写表单
      this.formData.departmentName = node.name
      // 关闭树形
      this.showTree = false
    },
    // 点击确定关闭
    async btnOK () {
      try {
        // 进行表单校验
        await this.$refs.addEmployee.validate()
        // 校验通过 发起新增请求
        await addEmployee(this.formData)
        // 让父组件更新数据 绝对子级可以使用this.$parent获取到父组件的实例对象 调用获取数据方法
        this.$parent.getEmployeeList()
        // 关闭弹层
        this.$parent.showEmployee = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel () {
      // 清空表单数据 校验规则 关闭弹层
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields()
      this.$emit('update:showEmployee', false)
    }
  }
}
</script>

<style scoped>

</style>
