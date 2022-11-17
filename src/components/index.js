// 负责所有自定义组件的全局注册
import pageTools from '@/components/pageTools'
import uploadExcel from '@/uploadExcel'
import imageUpload from '@/components/ImageUpload'
import Print from 'vue-print-nb'

export default {
  install(Vue) {
    Vue.component('pageTools', pageTools)
    Vue.component('uploadExcel', uploadExcel)
    Vue.component('imageUpload', imageUpload)
    Vue.use(Print) // 注册打印组件
  }
}

// 导出Vue.use()里的组件注册对象
