import storage from '../../utils/storage.js'

const state={
    userInfo:storage.getItem('userInfo')||{}
}
const getters={}
const mutations={
    saveUserInfo(state,userInfo){
       state.userInfo=userInfo
       storage.setItem("userInfo",userInfo)
    }
}
const actions={}

export default{
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}