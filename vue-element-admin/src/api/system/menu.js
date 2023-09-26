import request from '@/utils/request.js'

export default {
    getMenuList(query) {
        return request({
            url: '/system/menu/list',
            method: 'get',
            params: query
        })
    },
    addMenu(data) {
        return request({
            url: '/system/menu/add',
            method: 'post',
            data
        })
    },
    editMenu(data) {
        return request({
            url: '/system/menu/edit',
            method: 'put',
            data
        })
    },
    deleteMenu(id) {
        return request({
            url: `/system/menu/remove/${id}`,
            method: 'delete'
        })
    }
}