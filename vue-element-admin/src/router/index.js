import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import BackLayout from '@/layout/back/index.vue'
import FrontLayout from '@/layout/front/index.vue'
import storage from '../utils/storage'
import store from '../store'
import api from '@/api/system/user.js'
import utils from '../utils/util.js'


const routes = [{
        name: 'back',
        path: '/back',
        meta: {
            title: '首页'
        },
        component: BackLayout,
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
        name: 'front',
        path: '/front',
        meta: {
            title: '前台'
        },
        component: FrontLayout,
        redirect: '/front/home',
        children: [{
                name: 'front_home',
                path: '/front/home',
                meta: {
                    title: '主页'
                },
                component: () => import('@/views/front/home/index.vue')
            },
            {
                name: 'front_chat',
                path: '/front/chat',
                meta: {
                    title: 'AI聊天'
                },
                component: () => import('@/views/front/chat/index.vue')
            },
            {
                name: 'front_paint',
                path: '/front/paint',
                meta: {
                    title: 'AI绘画'
                },
                component: () => import('@/views/front/paint/index.vue')
            },
            {
                name: 'front_login',
                path: '/front/login',
                meta: {
                    title: '登录'
                },
                component: () => import('@/views/Login.vue')
            }
        ]
    },
    {
        name: '',
        path: '/',
        redirect: '/front'
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
                router.addRoute('back', route)
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
                    next('/front/login')
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
            next('/front/login')
        }
    }
})

export default router