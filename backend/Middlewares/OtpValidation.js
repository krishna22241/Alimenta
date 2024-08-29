const nodemailer = require("nodemailer");


const generateOTP = ()=>{
    return Math.floor(1000 + Math.random() * 9000);
}


const sendOTPonMail = async (email,otp)=>{
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });
    
        let info = await transporter.sendMail({
            from:`KRISHNAPATHAK`,
            to:email,
            subject:"Your 4 digit One-Time-Password--->",
            html:`<h2>HEllo</h2> <p> Enter this OTP : ${otp}</p>`,
        })

    console.log("Message sent: %s", info.messageId);
    }catch(error){
        console.log(error);
    }
   
}


module.exports = {generateOTP , sendOTPonMail};