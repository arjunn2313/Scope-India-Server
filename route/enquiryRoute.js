const router = require('express').Router()
const enquiry = require('../controllers/enquiryController')
const enquiryModel = require('../model/enquirySchema')
const nodemailer = require('nodemailer')

// SENT ENQUIRY
router.post('/',enquiry)

module.exports = router