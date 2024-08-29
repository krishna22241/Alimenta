const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken');
const USer = require("../Models/User");
const {generateOTP,sendOTPonMail} = require("../Middlewares/OtpValidation");
require("dotenv").config();

//signup route handler

exports.signup = async (req,res) =>{
    try{

        const {name,email,password,mobile,role}  = req.body;

        const existingUser = await USer.findOne({email});

         if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            });
         }
         
        try{
            hashPassword = await bcrypt.hash(password ,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error in hashing Password',
            });
        }
        req.body.password = hashPassword;
        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        const user = new USer({ ...req.body, otp, otpExpiry });
        await user.save();

        sendOTPonMail(email , otp);
        
        // await sendMessage(otp,mobile);

        return res.status(200).send({
            success: true,
            message: "OTP sent to mobile. Please verify.",
          });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'user cannot be registered , pls try again later',
        });
    }
}

//VALIDATE SIGN UP OTP

exports.ValidateOtp = async (req,res)=>{
    try{
        const {email,otp} = req.body;
        const user = await USer.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:'user not found'
                });
        }
        if(user.otpExpiry < Date.now()){
            await USer.deleteOne({ email });
            return res.status(400).json({
                success:false,
                message:'OTP expired'
                });
        }
        if(user.otp !== otp){
            return res.status(400).json({
                success:false,
                message:'invalid OTP'
                });
        }
        user.otp = '';
        user.otpExpiry = 0;
        await user.save();
        return res.status(200).json({
            success:true,
            message:'user registered successfully'
            });
            

    }  
    catch(error){
        console.error(error);
    }         
}


 //login

 exports.login = async (req,res) =>{
    try{
       
        const {email,password} =req.body;

        
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'pls fill all the details carefully',
            });
        }
        
        let  us = await USer.findOne({email});
       
        if(!us){
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }
        
        if(await bcrypt.compare(password,us.password) ){

            const otp = generateOTP();
            const otpExpiry = Date.now() + 5 * 60 * 1000; 
            us.otp = otp;
            us.otpExpiry = otpExpiry;
            await us.save();
            // await sendMessage(otp,us.mobile);
             await sendOTPonMail(email, otp);



            return res.status(200).send({
              success: true,
              message: "OTP sent . Please verify.",
            });
 
        }

        else{
            return res.status(403).json({
                success:false,
                message:"incorrect password",
            });
        }
    }

    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'login controller failed',
        });
    }
 }


// VALIDATE LOGIN OTP
exports.ValidateOtpLogin = async (req,res)=>{
   try{
    const {email,otp} = req.body;
    let user = await USer.findOne({email});
    if (!user) {
        return res.status(400).send({
          success: false,
          message: "User not found",
        });
    }
    if (user.otpExpiry < Date.now()) {
        return res.status(400).send({
            success: false,
            message: "OTP expired",
        });
    }
    if (user.otp !== otp) {
        return res.status(400).send({
            success: false,
            message: "Invalid OTP",
            });
    }
     const payload = {
       email: user.email,
       id: user.id,
       role: user.role,
     };


     let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
     user = user.toObject();
     user.token = token;
     user.password = undefined;
     user.otp = undefined; 
     user.otpExpiry = undefined;

     const options = {
       expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
       httpOnly: true,
     };

     res.cookie("token", token, options);
     res.cookie("email", user.email);

     
    //  await user.save();//error --->  save() is not a function because user object is not a mongoose document instance due to this user = user.toObject();
    await USer.findByIdAndUpdate(user._id, user);

     return res.status(200).json({
        success: true,
        token,
        user,
        message: "user logged in successfully",
      });


   }
   catch(error){
    console.error(error);
    return res.status(500).json({
        success:false,
        message:'validate otp login failed',
        });
   }

}


//SIGN-OUT

exports.signout = (req,res)=>{
    try{
      res.clearCookie("token");
      res.clearCookie("email");
      return res.status(200).json({
        success: true,
        message: "user logged out successfully",
      });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'signout failed',
            });
    }   
}