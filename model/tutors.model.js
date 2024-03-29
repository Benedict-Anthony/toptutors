const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var saltIteration = 10;
var jwt = require("jsonwebtoken");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const UserModel = require("./user.model");

const tutorsSchema = new Schema(
  {
    // first_name: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   max: 100,
    // },
    // last_name: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   max: 100,
    // },
    // address: {
    //   type: String,
    //   required: false,
    //   trim: true,
    //   max: 300,
    // },
    // email: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   unique: true,
    //   max: 200,
    // },
    // phone_number: {
    //   type: String,
    //   trim: true,
    //   required: false,
    //   max: 100,
    // },
    // country: {
    //   type: String,
    //   required: false,
    //   trim: true,
    //   max: 200,
    // },
    // state_of_residence: {
    //   type: String,
    //   required: false,
    //   max: 100,
    // },
    // city: {
    //   type: String,
    //   required: false,
    //   trim: true,
    //   max: 100,
    // },
    // start_date: {
    //   type: Date,
    //   default: Date.now,
    //   required: false,
    // },
    // relationship: {
    //   type: String,
    //   required: false,
    //   max: 200,
    // },
    // sex: {
    //   type: String,
    //   required: false,
    //   max: 100,
    //   trim: true,
    //   enum: ["Female", "Male"],
    // },
    // nationality: {
    //   type: String,
    //   required: false,
    //   max: 150,
    // },
    // password: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // reset_link: {
    //   type: String,
    //   required: false,
    // },
    // token: {
    //   type: String,
    //   required: false,
    //   max: 100,
    // },
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
    level: [
      {
        type: [String],
        required: false,
        max: 100,
        trim: true,
        enum: ["Pre-School", "Basic", "Secondary", "Post-Secondary", "All"],
      },
    ],
    monthly_rate: {
      type: String,
      required: false,
      trim: true,
      max: 300,
    },
    institution: {
      type: [String],
      required: false,
    },
    tutor_rating: {
      type: Number,
      required: false,
      max: 100,
    },
    role: {
      type: String,
      default: "tutor",
      enum: ["parent", "tutor", "student", "admin"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// tutorsSchema.pre("save", async function (next) {
//   var user = this;

// try {
//     if (user.isNew || user.isModified("password")) {
//       //if the user is new or modified hash algorithm runs if it is
//       const salt = await bcrypt.genSalt(saltIteration)
//       const hashedPassword = await bcrypt.hash(user.password, salt)
//       this.password = hashedPassword
//       next()
//     } else {
//       next();
//     }
// } catch (error) {
//   next(error)
// }
// });

// tutorsSchema.methods.comparePassword = async function(candidatePassword) {
//   try {
//     return await bcrypt.compare(candidatePassword, this.password)
//   } catch (error) {
//     console.log(error)
//   }
// };
// //methods are applied
// tutorsSchema.methods.generateToken = async function () {
//   var user = this;
//   var secretkey = process.env.SECRET_KEY;
//   const generatedToken = jwt.sign(
//     { id: user._id, email: user.email },
//     secretkey,
//     {expiresIn: '3h'}
//   );
//   // user.token = generatedToken;
//   // await user.save()
//   return generatedToken;
// };

// tutorsSchema.statics.findByToken = function (token, cb) {
//   var user = this;
//   console.log(user);
//   user
//     .findOne({ token })
//     .then((doc) => {
//       cb(null, doc);
//     })
//     .catch((err) => {
//       cb(err, null);
//     });
// };

// tutorsSchema.methods.updatePassword = function (password, cb) {
//   console.log(password);
//   var user = this;
//   bcrypt.genSalt(saltIteration, function (error, salt) {
//     if (error) {
//       throw error;
//     }
//     console.log(password);
//     bcrypt.hash(password, salt, function (err, hashedPassword) {
//       console.log(salt);
//       if (err) throw err;
//       user.password = hashedPassword;
//       console.log(hashedPassword);
//       cb(null, user);
//     });
//   });
// };

tutorsSchema.virtual("ratings", {
  ref: "Rating",
  localField: "_id",
  foreignField: "tutor",
  justOne: false,
});
tutorsSchema.plugin(aggregatePaginate);
const TutorModel = UserModel.discriminator("Tutor", tutorsSchema);
module.exports = TutorModel;
