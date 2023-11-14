import request from '@/utils/request.js'

export default {
    getUserList(query) {
        return request({
            url: '/member/users/list',
            method: 'get',
            params: query
        })
    },
    getLevelList() {
        return request({
            url: '/member/level/list',
            method: 'get'
        })
    },
}