const mongoose = require('mongoose');

const levelSchema = mongoose.Schema({
    levelId: Number, //等级id
    levelWeight: Number, //等级权重
    levelName: String, //等级名称 vip1 vip2 vip3
    packageName: String, //套餐名称
    packagePrice: Number, //套餐价格
    packageDuration: Number, //套餐时长
    benefitsList: [String], //权益列表
    linkroleId: Number, //关联角色id
    levelIcon: String, //等级图标
    packageStatus: Boolean, //套餐状态
    resourceList: {
        packageMoney: Number,
        resourceData: [{
            modelName: String,
            accessRate: Number,
            modelUnitPrice: Number,
        }]
    }
})

module.exports = mongoose.model("level", levelSchema, "level")