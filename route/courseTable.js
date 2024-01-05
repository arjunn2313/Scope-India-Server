const router = require('express').Router()
const profile = require('../common/middleware');
const courseModel = require('../model/courseSchema')
const multer =require('multer')
const upload = multer({ storage: profile });

router.post('/',upload.single("image"),async(req,res)=>{
    let {...details} = req.body
    let image = "/uploads/" + req.file.filename;
    
    try {
        courseModel.create({...details,image})
        res.status(200).json({
            status : true,
            message :'ok'
        })
    } catch (error) {
        res.status(200).json({
            status : false,
            message :error
        })
    }
    
})

router.get('/',async(req,res)=>{
    try {
        courseModel.find({}).then((data)=>{
            res.status(200).json({
                status:true,
                result:data
            })
        }).catch((err)=>{
            res.status(400).json({
                status:false,
                message:err
            })
        }
        )
    } catch (error) {
        res.status(500).json({
            status:false,
            message:error
        })
    }
})



 


module.exports = router;