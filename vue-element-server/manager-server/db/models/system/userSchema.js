const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "userId": Number,
    "userName": String,
    "userPwd": String,
    "userEmail": String,
    "mobile": Number,
    "state": Boolean,
    "role": Number,
    "roleList": [],
    "createTime": {
        type: Date,
        default: Date.now()
    },
    "lastLoginTime": {
        type: Date,
        default: Date.now()
    },
    "levelId": Number,
    "validDate": {
        type: Date,
        default: Date.now()
    },
    "remainMoney": Number,
})

module.exports = mongoose.model("users", userSchema, "users")