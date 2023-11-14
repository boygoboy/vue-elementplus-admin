import request from '@/utils/request.js'

export default {
    addSmtp(data) {
        return request({
            url: '/system/smtpemail/addsmtp',
            method: 'post',
            data
        })
    },
    getSmtp() {
        return request({
            url: '/system/smtpemail/list',
            method: 'get',
        })
    },
    editSmtp(data) {
        return request({
            url: '/system/smtpemail/editsmtp',
            method: 'put',
            data
        })
    },
    enableSmtp(data) {
        return request({
            url: '/system/smtpemail/enablesmtp',
            method: 'put',
            data
        })
    },
    deleteSmtp(id) {
        return request({
            url: `/system/smtpemail/deletesmtp/${id}`,
            method: 'delete',
        })
    },
    testSmtp(data) {
        return request({
            url: '/system/smtpemail/testsmtp',
            method: 'post',
            data
        })
    }
}