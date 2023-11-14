import request from '@/utils/request.js'

export default {
    getUserList(query) {
        return request({
            url: '/member/users/list',
            method: 'get',
            params: query
        })
    },
    // 修改用户状态
    switchState(data) {
        return request({
            url: '/member/users/switchstate',
            method: 'put',
            data
        })
    },
    // 获取用户信息
    getUserInfo(query) {
        return request({
            url: '/member/users/info',
            method: 'get',
            params: query
        })
    },
    getLevelList() {
        return request({
            url: '/member/level/list',
            method: 'get'
        })
    }
}