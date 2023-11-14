import request from '@/utils/request.js'

export default {
    getLevelList(query) {
        return request({
            url: '/member/level/list',
            method: 'get',
            params: query
        })
    },
    // 获取角色列表
    getRoleList() {
        return request({
            url: '/system/role/alllist',
            method: 'get'
        })
    },
    // 添加等级套餐
    addLevel(data) {
        return request({
            url: '/member/level/add',
            method: 'post',
            data
        })
    },
    // 编辑等级套餐
    editLevel(data) {
        return request({
            url: '/member/level/edit',
            method: 'put',
            data
        })
    },
    // 删除等级套餐
    deleteLevel(id) {
        return request({
            url: `/member/level/remove/${id}`,
            method: 'delete'
        })
    },
    // 修改等级套餐状态
    changeLevelStatus(data) {
        return request({
            url: '/member/level/status',
            method: 'put',
            data
        })
    },
    // 分配资源
    distrbuteResource(data) {
        return request({
            url: '/member/level/resource',
            method: 'put',
            data
        })
    }

}