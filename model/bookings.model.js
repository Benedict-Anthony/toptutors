const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const bookingShema = new Schema({
  tutor: [{ type: Schema.ObjectId, ref: "dbTutor" }],
  selected_subject: [String],
  accepted: {
    type: Boolean,
    default: false,
  },
  booked_by: [{ type: Schema.ObjectId, ref: "parent" }],
  price: {
    type: Number,
    default: 0,
  },
  request_date: Date,
  acceptance_date: Date,
  required: false,
});

bookingShema.plugin(aggregatePaginate);
var Booking = mongoose.model("booking", bookingShema)
module.exports = Booking;

