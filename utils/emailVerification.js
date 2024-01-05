const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const studentModel = require('../model/studentSchema')
 

 
const transporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "testingweb262@gmail.com",
    pass: "tmtx vywg atdf plui",
  },
});




module.exports = transporter