const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const UserModel = require("./user.model");

var studentSchema = new Schema(
  {
    // first_name:{
    //     type:String,
    //     required:true,
    //     max:100
    // },
    // last_name:{
    //     type:String,
    //     required:true,
    //     max:100
    // },
    // email:{
    //     type:String,
    //     required:true,
    //     unique:true,
    //     max:100
    // },
    // gender:{
    //     type:String,
    //     required:false,
    //     max:100,
    //     enum:["Male","Female"]
    // },
    // phone_numeber:{
    //     type:String,
    //     required:false,
    //     max:100
    // },
    // state_of_residence:{
    //     type:String,
    //     required:false,
    //     max:100
    // },
    // start_date:{
    //     type:Date,
    //     required:false,
    //     max:100
    // },
    // relationship:{
    //     type:String,
    //     required:false,
    //     max:100,
    //     enum:["learner","student"]
    // },
    // password:{
    //     type:String,
    //     required:true,
    //     max:100
    // },
    tutor: [{ ref: "parent", type: Schema.Types.ObjectId }],
    role: {
      type: String,
      default: "student",
      enum: ["parent", "tutor", "student", "admin"],
    },
  },
  { timestamps: true }
);

const StudentModel = UserModel.discriminator("Student", studentSchema);
module.exports = StudentModel;
