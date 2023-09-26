const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    sortNo: Number,
    menuType: Number,
    menuName: String,
    menuCode: String,
    path: String,
    apiPath: [],
    icon: String,
    component: String,
    menuState: String,
    parentId: [mongoose.Types.ObjectId],
    "createTime": {
        type: Date,
        default: Date.now()
    },
    "updateTime": {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("menu", menuSchema, "menu")