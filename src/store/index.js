import { createStore } from 'vuex'

// vue2.0 创建仓库 new Vuex.store({})
// vue3.0 创建仓库 createStore({})
export default createStore({
  state: {}, // 存储状态
  getters: {}, // 计算属性
  mutations: {}, // 修改方法
  actions: {}, // 拿取数据
  modules: {}
})
