const User = require('../../../db/models/system/userSchema.js')
const Menu = require('../../../db/models/system/menuSchema.js')
const Role = require('../../../db/models/system/roleSchema.js')
const Counter = require('../../../db/models/system/counterSchema.js')
const Level = require('../../../db/models/member/levelSchema.js')
const util = require('../../../utils/util.js')
const moment = require('moment')
const {
    CODE,
    fail,
    success,
} = util
const log4j = require('../../../utils/log4j.js')


const getUserList = async (ctx) => {
    try {
        const {
            levelId,
            userEmail,
            state
        } = ctx.request.query;
        let params = {}
        if (levelId) {
            params.levelId = levelId
        }
        if (userEmail) {
            params.userEmail = userEmail
        }
        if (state) {
            params.state = state
        }
        const {
            page,
            skipIndex
        } = util.pager(ctx.request.query)
        const query = User.find({
            ...params,
            role: 99
        }, {
            _id: 0,
            userPwd: 0
        })
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await User.countDocuments({
            ...params,
            role: 99
        })
        ctx.body = success({
            page: {
                ...page,
                total
            },
            list
        })
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}


const switchState = async (ctx) => {
    try {
        const {
            userId,
            state
        } = ctx.request.body
        const actionUserId = ctx.request.userInfo.userId
        if (userId == actionUserId) {
            return ctx.body = fail('不能禁用自己', CODE.BUSINESS_ERROR)
        }
        if (userId != 0) {
            if (!userId || state === undefined || state === '') {
                return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
            }
        }
        const filterUser = await User.findOne({
            role: 0
        })
        if (filterUser) {
            if (userId == filterUser.userId) {
                return ctx.body = fail('超级管理员不允许修改', CODE.BUSINESS_ERROR)
            }
            await User.findOneAndUpdate({
                userId
            }, {
                state
            })
            ctx.body = success()
        }
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const getUserInfo = async (ctx) => {
    try {
        const {
            userId
        } = ctx.request.query
        if (!userId) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        // 查询用户信息
        const filterUser = await User.findOne({
            userId
        }, {
            _id: 0,
            userPwd: 0
        })
        if (filterUser) {
            return ctx.body = success(filterUser)
        } else {
            return ctx.body = fail('用户不存在', CODE.PARAM_ERROR)
        }
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

module.exports = {
    getUserList,
    switchState,
    getUserInfo
}