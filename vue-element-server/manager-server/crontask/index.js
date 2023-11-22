const Card = require('../db/models/member/cardSchema.js')
const User = require('../db/models/system/userSchema.js')
const Level = require('../db/models/member/levelSchema.js')
const schedule = require('node-schedule');
const moment = require('moment')

//每15分钟更新卡密状态
const cronCardState = async () => {
    let job = schedule.scheduleJob('*/15 * * * *', async () => {
        const cardList = await Card.find({})
        for (let i = 0; i < cardList.length; i++) {
            let expireTime = new Date(cardList[i].expirationDate).getTime()
            let nowTime = new Date().getTime()
            if ((expireTime < nowTime) && (cardList[i].cardState == '未使用')) {
                await Card.updateOne({ cardId: cardList[i].cardId }, { cardState: '已过期' })
            }
        }
    });
}

//每小时更新用户套餐是否到期，到期则将用户降级为free套餐
const cronUserLevel = async () => {
    let job = schedule.scheduleJob('0 * * * *', async () => {
        const userList = await User.find({ role: 99 })
        const filterLevel = await Level.findOne({
            levelName: 'free'
        })
        userList.forEach(async (item) => {
            let expireTime = new Date(item.validDate).getTime()
            let nowTime = new Date().getTime()
            if (expireTime < nowTime) {
                if (!filterLevel) {
                    //将过期用户禁用
                    await User.findOneAndUpdate({ userId: item.userId }, { state: false })
                } else {
                    let isFree = item.levelId == filterLevel.levelId ? true : false
                    //将用户降级为free套餐
                    await User.findOneAndUpdate({ userId: item.userId }, {
                        roleList: [filterLevel.linkroleId],
                        levelId: filterLevel.levelId,
                        levelWeight: filterLevel.levelWeight,
                        packagePrice: filterLevel.packagePrice,
                        validDate: isFree == true ? item.validDate : moment().add(filterLevel.packageDuration, 'days').format('YYYY-MM-DD HH:mm:ss')
                    })
                }
            }
        })
    });
}

const startCron = async () => {
    cronCardState()
    cronUserLevel()
}

module.exports = {
    startCron
}