const Card = require('../db/models/member/cardSchema.js')
const schedule = require('node-schedule');

const cronCardState = async () => {
    let rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    rule.second = 0;
    let job = schedule.scheduleJob(rule, async () => {
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

const startCron = async () => {
    cronCardState()
}

module.exports = {
    startCron
}