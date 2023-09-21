import { createStore } from 'vuex'
import user from './modules/user.js'
import menu from './modules/menu.js'
import system from './modules/system.js'
import getters from './getters.js'
const store = createStore({
    modules: {
        user,
        menu,
        system
    },
    getters
})

export default store
export { store }