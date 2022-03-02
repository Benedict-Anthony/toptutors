const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var saltIteration = 10;
var jwt = require("jsonwebtoken");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const tutorsSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      max: 100,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      max: 100,
    },
    address: {
      type: String,
      required: false,
      trim: true,
      max: 300,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 200,
    },
    phone_number: {
      type: String,
      trim: true,
      required: false,
      max: 100,
    },
    country: {
      type: String,
      required: false,
      trim: true,
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
      trim: true,
      max: 100,
    },
    start_date: {
      type: Date,
      default: Date.now,
      required: false,
    },
    relationship: {
      type: String,
      required: false,
      max: 200,
    },
    sex: {
      type: String,
      required: false,
      max: 100,
      trim: true,
      enum: ["Female", "Male"],
    },
    nationality: {
      type: String,
      required: false,
      max: 150,
    },
    career_summary: {
      type: String,
      required: false,
      max: 600,
    },
    subjects: [
      {
        type: [String],
        required: false,
      },
    ],
    monthly_rate: {
      type: String,
      required: false,
      trim: true,
      max: 300,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    reset_link: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
      max: 100,
    },
    institution: {
        type: [String],
        required: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

tutorsSchema.pre("save", function (next, doc) {
  var user = this;
  console.log(user.isNew);
  // || user.isModified("password")
  if (user.isNew) {
    //if the user is new or modified hash algorithm runs if it is
    bcrypt.genSalt(saltIteration, function (error, salt) {
      if (error) {
        return console.log(error);
      }
      bcrypt.hash(user.password, salt, function (err, hashedPassword) {
        if (err) return next(err);
        user.password = hashedPassword;
        console.log("schema new user password" + user.password);
        next();
      });
    });
  } else {
    next();
  }
});

tutorsSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(
    candidatePassword.toString(),
    this.password,
    function (error, ismatch) {
      if (error) throw error;
      console.log(ismatch);
      return cb(null, ismatch);
    }
  );
};
//methods are applied
tutorsSchema.methods.generateToken = function (cb) {
  var user = this;
  var secretkey = process.env.auth_secretkey;
  const generatedToken = jwt.sign(
    { id: user._id, email: user.email, type: "tutor" },
    secretkey
  );
  user.token = generatedToken;
  user.save((err, userWithUpdatedToken) => {
    if (err) return cb(err, null);
    cb(null, userWithUpdatedToken);
  });
};
tutorsSchema.statics.findByToken = function (token, cb) {
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

tutorsSchema.methods.updatePassword = function (password, cb) {
  console.log(password);
  var user = this;
  bcrypt.genSalt(saltIteration, function (error, salt) {
    if (error) {
      throw error;
    }
    console.log(password);
    bcrypt.hash(password, salt, function (err, hashedPassword) {
      console.log(salt);
      if (err) throw err;
      user.password = hashedPassword;
      console.log(hashedPassword);
      cb(null, user);
    });
  });
};
tutorsSchema.plugin(aggregatePaginate);
const dbTutors = mongoose.model("dbTutor", tutorsSchema);
module.exports = dbTutors;
