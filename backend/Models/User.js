const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim :true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
        trim:true,
    },
    mobile:{
        type:Number,
        required:true,
        // max : 10, 
        required:true,
    },
    otp:{
        type:String,
    },
    otpExpiry:{
        type:Date,
    },
    role:{
        type:String,
        //when we use enum thn the role will be limited to the given role only
        enum:["Donor","Organisation"]
    }
});

module.exports = mongoose.model("user" , userSchema);