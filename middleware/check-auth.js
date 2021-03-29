const jsonwebtoken = require("jsonwebtoken")
module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization
        console.log(token)
        const decodedToken = jsonwebtoken.verify(token,"specailsecretword")
    }
    catch(error){
        res.send(401,{
            message:"Invalid token"
        })
    }
}