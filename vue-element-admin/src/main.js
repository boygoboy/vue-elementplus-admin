import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import request from './utils/request.js'
import storage from './utils/storage.js'
import store from "./store";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import 'element-plus/dist/index.css'
import './assets/style/elementui.scss'
const app = createApp(App)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.use(ElementPlus, {
  locale: zhCn,
}).use(router).use(store)
app.mount('#app')