import storage from '../../utils/storage.js'
import api from '@/api/login/index.js'
import utils from '@/utils/util.js'
import router from '@/router/index.js'

const state = {
    userInfo: storage.getItem('userInfo') || {},
    routerList: storage.getItem('routerList') || []
}
const mutations = {
    SAVE_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
        storage.setItem("userInfo", userInfo)
    },
    CLEAR_USER_INFO(state) {
        state.userInfo = {}
        storage.clearItem("userInfo")
    },
    SAVE_ROUTER_LIST(state, routerList) {
        state.routerList = routerList
        storage.setItem("routerList", routerList)
    }
}
const actions = {
    handleLogin({
        commit
    }, loginForm) {
        return new Promise(async (resolve) => {
            const userInfo = await api.handleLogin(loginForm);
            commit('SAVE_USER_INFO', userInfo)
            router.push("/home");
            resolve(true)
        })
    },
    handleLogout({
        commit
    }) {
        commit("SAVE_USER_INFO", "");
        storage.clearAll();
        state.routerList.map(item => {
            router.removeRoute(item.name)
        })
        console.log("router", router.getRoutes());
        setTimeout(() => {
            router.push("/login");
        }, 500)
    },
    loadRouterList({
        commit
    }) {
        return new Promise(async (resolve) => {
            let userInfo = storage.getItem('userInfo') || {}
            if (userInfo.token) {
                try {
                    const {
                        menuList
                    } = await api.getPermissionList()
                    let routes = utils.generateRoute(menuList)
                    console.log(routes)
                    const modules =
                        import.meta.glob("../../views/**/**.vue");
                    routes.map(route => {
                        let url = `../../views${route.component}.vue`
                        route.component = modules[url];
                        router.addRoute("back", route);
                    })
                    console.log(router.getRoutes())
                    commit('SAVE_ROUTER_LIST', routes)
                    resolve(routes)
                } catch (error) {

                }
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}