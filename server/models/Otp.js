import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    otp:{
        type:String,
        required:true,
    }
})