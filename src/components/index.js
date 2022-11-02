// 负责所有自定义组件的全局注册
import pageTools from '@/components/pageTools'

export default {
  install(Vue) {
    Vue.component('pageTools', pageTools)
  }
}

// 导出Vue.use()里的组件注册对象
