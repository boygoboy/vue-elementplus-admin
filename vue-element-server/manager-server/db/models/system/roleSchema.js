const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    roleId: Number,
    roleName: String,
    remark: String,
    permissionList: {
        checkedKeys: [],
        halfCheckedKeys: []
    },
    updateTime: {
        type: Date,
        default: Date.now()
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("role", roleSchema, "role")