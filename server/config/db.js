const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const dbConnection = ()=>{
    try {
        const data = mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Mongodb Is Connected")
    } catch (error) {
        console.log(error)
    }
}
module.exports = dbConnection;