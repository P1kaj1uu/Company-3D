/**
 * type: loading 的类型，默认1 3d加载、2d加载
 * tipLabel: loading 内的文本，默认 loading...
 * wrap: loading 的父级
 *
 * @param {*} config 传入对象（含type/tipLabel/wrap）
 */
export function Loading (config) {
  // 3d加载、2d加载（默认）
  this.type = config.type || 1
  // 上一级级标签
  this.wrap = config.wrap || document.body
  // html结构 原型的显示，隐藏
  this.loadingWrapper = null
}

/* 初始化 loading 效果，在原型链上添加 init 方法 */
Loading.prototype.init = function () {
  this.createDom()
}

/* 创建 loading 结构 */
Loading.prototype.createDom = function () {
  // loading wrap的子盒子，即整个loading的内容盒子
  const loadingWrapper = document.createElement('div')
  loadingWrapper.className = 'loading-wrapper'
  // loading的logo
  const loadingView = document.createElement('div')
  loadingView.className = 'loading-view'
  // type类型判断
  loadingView.innerHTML = `
                <div class="container1">
                  <div class="logo"></div>
                </div>
            `
  // loading内的文本
  const tipView = document.createElement('div')
  tipView.className = 'tip-view loadingFive'
  tipView.innerHTML = `
        <span>触</span>
        <span>及</span>
        <span>科</span>
        <span>技</span>
  `
  // 添加动画。文字
  loadingWrapper.appendChild(loadingView)
  loadingWrapper.appendChild(tipView)
  // 添加到界面
  this.wrap.appendChild(loadingWrapper)
  // 挂载到方法中
  this.loadingWrapper = loadingWrapper
}

// 对loading隐藏
Loading.prototype.hide = function () {
  this.wrap.removeChild(this.loadingWrapper)
}
