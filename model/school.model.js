const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    name:{
        type: String
    },
    address:{
        type: String
    },
    teachers:[{ref:'Users',type:Schema.Types.ObjectId}],
    student:[{ref:'student',type:Schema.Types.ObjectId}]
},
{ timestamps: true }
)

const SchoolModel = mongoose.model('School',schoolSchema);
module.exports = SchoolModel;