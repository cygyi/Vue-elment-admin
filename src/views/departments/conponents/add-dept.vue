<template>
  <el-dialog :title="showTitle" :visible="showDialog" :before-close="btnCancel">
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width: 80%" placeholder="请选择" value="" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data () {
    // 部门名称自定义校验函数
    const checkNameRepeat = async (rule, value, callback) => {
      // value就是部门的名称 判断是否重复
      // 实时获取组织结构
      const { depts } = await getDepartments()
      let isRepeat = false
      // 利用id判断是编辑还是添加 设置不一样的校验规则
      if (this.formData.id) {
        // 编辑部门
        // 过滤同级子部门并且排除自身 在筛选有没有重复部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.id && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 添加部门
        // 过滤同级子部门 在筛选有没有重复部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门已经存在${value}了`)) : callback()
    }
    // 部门编码自定义校验函数
    const checkCodeRepeat = async (rule, value, callback) => {
      // 实时获取组织结构
      const { depts } = await getDepartments()
      let isRepeat = false
      // 判断是编辑还是添加
      if (this.formData.id) {
        // 编辑部门
        // 判断整个组织都没有相同编码并且排除自身
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 添加部门
        // 判断整个组织都没有相同编码
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`组织结构已经存在${value}这个编码了`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称应为1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码应为1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍应为1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  },
  methods: {
    // 获取单个部门
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定 添加子部门
    btnOK () {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表单通过验证执行 判断是添加还是编辑 有id是编辑
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            // 发起添加子部门请求
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 传递给父组件更新数据
          this.$emit('addDept')
          // 修改父组件showDialog关闭弹层 使用sync修饰符简写 固定写法update:props名称，值
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 点击取消 关闭弹层
    btnCancel () {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      // 重置表单和验证规则
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
