const mongoose = require('mongoose')
var Schema = mongoose.Schema;


var lockedAccountSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, required: true},
    attempt_time: {
        type: Date,
        default: Date.now()
    },
    activate_time: {
        type: Date
    },
},
{ timestamps: true }
)

const LockedAccountModel = mongoose.model('LockedAccount',lockedAccountSchema);
module.exports = LockedAccountModel