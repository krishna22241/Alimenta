const jwt = require("jsonwebtoken");
require("dotenv").config();

//authentication
exports.auth =(req,res,next) =>{
    try{
        //extract JWT token

        const token = req.cookies.token ;

        if(!token || token ===undefined){
            return res.status(401).json({
                success:false,
                message:'token missing',
            });
        }

        //verify the token
        try{
            const decode =jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode); 
            req.us = decode;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:'token invalid',
            }); 
        }
        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:'something went wrong , verifying token',
        });
    }
}


//authorisation
exports.isDonor = (req,res,next) =>{
    try{
        if(req.us.role !== "DONOR"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for donors',
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'user role is not matching',
        });
    }
}

exports.isORG = (req,res,next) =>{
    try{
        if(req.us.role!=="Organisation"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for ORG',
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'user role is not matching',
        });
    }
}