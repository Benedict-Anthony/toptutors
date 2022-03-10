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
  level_being_applied_for: {
    type: String,
    required: false,
  },
  student_first_name: {
    type: String,
    required: false,
  },
  date_of_tuition: {
    type: String,
    required: false,
  },
  time_of_tuition: {
    type: String,
    required: false,
  },
  number_of_times: {
    type: String,
    required: false,
  },
  request_date: Date,
  acceptance_date: Date,
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Accepted", "Rejected"],
  },
  required: false,
});

bookingShema.plugin(aggregatePaginate);
var Booking = mongoose.model("booking", bookingShema);
module.exports = Booking;
