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
const app = createApp(App)
app.use(animated).use(store).use(router).mount('#app')
