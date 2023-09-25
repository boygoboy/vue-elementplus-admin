import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import Layout from '@/layout/index.vue'
import storage from '../utils/storage'
import store from '../store'
import api from '@/api/system/user.js'
import utils from '../utils/util.js'


const routes = [{
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Layout,
        redirect: '/home',
        children: [{
            name: 'home',
            path: '/home',
            meta: {
                title: '首页'
            },
            component: () => import('@/views/home.vue')
        }]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/Login.vue')
    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: '页面不存在'
        },
        component: () => import('@/views/404.vue')
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


async function loadAsyncRoutes() {
    let userInfo = storage.getItem('userInfo') || store.state.user.userInfo || {}
    if (userInfo.token) {
        try {
            const {
                menuList
            } = await api.getPermissionList()
            let routes = utils.generateRoute(menuList)
            const modules =
                import.meta.glob("../views/**/**.vue");
            routes.map(route => {
                let url = `../views${route.component}.vue`
                route.component = modules[url]
                router.addRoute('home', route)
                console.log(router.getRoutes())
            })
        } catch (err) {
            // console.log(err)
        }
    } else {}
}
router.beforeEach(async (to, from, next) => {
    if (to.name) {
        if (router.hasRoute(to.name)) {
            document.title = to.meta.title;
            next()
            if (to.path == '/') {
                if (store.state.userInfo.token || storage.getItem('userInfo').token) {
                    document.title = '首页';
                    next('/home')
                } else {
                    document.title = '登录';
                    next('/login')
                }
            } else {
                document.title = to.meta.title;
                next()
            }
        } else {
            document.title = '页面不存在';
            next('/404')
        }
    } else {
        await loadAsyncRoutes()
        let curRoute = router.getRoutes().filter(item => item.path == to.path)
        if (curRoute && curRoute.length) {
            document.title = curRoute[0].meta.title;
            next({
                ...to,
                replace: true
            })
        } else {
            document.title = '登录';
            next('/login')
        }
    }
})

export default router