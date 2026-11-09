const express = require("express")
const cors = require("cors")

const app =express()


app.use(cors()) // applying cors first 
app.use(express.json()) // using json for req and res 


app.get("/api/health",(req,res) =>res.json({success : true ,status : "all good"}))



module.exports=app