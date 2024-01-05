const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminRefferedSchema = new mongoose.Schema({
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

const AdminRefferedModel = mongoose.model("Reffered", adminRefferedSchema);

module.exports = AdminRefferedModel;
