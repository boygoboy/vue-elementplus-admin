const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    cardId: Number, //卡密id
    cardNo: String,  //卡密编号
    cardLevel: String, //卡密等级
    cardState: String, //卡密状态
    cardType: String, //卡密类型
    expirationDate: Date, //失效日期
})

module.exports = mongoose.model("card", cardSchema, "card")