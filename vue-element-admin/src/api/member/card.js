import request from '@/utils/request.js'

export default {
    getCardList(query) {
        return request({
            url: '/member/card/list',
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
    addOneCard(data) {
        return request({
            url: '/member/card/onecard',
            method: 'post',
            data
        })
    },
    barchCard(data) {
        return request({
            url: '/member/card/batchcard',
            method: 'post',
            data
        })
    },
    deleteCard(cardIds) {
        return request({
            url: `/member/card/removecard/${cardIds}`,
            method: 'delete'
        })
    }
}