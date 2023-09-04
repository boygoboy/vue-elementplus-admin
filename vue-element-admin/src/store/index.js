import {createStore} from 'vuex'
import user from './modules/user.js'
import menu from './modules/menu.js'
export default createStore({
    modules:{
       user,
       menu
    }
})