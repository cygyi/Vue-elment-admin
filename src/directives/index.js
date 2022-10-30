// 自定义指令

// 处理异常图片的自定义指令
export const imgerror = {
  inserted(dom, options) {
    dom.onerror = function () {
      console.log(dom.src)
      console.log(options.value)
      dom.src = options.value
    }
  }
}
