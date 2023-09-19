const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    "id": String,
    "sequence_value": Number
})

module.exports = mongoose.model("counter", counterSchema, "counter")