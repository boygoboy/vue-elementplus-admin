import request from '@/utils/request.js'

export default {
    // 登录接口
    handleLogin(data) {
        return request({
            url: '/users/login',
            method: 'post',
            data
        })
    },
    getPermissionList() {
        return request({
            url: '/users/getPermissionList',
            method: 'get'
        })
    }
}