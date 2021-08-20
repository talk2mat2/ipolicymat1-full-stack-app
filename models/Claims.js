const mongoose = require('mongoose');
const Schema= mongoose.Schema


const Claims= new Schema({
    firstName:String,
    policyNumber:String,
    policyType:String,
    startDate:String,
    endDate:String,
    firstName:String,
    lastName:String,
    mobileNumber:String,
    email:String,
    previousClaims:String,
    Provide_No_Claim:String,
})



module.exports= mongoose.model('Claims',Claims)
