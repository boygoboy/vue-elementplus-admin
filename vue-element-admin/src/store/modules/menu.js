import storage from '../../utils/storage.js'
import api from '@/api/system/user.js'

const state = {
    menuList: storage.getItem('menuList') || [],
    actionList: storage.getItem('actionList') || []
}
const mutations = {
    SAVE_MENU_LIST(state, menuList) {
        state.menuList = menuList;
        storage.setItem('menuList', menuList)
    },
    SAVE_ACTION_LIST(state, actionList) {
        state.actionList = actionList;
        storage.setItem('actionList', actionList)
    }
}
const actions = {
    getPermissionList({
        commit
    }) {
        return new Promise(async (resolve) => {
            const {
                menuList,
                actionList
            } = await api.getPermissionList()
            commit('SAVE_MENU_LIST', menuList)
            commit('SAVE_ACTION_LIST', actionList)
            resolve({
                menuList,
                actionList
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}