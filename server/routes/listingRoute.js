const express = require('express');
const listingRouter = express.Router();
const jwt = require('jsonwebtoken');
const listingModel = require('../models/listiingmodel')


listingRouter.post('/create',async(req,res)=>{
    try {
    const token = req.cookies.access_token;
    if(!token){
        return res.status(401).send({success:false,message:"Unauthorized"})
       }
       jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,user)=>{
        if(err){
            return res.status(403).send({success:false,message:"Forbidden"})
        }
        try {
            const listing = new listingModel({...req.body});
            await listing.save();
            return res.status(201).send({success:true,message:"Listing Created Successfully",listing})
        } catch (error) {
            console.log(error);
            return res.status(500).send({ success: false, message: "Internal Server Erro occur while ftching create listig route api" });
        }
       })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,messgae:"Internal Server Erro occur while ftching create listig route api"})
    }
})

module.exports = listingRouter;