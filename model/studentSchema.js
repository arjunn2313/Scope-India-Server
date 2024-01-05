const mongoose = require("mongoose");
const course = require('./courseSchema')

const studentSchema = mongoose.Schema({
  firstName: {
    type: String,
    // required : [true,'Please enter your firstName']
  },
  lastName: {
    type: String,
    // required : [true,'Please enter your firstName']
  },
  email: {
    type: String,
    // required : [true,'Please enter your email']
  },
  dob: {
    type: String,
    // required : [true,'Please enter your dob']
  },
  gender: {
    type: String,
    // required : [true,'Please enter your gender']
  },
  phone: {
    type: String,
    // required : [true,'Please enter your phone']
  },
  country: {
    type: String,
    // required : [true,'Please enter your qualification']
  },
  city: {
    type: String,
    // required : [true,'Please enter your  city']
  },
  state: {
    type: String,
    // required : [true,'Please enter your state']
  },
  image: {
    type: String,
  },
  password :{
    type:String
  },
  courseid :[{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'COURSE TABLE'  
  }],
  isVerified : {
    type : Boolean,
    default:false
  }
});

module.exports = mongoose.model("Student Information", studentSchema);
