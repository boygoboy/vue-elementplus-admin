//维护自增表
const mongoose = require('mongoose')
const emailSchema = mongoose.Schema({
    emailId: {
        required: true,
        type: Number
    },
    email: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    }
})
const email = mongoose.model("email", emailSchema, "email")
module.exports = email