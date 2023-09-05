const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    "userId":Number,
    "userName":String,
    "userPwd":String,
    "userEmail":String,
    "mobile":Number,
    "sex":Number,
    "deptId":[],
    "job":String,
    "state":Number,
    "role":Number,
    "roleList":[],
    "createTime":{
        type:Date,
        default:Date.now()
    },
    "lastLoginTime":{
        type:Date,
        default:Date.now()
    },
    remark:String
})

module.exports=mongoose.model("users",userSchema,"users")