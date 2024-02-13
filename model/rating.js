const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },

  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Parent",
    reqired: [true, "this field is required"],
  },

  tutor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Tutor",
    reqired: [true, "this field is required"],
  },
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
