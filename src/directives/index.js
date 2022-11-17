// 自定义指令

// 处理异常图片的自定义指令
export const imgerror = {
  inserted(dom, options) {
    // 第一次初始化 如果没有头像就默认给一个默认头像
    dom.src = dom.src || options.value

    dom.onerror = function () {
      dom.src = options.value
    }
  },
  // 组件数据更新完成后的钩子函数
  componentUpdated (dom, options) {
    dom.src = dom.src || options.value
  }
}
