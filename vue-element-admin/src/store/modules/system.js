import storage from '../../utils/storage.js'

const state = {
    isLoading: false
}
const mutations = {
    SET_ISLOADING(state, isLoading) {
        state.isLoading = isLoading
    }
}
const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}