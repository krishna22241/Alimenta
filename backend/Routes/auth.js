const express = require("express");

const router = express.Router();


const {login, signup,ValidateOtp,ValidateOtpLogin,signout} = require("../Controllers/authController");
const{auth,isDonor,isORG} = require("../Middlewares/auth");



router.post("/login" , login);
router.post("/signup" , signup);
router.post("/verify-otp", ValidateOtp);
router.post("/verify-otp-login", ValidateOtpLogin);
router.get("/signout", signout);



router.get("/test" , auth ,(req,res) => {
    res.json({
        success:true,
        message:"wlcm to protected route for tests"
    });
});
//protected routes
router.get("/donor" , auth , isDonor , (req,res)=>{
    res.json({
        success:true,
        message:"wlcm to protected route for donor"
    });
});
router.get("/org" , auth , isORG , (req,res)=>{
    res.json({
        success:true,
        message:"wlcm to protected route for ORG"
    });
});
module.exports = router;