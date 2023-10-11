const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userModel = require("../models/usermodel");

dotenv.config();
userRouter.put('/updateUser/:id',async(req,res)=>{
    try {
       const {id} = req.params;
       const token = req.cookies.access_token;
       if(!token){
        return res.status(401).send({success:false,message:"Unauthorized"})
       }
       jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,user)=>{
        if(err){
            return res.status(403).send({success:false,message:"Forbidden"})
        }
        try {
            const updatedUser = req.body;
            const data = await userModel.findByIdAndUpdate(id, updatedUser, { new: true, runValidators: true });
            await data.save();
            return res.status(200).send({ success: true, message: "User Updated Successfully", data });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ success: false, message: "Internal Server Errorhet" });
        }
       })
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:"Internal Server error"})
    }
})
module.exports = userRouter;