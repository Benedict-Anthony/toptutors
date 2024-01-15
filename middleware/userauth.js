const BaseController = require('../controllers/base');
const jwt = require('jsonwebtoken');
const UserModel = require('../model/user.model');

async function userAuthModel (req, res, next){
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ''
        if(!token){
            return BaseController.failedResponse(res,'You are not authorized to access the resource')
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await UserModel.findById(decoded.id, '-password')
        req.user = user
        next()
    } catch (error) {
        next(error)
        return BaseController.failedResponse(res,'Something went wrong. Please try again later')
    }
    next()
}

module.exports = userAuthModel;