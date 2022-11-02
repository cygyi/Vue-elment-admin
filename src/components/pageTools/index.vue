<template>
  <el-card>
    <el-row class="page-tools">
      <el-col>
        <!-- 左边内容 -->
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" />
          <slot name="left">
            <!--左边-->
          </slot>
        </div>
      </el-col>
      <el-col>
        <!-- 右边内容 -->
        <el-row type="flex" justify="end">
          <slot name="right">
            <!--右边-->
          </slot>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'Index',
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .before {
    line-height: 34px;
    padding: 0 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
