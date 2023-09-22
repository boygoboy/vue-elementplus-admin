import request from '@/utils/request.js'

export default {
    getUserList(query) {
        return request({
            url: '/users/list',
            method: 'get',
            params: query
        })
    },
    // 新建用户
    addUser(data) {
        return request({
            url: '/users/add',
            method: 'post',
            data
        })
    },
    // 编辑用户
    editUser(data) {
        return request({
            url: '/users/edit',
            method: 'put',
            data
        })
    },
    // 删除用户
    deleteUsers(ids) {
        return request({
            url: `/users/delete/${ids}`,
            method: 'delete'
        })
    },
    // 修改用户状态
    switchState(data) {
        return request({
            url: '/users/switchstate',
            method: 'put',
            data
        })
    },
    // 获取角色列表
    getRoleList() {
        return request({
            url: '/role/alllist',
            method: 'get'
        })
    },
}