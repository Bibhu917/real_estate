const express = require('express');
const dbConnection = require('./config/db');
const authRouter = require('./routes/authRoute')
const userRoute = require('./routes/userRoute');
const listingRouter = require('./routes/listingRoute')
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRouter)
app.use('/api/user',userRoute)
app.use('/api/listing',listingRouter)
// app.use('')


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).send({
        success:false,
        statusCode,
        message
    })
})


app.get('/',(req,res)=>{
    try {
        return res.status(200).send("Hello World From Real Estate")
    } catch (error) {
        return res.status(500).send({message:"Server Error Occured in Home page"})
    }
})
app.listen(8000,async()=>{
    await dbConnection();
    console.log("Server is listening on Port 8000 !!")
})