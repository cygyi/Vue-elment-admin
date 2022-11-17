<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <el-form ref="formData" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item prop="username" label="用户名">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item prop="password2" label="密码">
                <el-input v-model="userInfo.password2" style="width: 300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployee">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 员工打印 -->
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${userId}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <!-- 动态组件 is必须是一个变量 是变量名称 可以是任意组件 实现组件切换 -->
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 岗位打印 -->
            <el-tooltip class="tooltip-box" content="打印基本岗位信息">
              <router-link :to="`/employees/print/${userId}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <!-- 动态组件 is必须是一个变量 是变量名称 可以是任意组件 实现组件切换 -->
            <component :is="jobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getStaffPhoto } from '@/api/user'
import { updateEmployee } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info'
import JobInfo from '@/views/employees/components/job-info'

export default {
  name: 'Detail',
  components: {
    UserInfo,
    JobInfo
  },
  data () {
    return {
      userComponent: 'user-info',
      jobComponent: 'job-info',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      // 校验规则
      rules: {
        username: [{
          required: true, message: '用户名不能为空', trigger: 'blur'
        }],
        password2: [{
          required: true, message: '用户名不能为空', trigger: 'blur'
        }, {
          min: 6, max: 9, message: '密码为6-9个字符', trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getStaffPhoto()
  },
  methods: {
    // 获取登录信息
    async getStaffPhoto () {
      this.userInfo = await getStaffPhoto(this.userId)
    },

    // 保存修改信息
    updateEmployee () {
      // 校验表单
      this.$refs.formData.validate().then(async () => {
        await updateEmployee({ ...this.userInfo, 'password': this.userInfo.password2 })
        // 提示修改成功
        this.$message.success('修改信息成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs__content {
  .el-tab-pane {
    padding-top: 10px;
  }
  .tooltip-box {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
  }
}
</style>
