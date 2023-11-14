const Level = require('../../../db/models/member/levelSchema.js')
const Counter = require('../../../db/models/system/counterSchema.js')
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
    try {
        const {
            levelName,
            packageName,
            packagePrice,
            packageDuration,
            benefitsList,
            levelIcon,
            linkroleId
        } = ctx.request.body
        if (!levelName || !packageName || (!packagePrice && packagePrice != 0) || !packageDuration || !benefitsList || !levelIcon || !linkroleId) {
            ctx.body = fail('缺少必要参数', CODE.PARAM_ERROR)
            return
        }
        const filterLevel = await Level.findOne({
            levelName
        })
        if (filterLevel) {
            return ctx.body = fail('等级名称已存在', CODE.BUSINESS_ERROR)
        }
        const findId = await Counter.findOne({
            id: 'levelId'
        })
        if (!findId) {
            await Counter.create({
                "id": "levelId",
                "sequence_value": 1
            })
        }
        const count = await Counter.findOneAndUpdate({
            id: 'levelId'
        }, {
            $inc: {
                sequence_value: 1
            }
        }, {
            new: true
        })
        const level = await new Level({
            levelId: count.sequence_value,
            levelName,
            packageName,
            packagePrice,
            packageDuration,
            benefitsList: JSON.parse(benefitsList),
            levelIcon,
            linkroleId,
            packageStatus: false
        })
        level.save()
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}
const editLevel = async (ctx) => {
    try {
        const {
            levelId,
            levelName,
            packageName,
            packagePrice,
            packageDuration,
            benefitsList,
            levelIcon,
            linkroleId,
            packageStatus
        } = ctx.request.body
        if (!levelId && levelId != 0 || !levelName || !packageName || (!packagePrice && packagePrice != 0) || !packageDuration || !benefitsList || !levelIcon || !linkroleId) {
            ctx.body = fail('缺少必要参数', CODE.PARAM_ERROR)
            return
        }

        const filterLevel = await Level.findOne({
            levelId
        })
        if (!filterLevel) {
            return ctx.body = fail('等级不存在', CODE.BUSINESS_ERROR)
        }
        const level = await Level.findOne({
            levelName
        });
        if (level.levelId != levelId) {
            return ctx.body = fail('等级名称已存在', CODE.BUSINESS_ERROR)
        }
        const oneLevel = await Level.findOneAndUpdate({
            levelId
        }, {
            levelName,
            packageName,
            packagePrice,
            packageDuration,
            benefitsList: JSON.parse(benefitsList),
            levelIcon,
            linkroleId,
        })
        if (oneLevel) {
            return ctx.body = success()
        } else {
            return ctx.body = fail('编辑等级失败', CODE.BUSINESS_ERROR)
        }

    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const deleteLevel = async (ctx) => {
    try {
        const levelId = ctx.params.id
        if (!levelId) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        await Level.deleteOne({
            levelId
        })
        return ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const changeLevelStatus = async (ctx) => {
    try {
        const {
            levelId,
            packageStatus
        } = ctx.request.body
        await Level.findOneAndUpdate({
            levelId
        }, {
            packageStatus
        })
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const distrbuteResource = async (ctx) => {
    try {
        const {
            levelId,
            packageMoney,
            resourceData
        } = ctx.request.body
        if (!levelId && levelId != 0 || !packageMoney && packageMoney != 0 || !resourceData) {
            ctx.body = fail('缺少必要参数', CODE.PARAM_ERROR)
            return
        }
        //更新等级资源
        await Level.findOneAndUpdate({
            levelId
        }, {
            resourceList: {
                packageMoney,
                resourceData
            }
        })
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}



module.exports = {
    getList,
    addLevel,
    editLevel,
    deleteLevel,
    changeLevelStatus,
    distrbuteResource
}