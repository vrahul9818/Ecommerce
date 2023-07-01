const express = require("express");
const dotenv = require("dotenv");
const app = require("./app");

/// uncaught exceptions 
process.on("uncaughtException",(err)=>{
    console.log(`errpr : ${err.message}`)
    process.exit(1);
})

//dotenv config 
dotenv.config({path:"backend/config/config.env"})

//mongoose Connection establish
const connection = require('./config/databaseMongo')





connection();


//unhandeled promise rejection 



const server = app.listen(process.env.SERVER_PORT,()=>{
    console.log(`Sever is  on ${process.env.SERVER_PORT}`)
})


process.on("unhandledRejection",(error)=>{
    console.log(`Error: ${error}`)
    console.log(`shutting server Down `)
    server.close();
    process.exit(1);

}) 