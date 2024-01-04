const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referredUsers = new mongoose.Schema({
  name: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  referredBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "admin",
    },
  ],
},
{ timestamps: true }
);

const admin_referred = mongoose.model("Reffered", referredUsers);

module.exports = admin_referred;
