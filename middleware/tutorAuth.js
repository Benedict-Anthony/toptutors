const BaseController = require("../controllers/base")

const tutorAuth = (req,res,next)=>{
    try{
        const role = req.user.role || ''
        if(role!='tutor'){
            return BaseController.failedResponse(res, 'You must be a tutor to have access to this resource')
        }
        next()
    }
    catch(error){
        next(error)
        // return BaseController.failedServerResponse(res,'Something went wrong. Please try again later.')
    }
}

module.exports = tutorAuth