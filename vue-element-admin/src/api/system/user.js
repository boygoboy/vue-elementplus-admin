import request from '@/utils/request.js'

export default {
    getUserList(query) {
        return request({
            url: '/users/list',
            method: 'get',
            params: query
        })
    }
}