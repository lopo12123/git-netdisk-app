import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: {
            name: 'Home'
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/license',
        name: 'License',
        component: () => import('@/views/License.vue')
    },
    {
        path: '/Setting',
        name: 'Setting',
        component: () => import('@/views/Setting.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
