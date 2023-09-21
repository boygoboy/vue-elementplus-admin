import request from '@/utils/request.js'

export default {
    getMenuList(query) {
        return request({
            url: '/menu/list',
            method: 'get',
            params: query
        })
    },
    addMenu(data) {
        return request({
            url: '/menu/operate',
            method: 'post',
            data
        })
    },
    editMenu(data) {
        return request({
            url: '/menu/operate',
            method: 'put',
            data
        })
    },
    deleteMenu(id) {
        return request({
            url: `/menu/remove/${id}`,
            method: 'delete'
        })
    }
}