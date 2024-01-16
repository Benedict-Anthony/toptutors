const UserController = require("../controllers/userController")

async function checkCredentialAttempt(res, user,isMatch){
    if(!isMatch){
        user.failed_attempts = user.failed_attempts + 1
        await user.save()
        return {success: false, message: 'Incorrect credentials. Please try again.'}
      }else{
          const token = await user.generateToken()
          return {success: true, message: {token, role: user.role}}
        }
}

module.exports = checkCredentialAttempt