const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name: {
        type : String,
        required : true
    },
    userId: {
        type : String,
        required: true
    },
    password:{
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        lowercase : true,
        minlenth : 15,
        unique : true
    },
    usertype :{
        type : String,
        required : true,
        default : 'CUSTOMER',
        enum :['CUSTOMER','ADMIN']
    }
},{timestamps : true, versionKey : false}) // created date and time , to avoid add --v in the package it make it false

module.exports = mongoose.model('user', userSchema)