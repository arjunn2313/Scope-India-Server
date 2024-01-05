const jwt = require('jsonwebtoken')

const verifyUser = (req,res,next)=>{
    // console.log(req.headers)
    const token = req.headers.authorization.split(" ")[1]
    // console.log(token)

    if(token == undefined){
        res.status(403).json({
            status :true,
            message:'token is required'
        })
    }else{
        try {
            const isToken = jwt.verify(token,process.env.login)
            console.log(isToken)
            req.user = isToken
            next()
        } catch (error) {
            res.status(403).json({
                status : false,
                message : 'Invalid Token'
            })
        }
    }
}

module.exports = verifyUser;