const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reffered = require('./admin_reffered');


const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['super_admin','admin']
    },
    token:{
        type: String
    }
},
{ timestamps: true }
)

const AdminModel = mongoose.model('Admin',adminSchema);

module.exports = AdminModel;