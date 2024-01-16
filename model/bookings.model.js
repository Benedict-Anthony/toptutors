const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const UtilityService = require("../services/UtilityService");

const bookingShema = new Schema(
  {
    tutor: {
      type: Schema.ObjectId,
      ref: "Tutor",
      required: true,
      unique: true,
    },
    selected_subjects: { type: [String], required: true },
    accepted: {
      type: Boolean,
      default: false,
    },
    booked_by: { type: Schema.ObjectId, ref: "Parent", required: true },
    price: {
      type: Number,
      default: 0,
    },
    level_being_applied_for: {
      type: String,
      required: true,
      enum: ["jss1", "jss2", "jss3", "sss1", "sss2", "sss3"],
    },
    student_first_name: {
      type: String,
      required: false,
    },
    days_of_tuition: {
      type: [String],
      required: true,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    duration_in_week: {
      type: String,
      required: true,
    },
    time_of_tuition: {
      type: String,
      required: true,
    },
    request_date: {
      type: Date,
      default: Date.now,
    },
    acceptance_date: {
      type: Date,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
    schedule_plan: [
      {
        status: false,
        day: String,
      },
    ],
    start_session: {
      type: Boolean,
      default: false,
    },
    terminated: {
      type: Boolean,
      default: false,
    },
    session_per_month: [
      {
        status: false,
        attended: Number,
        tutor_rating: Number,
        parent_rating: Number
      },
    ],
  },
  { timestamps: true }
);

bookingShema.pre("save", function (next) {
  const booking = this;
  const numOfWeeks = +booking.duration_in_week;
  let targetWeekdays = booking.days_of_tuition;
  targetWeekdays = UtilityService.convertWeekDayToCode(targetWeekdays);
  const getNextOccurrencesForWeeks = UtilityService.getNextOccurrencesForWeeks(
    targetWeekdays,
    numOfWeeks
  );
  const newArr = getNextOccurrencesForWeeks.map(function (item) {
    return {
      status: false,
      day: item,
    };
  });

  booking.schedule_plan = newArr;

  // check duration in weeks and create sessions up front.
  const noOfMonths = Math.ceil(this.duration_in_week / 4);
  let monthArr = Array(noOfMonths).fill(null);
  const monthResult = monthArr.map((val, idx) => {
    return { attended: idx + 1, status: false, tutor_rating: 0, parent_rating: 0 };
  });
  booking.session_per_month = monthResult

  next()
});

bookingShema.plugin(aggregatePaginate);
var BookingModel = mongoose.model("Booking", bookingShema);
module.exports = BookingModel;
