import 'element-plus/dist/index.css'
import '@/styles/index.scss'

import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

import {ElLoading} from "element-plus"  // 不用use引入会报错v-loading

createApp(App)
    .use(store)
    .use(router)
    .use(ElLoading)
    .mount('#app')
