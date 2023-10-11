const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }, 
    avatar:{
        type:String,
        default:"https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    }, 
},{timestamps:true});

const userModel = mongoose.model('User',userSchema);
module.exports = userModel