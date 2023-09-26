import request from '@/utils/request.js'

export default {
    // 登录接口
    handleLogin(data) {
        return request({
            url: '/system/users/login',
            method: 'post',
            data
        })
    },
    getPermissionList() {
        return request({
            url: '/system/users/getPermissionList',
            method: 'get'
        })
    }
}