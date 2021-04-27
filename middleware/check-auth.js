const jsonwebtoken = require("jsonwebtoken")
module.exports = (req,res,next)=>{
    console.log(req.headers)
    try{
        const token = req.headers.authorization
        const Token = token.split(' ')[1] //Separate bearer from the token
        const decodedToken = jsonwebtoken.verify(Token,process.env.auth_secretkey)
        if(decodedToken.type=="parent"){
          return  next()            
        }
        if(decodedToken.type!=="parent"){
            res.status(400).json({
                message:"Invalid token, current user must be signed in as a tutor to see fetch this information"
            })            
        }
        // next()
    }
    catch(error){
        res.status(401).json({
            message:"Invalid token",
            error
        })
    }
}