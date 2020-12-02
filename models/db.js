const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile : {
        type: Number,
        required: true,
        maxlength: 10,
        minlength: 10,
        unique: true
    },
    
    balance: {
        type: Number,
        min : 100
    }
})


module.exports = mongoose.model("Customer", customerSchema)


