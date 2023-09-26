const Level = require('../../../db/models/member/levelSchema.js')
const util = require('../../../utils/util.js')
const {
    CODE,
    fail,
    success,
    getMenuTree
} = util
const log4j = require('../../../utils/log4j.js')

const getList = async (ctx) => {
    try {
        const {
            levelName,
            packageName
        } = ctx.request.query;
        let params = {}
        if (levelName) {
            params.levelName = levelName
        }
        if (packageName) {
            params.packageName = packageName
        }
        const list = await Level.find(params) || []
        ctx.body = success(list)
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const addLevel = async (ctx) => {

}
const editLevel = async (ctx) => {

}

const deleteLevel = async (ctx) => {

}

const changeLevelStatus = async (ctx) => {

}



module.exports = {
    getList, addLevel, editLevel, deleteLevel, changeLevelStatus
}