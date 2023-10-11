const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require("../models/usermodel");

authRouter.post('/signup',async(req,res,next)=>{
    try {
        const {username,email,password} = req.body;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[a-zA-Z]).{8,}$/;
        const hasedPassword = await bcrypt.hashSync(password,10);
        const existingUser = await userModel.findOne({email})
        const validationErrors = {};
        if(existingUser){
            validationErrors.email = "User email already exists";
        }
        if(!username || !email || !password){
            validationErrors.fields = "Please Enter all the Fields";
        }
        if(username.length < 4){
            validationErrors.username = "Please Enter a Valid Username (minimum 4 characters)";
        }
        if(!emailRegex.test(email)){
            validationErrors.email = "Please Enter a Valid Email";
        }
        if(!passwordRegex.test(password)){
            validationErrors.password = "Please Enter a Valid Password (minimum 8 characters, including at least one digit, one lowercase letter, one uppercase letter, and one special character)";
        }
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).send({ success: false, errors: validationErrors });
          }      
        const user = new userModel({username,email,password:hasedPassword})
        await user.save();
        return res.status(201).send({success:true,message:"User Registered Successfully",user})
    } catch (error) {
        next(error);
    }
})

authRouter.post('/signin', async (req, res) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[a-zA-Z]).{8,}$/;
    const { email, password } = req.body;
    const validationErrors = {};

    try {
        if (!emailRegex.test(email)) {
            validationErrors.email = "Please enter a valid email";
        }
        if (!passwordRegex.test(password)) {
            validationErrors.password = "Please enter a valid password";
        }
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({ success: false, errors: validationErrors });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            validationErrors.email = "User Not Found";
            return res.status(404).json({ success: false, errors: validationErrors });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            validationErrors.password = 'Invalid Credentials';
            return res.status(401).json({ success: false, errors: validationErrors });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        const {password:pass,...rest} = user._doc;
        res.cookie('access_token', token, { httpOnly: true });
        return res.status(200).json({ success: true, message: "Login Successfully", token, rest });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

authRouter.get('/listOfUsers',async(req,res)=>{
    try {
        const userList = await userModel.find();
        return res.status(200).json({success: true, message:"User List",userList})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
})

authRouter.post('/google',async(req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email}); 
        if(user){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
            const {password:pass,...rest}=user._doc
            return res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword,10);
            const newuser = new userModel({username:req.body.name.split("").join("").toLowerCase()+Math.random().toString(36).slice(-8),email:req.body.email,password:hashedPassword,avatar:req.body.photo}); 
            await newuser.save();
            const token = jwt.sign({id:newuser._id},process.env.JWT_SECRET_KEY);
            const {password:pass,...rest} = newuser._doc;
            return res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
})
authRouter.get('/signOut',async(req,res)=>{
    try {
       res.clearCookie('access_token');
       res.status(200).send({success:true,messgae:"User has been signed out"})
    } catch (error) {
        return res.status(500).send({success:false,messgae:"Server Error"})
    }
})
module.exports = authRouter;