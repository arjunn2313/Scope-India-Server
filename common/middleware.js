const multer = require('multer')

const profile = multer.diskStorage({
    destination : (req,res,cb) =>{
        cb(null,"uploads")
    },
    filename:(req,file,cb) =>{
        console.log(file.mimetype)
        const ext = file.mimetype.split('/')[1]
        cb(null,`${file.fieldname}_${Date.now()}.${ext}`)
    }
})


module.exports = profile