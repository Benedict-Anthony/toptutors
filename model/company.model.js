const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    bussinessName:{
        type: String
    },
    numberOfStaffs:{
        type: Number
    },
    email:{
        type: String
    },
    totalNumberOfClients:{
        type: Number
    },
    totalNumberOfAdmins:{
        type: Number
    },
    clients:[{ref:'user',type:Schema.Types.ObjectId}],
    admin:[{ref:'admin',type:Schema.Types.ObjectId}]
},
{ timestamps: true }
)

const CompanyModel = mongoose.model('Company',companySchema);
module.exports = CompanyModel;