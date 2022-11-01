<template>
  <el-dialog title="新增部门" :visible="showDialog">
    <el-form label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" value="请选择" />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'

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
      // 过滤同级子部门 在筛选有没有重复部门
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      isRepeat ? callback(new Error(`同级部门已经存在${value}了`)) : callback()
    }
    // 部门编码自定义校验函数
    const checkCodeRepeat = async (rule, value, callback) => {
      // 实时获取组织结构
      const { depts } = await getDepartments()
      // 判断整个组织都没有相同编码
      const isRepeat = depts.some(item => item.code === value && value)
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
      }
    }
  }
}
</script>

<style scoped>

</style>
