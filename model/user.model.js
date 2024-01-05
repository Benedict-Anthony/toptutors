const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var saltIteration = 10;
var jwt = require('jsonwebtoken');


var studentSchema = new Schema({
    name:String,
    age:Number,
    grade:Number,
    _class:String,
})

var userSchema = new Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    phone_number:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true
    },
    photo:{
        type:String,
    },
    marital_status:{
        type:String,
        capitalize:true,
        enum:["Single","Married","Other"],
    },
    password:{
        type:String,
        required:true 
    },
    sex:{
        type:String,
        capitalize:true,
        enum:["Male","Female"],
    },
    country:{
        type:String,
        required:false,
        max:200
    },
    state_of_residence:{
        type:String,
        required:false,
        max:100
    },
    city:{
        type:String,
        required:false,
        max:100  
    },
    start_date:{
        type:Date,
        required:false,
        max:100
    },
    relationship:{
        type:String,
        required:false,
        max:100,
    },
    nationality: {
        type:String,
        required:false,
        max:150,
    },
    tutor:[{ref:'parent',type:Schema.Types.ObjectId}],
    ocupation:{
        type:String,
    },
    category:[studentSchema],
    role:{
        type:String,
        enum:["user"]
    },
    token:String,
},
{ timestamps: true }
)

    userSchema.pre('save',function(next,doc){
        var user = this;
        console.log(user.isNew)
        if(user.isNew || user.isModified('password')){  //if the user is new or modified hash algorithm runs if it is 
            bcrypt.genSalt((saltIteration),function(error,salt){
                if(error){
                    return console.log(error)
                }
                bcrypt.hash(user.password,salt,function(err,hashedPassword){
                    if (err) return next(err)
                    user.password = hashedPassword;
                    console.log( "schema new user password" + user.password )
                    next();
                })
            })
        }
        else{
            next()
        }
    })
    userSchema.methods.comparePassword = function(candidatePassword,cb){
        bcrypt.compare(candidatePassword.toString(),this.password,function(error,ismatch){
            if(error) throw error
            return cb(null,ismatch)
        })
    }
    //methods are applied 
    userSchema.methods.generateToken = function(cb){
        var user = this;
        var secretkey = 'specailsecretword';
        const generatedToken = jwt.sign({id:user._id,email:user.email},secretkey);
        user.token = generatedToken;
        user.save((err,userWithUpdatedToken)=>{
            if (err) return cb(err,null);
            cb(null,userWithUpdatedToken);
        })
    }
    userSchema.statics.findByToken = function(token,cb){
        var user = this;
        console.log(user)
        user.findOne({token})
        .then(doc=>{
            cb(null,doc)
        })
        .catch(err=>{
            cb(err,null)
        })
    }

const student = mongoose.model('student',studentSchema);
const Users = mongoose.model('Users',userSchema);
module.exports = Users;
