const verifiedMail = require("../email_templates/verified");
const welcomeMail = require("../email_templates/welcome");
const ParentModel = require("../model/parent.model");
const TutorModel = require("../model/tutors.model");
const UserModel = require("../model/user.model");
const emailService = require("../utils/emailService");
const generateRandomCode = require("../utils/generateRandomCode");
const validateData = require("../utils/validateData");
const BaseController = require('./base')

class UserController extends BaseController {

  async registerUser(req, res) {
    try {
        let newUser = null
        const postData = req.body
        const {role, email} = postData
        const postRule = {
            first_name: 'required|string',
            last_name: 'required|string',
            email: 'required|email',
            password: 'required|string',
            role: 'required|string'
        }
        const postCustomMessage = {
            "required": ":attribute is required",
            "string": ":attribute must be a string"
        }

        const validationResponse = await validateData(postData, postRule, postCustomMessage)
        if(!validationResponse.success){
            return UserController.failedResponse(res, validationResponse.error)
        }

        const userExists = await UserModel.findOne({email})
        if(userExists){
            return UserController.failedResponse(res, 'Account already exists. Please provide another email.')
        }

        if(role=='tutor'){
            newUser = await TutorModel.create({...req.body})
        }else if(role=='parent'){
            newUser = await ParentModel.create({...req.body})
        }
        const verification_code = generateRandomCode()
        newUser.verification_code = verification_code

        await newUser.save()
        const token = await newUser.generateToken()
        newUser = newUser.toObject()
        delete newUser.password
        const link = `${process.env.hostAddress}/verify/${newUser._id}`
        const options = {
            from: "acehelp@Iklass Toptuors Limited",
            to: email,
            subject: "Getting started",
            html: welcomeMail(newUser.first_name, link, verification_code)
        }
        await emailService(options)

        return UserController.successResponse(res, {token, ...newUser})
        
    } catch (error) {
      return UserController.failedResponse(res, 'Something went wrong. Try again later')
    }
}

async verifyUser(req, res){
    try {
        const postData = req.body
        const {id: userId} = req.params
        const {code} = postData
        const postRule = {
            code: 'required|string',
        }
        const postCustomMessage = {
            "required": ":attribute is required",
            "string": ":attribute must be a string"
        }

        const validationResponse = await validateData(postData, postRule, postCustomMessage)
        if(!validationResponse.success){
            return UserController.failedResponse(res, validationResponse.error)
        }
        if(!userId){
            return UserController.failedResponse(res, 'Please provide a valid user ID')
        }
        const user = await UserModel.findById(userId)
        if(!user){
            return UserController.failedResponse(res, 'User is not found.')
        }

        if(code !== user.verification_code){
            return UserController.failedResponse(res, 'Ensure you enter the right code')
        }
        user.is_verified = true
        user.verification_code = ''
        await user.save()
        const options = {
            from: "acehelp@Iklass Toptuors Limited",
            to: user.email,
            subject: "Getting started",
            html: verifiedMail(user.first_name)
        }
        await emailService(options)

        return UserController.successResponse(res,'Verfication successful')
    } catch (error) {
        console.log(error)
        return UserController.failedResponse(res, 'Something went wrong. Try again later')
    }
  }
}


module.exports = UserController