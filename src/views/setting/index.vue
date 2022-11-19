<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <!-- 新增按钮 -->
            <el-row style="height: 60px">
              <el-button size="small" icon="el-icon-plus" type="primary" @click="showEmit = true">新增角色</el-button>
            </el-row>
            <!-- 角色表格 -->
            <el-table border="border" :data="list">
              <el-table-column type="index" label="序号" width="120" align="center" />
              <el-table-column prop="name" label="角色名称" width="240" align="center" />
              <el-table-column prop="description" label="描述" align="center" />
              <el-table-column prop="companyId" label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPermissions(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="emitRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-row style="height: 60px" type="flex" justify="center" align="middle">
              <el-pagination
                :page-count="pages.page"
                :page-size="pages.pagesize"
                :total="pages.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
            <!-- 编辑弹层 -->
            <el-dialog title="编辑角色" :visible="showEmit" @close="btnCancel">
              <el-form ref="roleData" :model="roleData" :rules="rules" label-width="120px">
                <el-form-item prop="name" label="角色名称" style="width: 90%">
                  <el-input v-model="roleData.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色描述" style="width: 90%">
                  <el-input v-model="roleData.description" placeholder="请输入角色描述" />
                </el-form-item>
              </el-form>
              <el-row type="flex" justify="center">
                <el-col :span="6">
                  <el-button size="small" @click="btnCancel">取消</el-button>
                  <el-button size="small" type="primary" @click="btnOK">确认</el-button>
                </el-col>
              </el-row>
            </el-dialog>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <!-- 提示信息 -->
            <el-row style="height: 60px">
              <el-alert
                title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                type="info"
                show-icon
                :closable="false"
              />
            </el-row>
            <!-- 信息表单 -->
            <el-form label-width="120px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled type="textarea" :rows="3" style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <!-- 分配权限弹层 -->
        <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
          <!-- 树形权限 -->
          <el-tree
            ref="permTree"
            :data="permData"
            :default-expand-all="true"
            :props="permTreeProps"
            :show-checkbox="true"
            :check-strictly="true"
            node-key="id"
            :default-checked-keys="selectData"
          />
          <!-- 按钮 -->
          <el-row style="margin-top: 15px;" type="flex" justify="center" align="center">
            <el-col :span="4">
              <el-button size="small" @click="btnPermCancel">取消</el-button>
              <el-button size="small" type="primary" @click="btnPermOK">确认</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { addRole, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { reqGetPermissionList, reqPutPermission } from '@/api/permission'

export default {
  data() {
    return {
      showEmit: false,
      list: [],
      pages: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      // 公司信息数据
      formData: {},
      // 角色信息
      roleData: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      // 控制分配权限弹层
      showPermDialog: false,

      // 权限数据 树形名称
      permData: [],
      permTreeProps: {
        label: 'name'
      },

      // 勾选权限数组
      selectData: [],
      roleId: null // 存储角色id
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { total, rows } = await getRoleList(this.pages)
      this.pages.total = total
      this.list = rows
    },
    // 切换分页
    changePage(newPage) {
      // 将当前页码赋值给数据 发起请求
      this.pages.page = newPage
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色列表
    async deleteRole(id) {
      try {
        // 提示是否删除
        await this.$confirm('是否删除该角色', '提示')
        await deleteRole(id)
        // 重新获取角色列表
        await this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑角色
    async emitRole(id) {
      // 获取当前角色
      this.roleData = await getRoleDetail(id)
      // 显示弹层
      this.showEmit = true
    },
    // 弹层确定和取消
    async btnOK() {
      try {
        // 表单校验是否通过
        await this.$refs.roleData.validate()
        // 判断是修改还是新增
        if (this.roleData.id) {
          // 发起更新请求
          await updateRole(this.roleData)
          this.$message.success('编辑角色成功')
        } else {
          // 发起新增请求
          await addRole(this.roleData)

          this.$message.success('新增角色成功')
        }
        // 重新获取角色列表 提示用户 关闭弹层
        await this.getRoleList()
        this.showEmit = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 清空表单数据 验证规则 关闭弹层
      this.roleData = {
        name: '',
        description: ''
      }
      this.$refs.roleData.resetFields()
      this.showEmit = false
    },

    // 分配权限
    async assignPermissions (id) {
      // 获取所有权限 转成树形数组 给树形组件显示
      this.permData = tranListToTreeData(await reqGetPermissionList(), '0')
      // 获取权限详情 默认勾选权限
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectData = permIds
      // 打开弹层
      this.showPermDialog = true
    },

    // 分配权限点击确定取消
    async btnPermOK () {
      // 获取勾选的权限数组 发起请求 提示 关闭弹层
      await reqPutPermission({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },

    btnPermCancel () {
      // 清空勾选的权限数据 关闭弹层
      this.selectData = []
      this.showPermDialog = false
    }

  }
}
</script>

<style>

</style>
