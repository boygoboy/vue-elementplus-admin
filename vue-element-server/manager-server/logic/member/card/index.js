const Card = require('../../../db/models/member/cardSchema.js')
const Counter = require('../../../db/models/system/counterSchema.js')
const util = require('../../../utils/util.js')
const {
    CODE,
    fail,
    success
} = util
const log4j = require('../../../utils/log4j.js')

const getList = async (ctx) => {
    try {
        const {
            cardNo,
            cardLevel,
            cardState,
            cardType,
            expirationDate
        } = ctx.request.query;
        let params = {}
        if (cardNo) {
            params.cardNo = cardNo
        }
        if (cardLevel) {
            params.cardLevel = cardLevel
        }
        if (cardState) {
            params.cardState = cardState
        }
        if (cardType) {
            params.cardType = cardType
        }
        if (expirationDate) {
            params.expirationDate = expirationDate
        }
        const cardList = await Card.find({})
        for (let i = 0; i < cardList.length; i++) {
            let expireTime = new Date(cardList[i].expirationDate).getTime()
            let nowTime = new Date().getTime()
            if ((expireTime < nowTime) && (cardList[i].cardState == '未使用')) {
                await Card.updateOne({ cardId: cardList[i].cardId }, { cardState: '已过期' })
            }
        }
        const {
            page,
            skipIndex
        } = util.pager(ctx.request.query)
        const query = Card.find(params)
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await Card.countDocuments(params)
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

const addCard = async (ctx) => {
    try {
        const {
            cardNo,
            cardLevel,
            cardType,
            expirationDate,
        } = ctx.request.body
        if (!cardNo || (!cardLevel && cardLevel != 0) || !cardType || !expirationDate) {
            ctx.body = fail('缺少必要参数', CODE.PARAM_ERROR)
            return
        }
        const filterCard = await Card.findOne({
            cardNo
        })
        if (filterCard) {
            return ctx.body = fail('卡密已存在', CODE.BUSINESS_ERROR)
        }
        const findId = await Counter.findOne({
            id: 'cardId'
        })
        if (!findId) {
            await Counter.create({
                "id": "cardId",
                "sequence_value": 1
            })
        }
        const count = await Counter.findOneAndUpdate({
            id: 'cardId'
        }, {
            $inc: {
                sequence_value: 1
            }
        }, {
            new: true
        })
        const card = await new Card({
            cardId: count.sequence_value,
            cardNo,
            cardLevel,
            cardType,
            expirationDate,
            cardState: '未使用'
        })
        card.save()
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const batchCard = async (ctx) => {
    try {
        const { cardLevel, cardType, expirationDate, cardNum } = ctx.request.body
        if ((!cardLevel && cardLevel != 0) || !cardType || !expirationDate || !cardNum) {
            ctx.body = fail('缺少必要参数', CODE.PARAM_ERROR)
            return
        }
        const randomWord = (length) => {
            let str = "",
                arr = [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                    "G",
                    "H",
                    "I",
                    "J",
                    "K",
                    "L",
                    "M",
                    "N",
                    "O",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T",
                    "U",
                    "V",
                    "W",
                    "X",
                    "Y",
                    "Z",
                ];
            //每位随机字符
            for (let i = 0; i < length; i++) {
                let pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        };

        let cardList = []
        for (let i = 0; i < cardNum; i++) {
            const count = await Counter.findOneAndUpdate({
                id: 'cardId'
            }, {
                $inc: {
                    sequence_value: 1
                }
            }, {
                new: true
            })
            cardList.push({
                cardId: count.sequence_value,
                cardNo: randomWord(16),
                cardLevel,
                cardType,
                expirationDate,
                cardState: '未使用'
            })
        }
        const db_cardNos = await Card.find({}, 'cardNo')
        db_cardNos.forEach(item => {
            let findSn = cardList.findIndex(obj => obj.cardNo == item.cardNo)
            if (findSn != -1) {
                cardList.splice(findSn, 1)
            }
        })
        const result = await Card.insertMany(cardList)
        ctx.body = success()
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

const deleteCards = async (ctx) => {
    try {
        const cardIds = ctx.params.ids.split(',')
        if (cardIds.length == 0) {
            return ctx.body = fail('请求参数错误', CODE.PARAM_ERROR)
        }
        const result = await Card.deleteMany({
            cardId: {
                $in: cardIds
            }
        })
        return ctx.body = success('', `成功删除${result.deletedCount}条数据`)
    } catch (error) {
        ctx.body = fail('服务器内部错误', CODE.SERVICE_ERROR)
    }
}

module.exports = {
    getList,
    addCard,
    batchCard,
    deleteCards
}