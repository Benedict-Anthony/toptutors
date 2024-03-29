const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var saltIteration = 10;
var jwt = require("jsonwebtoken");
const mongoosePaginate = require("mongoose-paginate-v2");
const UserModel = require("./user.model");

const parentSchema = new Schema(
  {
    // first_name: {
    //   type: String,
    //   required: true,
    //   max: 100,
    // },
    // last_name: {
    //   type: String,
    //   required: true,
    //   max: 100,
    // },
    // address: {
    //   type: String,
    //   required: false,
    //   max: 300,
    // },
    // email: {
    //   type: String,
    //   required: true,
    //   trim:true,
    //   unique: true,
    //   max: 300,
    // },
    // phone_number: {
    //   type: String,
    //   required: false,
    //   max: 100,
    // },
    // country: {
    //   type: String,
    //   required: false,
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
    //   max: 100,
    // },
    // start_date: {
    //   type: Date,
    //   required: false,
    //   max: 100,
    // },
    // relationship: {
    //   type: String,
    //   required: false,
    //   max: 100,
    // },
    // sex: {
    //   type: String,
    //   required: false,
    //   max: 100,
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
    //   max: 300,
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
    // is_verified: {
    //   type: Boolean,
    //   default: false,
    // },
    booking: [{ type: Schema.ObjectId, ref: "booking" }],
    role: {
      type: String,
      default: "parent",
      enum: ["parent", "tutor", "student", "admin"],
    },
  },
  { timestamps: true }
);

// parentSchema.pre("save", async function (next) {
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

// parentSchema.methods.comparePassword = async function(candidatePassword) {
//   try {
//     return await bcrypt.compare(candidatePassword, this.password)
//   } catch (error) {
//     console.log(error)
//   }
// };
// //methods are applied
// parentSchema.methods.generateToken = async function () {
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

// parentSchema.statics.findByToken = function (token, cb) {
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
// parentSchema.methods.updatePassword = function (password, cb) {
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

parentSchema.plugin(mongoosePaginate);
const ParentModel = UserModel.discriminator("Parent", parentSchema);
module.exports = ParentModel;
