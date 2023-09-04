import {createRouter,createWebHashHistory} from 'vue-router'
import Layout from '@/layout/index.vue'


const routes=[
    {
        name:'home',
        path:'/',
        meta:{
            title:'首页'
        },
        component:Layout,
        redirect:'/home',
        children:[
            {
                name:'home',
                path:'/home',
                meta:{
                    title:'首页'
                },
                component:()=>import('@/views/home.vue')
            }
        ]
    },
    {
        name:'login',
        path:'/login',
        meta:{
            title:'登录'
        },
        component:()=>import('@/views/Login.vue')
    },
    {
        name:'404',
        path:'/404',
        meta:{
            title:'页面不存在'
        },
        component:()=>import('@/views/404.vue')
    }

]

const router=createRouter({
    history:createWebHashHistory(),
    routes
})

export default router