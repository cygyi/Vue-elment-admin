<template>
  <div>
    <el-upload
      list-type="picture-card"
      action="#"
      :limit="1"
      :on-preview="preview"
      :on-change="handleAddFile"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-remove="handleRemove"
      :http-request="uploadImg"
      :class="{ disabled: fileShow }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress v-if="showProgress" :percentage="percent" style="width: 180px" />
    <!-- 预览弹层 -->
    <el-dialog :visible.sync="showDialog" title="照片预览">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDObfZHvV1Qcq2Idw691h9i4B2seFkFajd',
  SecretKey: 'oPnwqm2QghgWCi5UksEYhniaox24yhDZ'
})

export default {
  name: 'ImageUpload',
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currenFileUid: null, // 图片uid
      showProgress: false, // 进度条显示隐藏
      percent: 0 // 进度条百分比
    }
  },
  computed: {
    fileShow() {
      return this.fileList.length >= 1
    }
  },
  methods: {
    // 点击预览触发钩子函数
    preview(file) {
      // 将url赋给弹层 显示弹层
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 点击删除触发钩子函数
    handleRemove(file, fileList) {
      // 使用过滤器判断将uid不同的返回
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 点击添加触发钩子函数
    handleAddFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 文件上传前的钩子函数
    beforeUpload(file) {
      // 判断上传文件的类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传文件类型只能是JPG、PNG、GIF')
        return false
      }
      // 判断上传文件的大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传文件大小不能超过5M')
        return false
      }
      // 保存文件的uid
      this.currenFileUid = file.uid
      this.showProgress = true
      // 如果在范围内 返回true退出钩子函数
      return true
    },

    // 自定义上传文件函数
    uploadImg(params) {
      // 判断如果上传文件就上传到腾讯云
      if (params.file) {
        cos.putObject({
          Bucket: 'admin-vue-1314915668',
          Region: 'ap-beijing',
          Key: params.file.name,
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: params.file, // 上传文件对象
          // 上传进度
          onProgress: (progressData) => {
            // 将上传百分比赋值给百分比
            this.percent = (progressData.percent * 100).toFixed(0)
          }
        }, (err, data) => {
          console.log(err || data)
          // 判断文件上传成功
          if (data.statusCode === 200) {
            // 将服务器的地址回写
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currenFileUid) {
                return { url: 'http://' + data.Location, upload: true } // 定义upload表示已上传成功腾讯云
              }
              return item
            })
            // 上传成功关闭进度条 重置百分比
            setTimeout(() => {
              this.showProgress = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  ::v-deep {
    .el-upload--picture-card {
      display: none
    }
  }
}
</style>
