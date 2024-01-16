const verifiedMail = require("../email_templates/verified");
const welcomeMail = require("../email_templates/welcome");
const tempLock = require("../email_templates/temp_lock");
const LockedAccountModel = require("../model/locked_accounts.model");
const ParentModel = require("../model/parent.model");
const TutorModel = require("../model/tutors.model");
const UserModel = require("../model/user.model");
const checkCredentialAttempt = require("../utils/checkCredentialAttempt");
const emailService = require("../utils/emailService");
const generateRandomCode = require("../utils/generateRandomCode");
const validateData = require("../utils/validateData");
const BaseController = require("./base");
const unlockAccount = require("../email_templates/unlock_account");
const resetPassword = require("../email_templates/reset_password");
const passwordChanged = require("../email_templates/password_changed");
const BookingModel = require("../model/bookings.model");

class UserController extends BaseController {
  async registerUser(req, res) {
    try {
      let newUser = null;
      const postData = req.body;
      const { role, email } = postData;
      const postRule = {
        first_name: "required|string",
        last_name: "required|string",
        email: "required|email",
        password: "required|string",
        role: "required|string",
      };
      const postCustomMessage = {
        required: ":attribute is required",
        string: ":attribute must be a string",
      };

      const validationResponse = await validateData(
        postData,
        postRule,
        postCustomMessage
      );
      if (!validationResponse.success) {
        return UserController.failedResponse(res, validationResponse.error);
      }

      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        return UserController.failedResponse(
          res,
          "Account already exists. Please provide another email."
        );
      }

      if (role == "tutor") {
        newUser = await TutorModel.create({ ...req.body });
      } else if (role == "parent") {
        newUser = await ParentModel.create({ ...req.body });
      }
      const current_time = new Date();
      const one_hour = new Date(current_time.getTime() + 1000 * 60 * 60);
      const verification_code = generateRandomCode();
      newUser.verification_code = verification_code;
      newUser.verification_expiration = one_hour;

      await newUser.save();
      const token = await newUser.generateToken();
      newUser = newUser.toObject();
      delete newUser.password;
      const link = `${process.env.hostAddress}/verify/${newUser._id}`;
      const options = {
        from: "acehelp@Iklass Toptutors Limited",
        to: email,
        subject: "Getting started",
        html: welcomeMail(newUser.first_name, link, verification_code),
      };
      await emailService(options);

      return UserController.successResponse(res, { token, ...newUser });
    } catch (error) {
      return UserController.failedServerResponse(res, this.error_message);
    }
  }

  async verifyUser(req, res) {
    try {
      const postData = req.body;
      const { id: userId } = req.params;
      const { code } = postData;
      const postRule = {
        code: "required|string",
      };
      const postCustomMessage = {
        required: ":attribute is required",
        string: ":attribute must be a string",
      };

      const validationResponse = await validateData(
        postData,
        postRule,
        postCustomMessage
      );
      if (!validationResponse.success) {
        return UserController.failedResponse(res, validationResponse.error);
      }
      if (!userId) {
        return UserController.failedResponse(
          res,
          "Please provide a valid user ID"
        );
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return UserController.failedResponse(res, "User is not found.");
      }
      const current_time = new Date().getTime();
      const lapsing_time = new Date(user.verification_expiration);

      if (lapsing_time < current_time) {
        return UserController.failedResponse(
          res,
          "Your verification time has expired!"
        );
      }

      if (code !== user.verification_code) {
        return UserController.failedResponse(
          res,
          "Ensure you enter the right code"
        );
      }
      user.is_verified = true;
      user.verification_code = "";
      user.verification_expiration = "";
      await user.save();
      const options = {
        from: "acehelp@Iklass Toptutors Limited",
        to: user.email,
        subject: "Getting started",
        html: verifiedMail(user.first_name),
      };
      await emailService(options);

      return UserController.successResponse(res, "Verfication successful");
    } catch (error) {
      console.log(error);
      return UserController.failedServerResponse(res, this.error_message);
    }
  }

  async resendVerfication(req, res) {
    try {
      const postData = req.body;
      const { email } = postData;
      const postRule = {
        email: "required|email",
      };
      const postCustomMessage = {
        required: ":attribute is required",
        string: ":attribute must be a string",
      };

      const validationResponse = await validateData(
        postData,
        postRule,
        postCustomMessage
      );
      if (!validationResponse.success) {
        return UserController.failedResponse(res, validationResponse.error);
      }

      const userExists = await UserModel.findOne({ email });
      if (!userExists) {
        return UserController.failedResponse(
          res,
          "Account doesn't exists. Please check your email."
        );
      }

      const current_time = new Date();
      const one_hour = new Date(current_time.getTime() + 1000 * 60 * 60);
      const verification_code = generateRandomCode();
      userExists.verification_code = verification_code;
      userExists.verification_expiration = one_hour;

      await userExists.save();

      const link = `${process.env.hostAddress}/verify/${userExists._id}`;
      const options = {
        from: "acehelp@Iklass Toptutors Limited",
        to: email,
        subject: "Verification link sent",
        html: welcomeMail(userExists.first_name, link, verification_code),
      };
      await emailService(options);

      return UserController.successResponse(
        res,
        `Verfication link sent to ${email}`
      );
    } catch (error) {
      return UserController.failedServerResponse(res, this.error_message);
    }
  }

  async login(req, res) {
    try {
      const postData = req.body;
      const { email, password } = postData;
      const postRule = {
        email: "required|email",
        password: "required|string",
      };
      const postCustomMessage = {
        required: ":attribute is required",
        string: ":attribute must be a string",
      };

      const validationResponse = await validateData(
        postData,
        postRule,
        postCustomMessage
      );
      if (!validationResponse.success) {
        return UserController.failedResponse(res, validationResponse.error);
      }
      const userExists = await UserModel.findOne({ email });
      if (!userExists) {
        return UserController.failedResponse(
          res,
          "User does not exist. Please register"
        );
      }
      if (!userExists.is_verified) {
        return UserController.failedResponse(
          res,
          "Please verify your account to login"
        );
      }
      const isMatch = await userExists.comparePassword(password);
      if (userExists.failed_attempts >= 7) {
        const user_been_locked = await LockedAccountModel.findOne({
          userId: userExists._id,
        });
        if (
          user_been_locked &&
          user_been_locked.activate_time &&
          user_been_locked.attempt_time
        ) {
          const curr_time = new Date();
          if (curr_time > user_been_locked.activate_time) {
            const result = await checkCredentialAttempt(
              res,
              userExists,
              isMatch
            );
            if (!result.success) {
              return UserController.failedResponse(res, result.message);
            } else {
              userExists.failed_attempts = 0;
              await userExists.save();
              const options = {
                from: "acehelp@Iklass Toptutors Limited",
                to: userExists.email,
                subject: "Account unlocked",
                html: unlockAccount(userExists.first_name),
              };
              await emailService(options);
              await LockedAccountModel.findOneAndDelete({
                userId: userExists._id,
              });
              return UserController.successResponse(res, result.message);
            }
          } else {
            return UserController.failedResponse(
              res,
              "Please try again after 1 hour"
            );
          }
        }
        const current_time = new Date();
        const one_hour = new Date(current_time.getTime() + 1000 * 60 * 60);
        if (!user_been_locked) {
          await LockedAccountModel.create({
            userId: userExists._id,
            activate_time: one_hour,
          });
        }
        const options = {
          from: "acehelp@Iklass Toptutors Limited",
          to: userExists.email,
          subject: "Account temporarily locked",
          html: tempLock(userExists.first_name),
        };
        await emailService(options);

        return UserController.failedResponse(
          res,
          "Account has been deactivated due to multiple attempts. An email has been sent to you"
        );
      }
      const result = await checkCredentialAttempt(res, userExists, isMatch);
      if (!result.success) {
        return UserController.failedResponse(res, result.message);
      } else {
        userExists.failed_attempts = 0;
        await userExists.save();
        return UserController.successResponse(res, result.message);
      }
    } catch (error) {
      console.log(error);
      return UserController.failedServerResponse(res, this.error_message);
    }
  }

  async forgotPassword(req, res) {
    try {
      const postData = req.body;
      const { email } = postData;
      const postRule = {
        email: "required|email",
      };
      const postCustomMessage = {
        required: ":attribute is required",
        string: ":attribute must be a string",
      };

      const validationResponse = await validateData(
        postData,
        postRule,
        postCustomMessage
      );
      if (!validationResponse.success) {
        return UserController.failedResponse(res, validationResponse.error);
      }

      let reset_link;
      const user = await UserModel.findOne({ email });
      if (!user) {
        UserController.failedResponse(res, "User does not exist.");
      }

      reset_link = `${process.env.hostAddress}/api/users/reset/${user._id}`;
      const options = {
        from: "acehelp@Iklass Toptutors Limited",
        to: email,
        subject: "Request to change password",
        html: resetPassword(user.first_name, reset_link),
      };
      await emailService(options);
    } catch (error) {
      return UserController.failedServerResponse(
        res,
        "Something went wrong. Please try again later."
      );
    }
  }

  async resetPassword(req, res) {
    try {
      const { id: userId } = req.params;

      const postData = req.body;
      const { password, c_password } = postData;
      const postRule = {
        password: "required|string",
        c_password: "required|string",
      };
      const postCustomMessage = {
        required: ":attribute is required",
        string: ":attribute must be a string",
      };

      const validationResponse = await validateData(
        postData,
        postRule,
        postCustomMessage
      );
      if (!validationResponse.success) {
        return UserController.failedResponse(res, validationResponse.error);
      }

      if (!userId) {
        return UserController.failedResponse(res, "Please provide a user ID");
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return UserController.failedResponse(res, "User is not found");
      }

      if (password != c_password) {
        return UserController.failedResponse(
          res,
          "Please ensure that your passwords match"
        );
      }

      user.password = password;
      await user.save();

      const options = {
        from: "acehelp@Iklass Toptutors Limited",
        to: user.email,
        subject: "Password changed",
        html: passwordChanged(user.first_name),
      };
      await emailService(options);

      return UserController.successResponse(
        res,
        "Password has been reset successfully."
      );
    } catch (error) {
      console.log(error, "the error");
      return UserController.failedServerResponse(
        res,
        "Something went wrong. Please try again later"
      );
    }
  }

  async dashboardStat(req, res) {
    try {
      let active_sessions, inactive_sessions;
      const role = req.user.role;
      if (role == "tutor") {

       const completed_tutor_session = await BookingModel.aggregate([
        { $unwind: '$session_per_month' },
        { $match: { 'session_per_month.status': true, tutor: req.user._id } },
        { $group: { _id: null, count: { $sum: 1 } } }
       ])
       const tutorAveRating = await BookingModel.aggregate([
        { $unwind: '$session_per_month' },
        { $match: { 'session_per_month.status': true, tutor: req.user._id } },
        { $group: { _id: null, average: {$avg: "session_per_month.tutor_rating"} } }
       ])

       return console.log(tutorAveRating)


        const forTutors = Promise.all([
          BookingModel.find({ start_session: true, tutor: req.user._id }).count(),
          BookingModel.find({ tutor: req.user._id, terminated: true }).count(),
        ]);
        const [a_sessions, inact_sessions] = await forTutors;
        active_sessions = a_sessions;
        inactive_sessions = inact_sessions;
        return UserController.successResponse(res, {
          active_sessions,
          inactive_sessions,
          completed_tutor_session: completed_tutor_session[0]?.count || 0,
          tutorAveRating
        });
      } else if (role == "parent") {
        const forTutors = Promise.all([
          BookingModel.find({ booked_by: req.user._id }),
          BookingModel.find({ start_session: true }),
        ]);
        const [a_sessions, inact_sessions] = await forTutors;
        active_sessions = a_sessions;
        inactive_sessions = inact_sessions;
        return UserController.successResponse(res, {
          active_sessions,
          inactive_sessions,
        });
      }
      return UserController.successResponse(res, 'Sent from admin')

    } catch (error) {
      console.log(error)
      return UserController.failedServerResponse(
        res,
        "Something went wrong. Please try again laterrr."
      );
    }
  }
  async getUser(req, res){
    try {
      return UserController.successResponse(res,req.user)
    } catch (error) {
      return UserController.failedServerResponse(res, 'Something went wrong. Please try again later')
    }
  }
  
}

module.exports = UserController;
