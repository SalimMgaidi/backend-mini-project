const express = require("express")
const cors = require("cors")
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

const app =express()


app.use(cors()) // applying cors first 
app.use(express.json()) // using json for req and res 
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);


app.get("/api/health",(req,res) =>res.json({success : true ,status : "all good"}))



module.exports=app