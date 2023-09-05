import request from '@/utils/request.js'

export default{
    // 登录接口
    handleLogin(data){
        return request({
            url:'/users/login',
            method:'post',
            data
        })
    }
}