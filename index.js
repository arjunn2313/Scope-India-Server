const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const studentRoute = require('./route/studentRoute')
const cors = require('cors')
const path = require('path')
const enquiryRoute = require('./route/enquiryRoute')
const courseTable = require('./route/courseTable')

app.use(cors(
    {
      origin: ["https://scope-india-client.vercel.app"],
      methods: ["POST", "GET"],
      credentials: true,
    })
  );
// connection to DB
const connect = () =>{
    mongoose.connect(process.env.uri).then((res)=>{
        console.log('connected to db')
    }).catch((err)=>{
        console.log(`error while connecting to db ${err}`)
    })
}
app.get('/',(req,res)=>{
    res.send('scope india')
})
// middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/student',studentRoute)
app.use('/enquiry',enquiryRoute)
app.use('/course',courseTable)


app.listen(6060,(error)=>{
    if(error) throw error
    console.log('server started')
    connect()
})
