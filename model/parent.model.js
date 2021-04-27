const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var saltIteration = 10;
var jwt = require('jsonwebtoken');
const mongoosePaginate = require('mongoose-paginate-v2');


const parentSchema = new Schema({
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

parentSchema.pre('save',function(next,doc){
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

parentSchema.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword.toString(),this.password,function(error,ismatch){
        if(error) throw error
        return cb(null,ismatch)
    })
}
//methods are applied 
parentSchema.methods.generateToken = function(cb){
    var user = this;
    var secretkey = process.env.auth_secretkey;
    const generatedToken = jwt.sign({id:user._id,email:user.email,type:"parent"},secretkey);
    user.token = generatedToken;
    user.save((err,userWithUpdatedToken)=>{
        if (err) return cb(err,null);
        cb(null,userWithUpdatedToken);
    })
}
parentSchema.statics.findByToken = function(token,cb){
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
const options = {
    page: 1,
    limit: 10,
    collation: {
      locale: 'en',
    },
  };
parentSchema.plugin(mongoosePaginate)
const parent = mongoose.model('parent',parentSchema);
module.exports = parent;