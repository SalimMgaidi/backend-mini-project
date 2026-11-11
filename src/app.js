const express = require("express")
const cors = require("cors")
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');

const app =express()


app.use(cors()) // applying cors first 
app.use(express.json()) // using json for req and res 
app.use('/auth', authRoutes);  // auth routes
app.use('/projects', projectRoutes); //project routes 
app.use('/tasks', taskRoutes); //tasks routes


app.get("/api/health",(req,res) =>res.json({success : true ,status : "all good"}))



module.exports=app