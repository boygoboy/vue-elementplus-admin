import request from '@/utils/request.js'

export default {
    getRoleList(query) {
        return request({
            url: '/system/role/list',
            method: 'get',
            params: query
        })
    },
    // 新建角色
    addRole(data) {
        return request({
            url: '/system/role/add',
            method: 'post',
            data
        })
    },
    // 编辑角色
    editRole(data) {
        return request({
            url: '/system/role/edit',
            method: 'put',
            data
        })
    },
    // 删除角色
    deleteRole(id) {
        return request({
            url: `/system/role/delete/${id}`,
            method: 'delete'
        })
    },
    // 获取菜单
    getMenuList(query) {
        return request({
            url: '/system/menu/list',
            method: 'get',
            params: query
        })
    },
    // 设置权限
    setRolePermission(data) {
        return request({
            url: '/system/role/permissions',
            method: 'put',
            data
        })
    },
}