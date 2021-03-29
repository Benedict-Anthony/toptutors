const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var saltIteration = 10;
var jwt = require('jsonwebtoken');


const tutorsSchema = new Schema({
    first_name:{
        type:String,
        required:true,
        max:100
    },
    last_name:{
        type:String,
        required:true,
        max:100
    },
    address:{
        type:String,
        required:false,
        max:300 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:100
    },
    phone_number:{
        type:String,
        required:false,
        max:100
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
    sex:{
        type:String,
        required:false,
        max:100,
        enum:["Female","Male"]
    },
    nationality: {
        type:String,
        required:false,
        max:150,
    },
    career_summary:{
        type:String,
        required:false,
        max:300
    },
    subjects:{
        type:String,
        required:false,
        max:300
    },
    monthly_rate:{
        type:String,
        required:false,
        max:300
    },
    password:{
        type:String,
        required:true,
        max:300
    },
    token:{
        type:String,
        required:false,
        max:100
    }
})

tutorsSchema.pre('save',function(next,doc){
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

tutorsSchema.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword.toString(),this.password,function(error,ismatch){
        if(error) throw error
        return cb(null,ismatch)
    })
}
//methods are applied 
tutorsSchema.methods.generateToken = function(cb){
    var user = this;
    var secretkey = 'specailsecretword';
    const generatedToken = jwt.sign(user._id.toString(16),secretkey);
    user.token = generatedToken;
    user.save((err,userWithUpdatedToken)=>{
        if (err) return cb(err,null);
        cb(null,userWithUpdatedToken);
    })
}
tutorsSchema.statics.findByToken = function(token,cb){
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
const parent = mongoose.model('tutors',tutorsSchema);
module.exports = parent;