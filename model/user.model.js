const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var saltIteration = 10;
var jwt = require("jsonwebtoken");

// var studentSchema = new Schema({
//     name:String,
//     age:Number,
//     grade:Number,
//     _class:String,
// })

var userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      reuired: true,
    },
    photo: {
      type: String,
    },
    marital_status: {
      type: String,
      capitalize: true,
      enum: ["Single", "Married", "Other"],
    },
    password: {
      type: String,
      required: true,
      max: 100,
    },
    sex: {
      type: String,
      capitalize: true,
      enum: ["Male", "Female"],
    },
    country: {
      type: String,
      required: false,
      max: 200,
    },
    state_of_residence: {
      type: String,
      required: false,
      max: 100,
    },
    city: {
      type: String,
      required: false,
      max: 100,
    },
    start_date: {
      type: Date,
      required: false,
      max: 100,
    },
    relationship: {
      type: String,
      required: false,
      max: 100,
    },
    nationality: {
      type: String,
      required: false,
      max: 150,
    },
    // tutor:[{ref:'parent',type:Schema.Types.ObjectId}],
    ocupation: {
      type: String,
    },
    is_verified: {
        type: Boolean,
        default: false,
      },
    // category:[studentSchema],
    // token: {
    //     type: String,
    //     required: false,
    //     max: 100,
    //   },
    reset_link: {
      type: String,
      required: false,
    },
    verification_code: {
        type: String
    },
    verification_expiration: {
        type: String
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function (next, doc) {
  var user = this;
  if (user.isNew || user.isModified("password")) {
    //if the user is new or modified hash algorithm runs if it is
    bcrypt.genSalt(saltIteration, function (error, salt) {
      if (error) {
        return console.log(error);
      }
      bcrypt.hash(user.password, salt, function (err, hashedPassword) {
        if (err) return next(err);
        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(
    candidatePassword.toString(),
    this.password,
    function (error, ismatch) {
      if (error) throw error;
      return cb(null, ismatch);
    }
  );
};
//methods are applied
userSchema.methods.generateToken = async function () {
  var user = this;
  var secretkey = process.env.SECRET_KEY;
  const generatedToken = jwt.sign(
    { id: user._id, email: user.email },
    secretkey
  );
  // user.token = generatedToken;
  // await user.save()
  return generatedToken;
};
userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  console.log(user);
  user
    .findOne({ token })
    .then((doc) => {
      cb(null, doc);
    })
    .catch((err) => {
      cb(err, null);
    });
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
