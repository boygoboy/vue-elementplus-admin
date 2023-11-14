const mongoose = require('mongoose')
const smtpSchema = mongoose.Schema({
    smtpId: {
        required: true,
        type: Number
    },
    smtpName: {
        type: String,
        required: true
    },
    sendName: {
        type: String,
        required: true
    },
    smtpHost: {
        type: String,
        required: true
    },
    smtpPort: {
        type: String,
        required: true
    },
    smtpPort: {
        type: String,
        required: true
    },
    enableSSL: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        required: true
    },
    passWord: {
        type: String,
        required: true
    },
    textModel: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false
    }
})
const smtp = mongoose.model("smtp", smtpSchema, "smtp")
module.exports = smtp