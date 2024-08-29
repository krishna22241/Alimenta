const express = require('express');
const app= express();
require("dotenv").config();

const PORT = process.env.PORT || 4000;//process obj se port no. nikal lia 

//cookie-parser 
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//middleware to parse json request body

app.use(express.json());


// imports routes for TODO api

const AuthRoutes = require("./Routes/auth");

//mount the todo API  routes

app.use("/api/v1/auth",AuthRoutes);

//start server

app.listen(PORT , ()=>{
    console.log(`server started successfully at ${PORT}`);

})

// connect to the database

const dbConnect = require("./config/database");
dbConnect();




