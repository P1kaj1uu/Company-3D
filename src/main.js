import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'reset-css'
// 动画库
import animated from 'animate.css'
import './components/loading/loading.css'
// 字体
import '@/assets/font/index.css'
if (process.env.NODE_ENV !== 'development') {
  // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function () {}
  console.error = function () {}
  console.dir = function () {}
}
const app = createApp(App)
app.use(animated).use(store).use(router).mount('#app')
