const BookingModel = require("../model/bookings.model");
const validateData = require("../utils/validateData");
const BaseController = require("./base");

class BookingController extends BaseController {
  async createBooking(req, res) {
    try {
      const postData = req.body;
      const {
        tutor,
        selected_subject,
        booked_by,
        level_being_applied_for,
        days_of_tuition,
        duration_in_week,
        time_of_tuition,
      } = postData;

      const postRule = {
        tutor: "required|string",
        selected_subjects: "required|array",
        booked_by: "required|string",
        level_being_applied_for: "required|string",
        days_of_tuition: "required|array",
        duration_in_week: "required|string",
        time_of_tuition: "required|string",
      };
      const postCustomMessage = {
        required: ":attribute is required",
        string: ":attribute must be a string",
        array: ":attribute must be an array",
      };

      const validationResponse = await validateData(
        postData,
        postRule,
        postCustomMessage
      );

      const levels = ["jss1", "jss2", "jss3", "sss1", "sss2", "sss3"];
      if (!levels.includes(level_being_applied_for)) {
        return BookingController.failedResponse(
          res,
          "Please enter a valid level"
        );
      }
      if (!validationResponse.success) {
        return BookingController.failedResponse(res, validationResponse.error);
      }

      const bookingExists = await BookingModel.findOne({tutor})

      if(bookingExists){
        return BookingController.failedResponse(res,'Session has already been created')
      }

      await BookingModel.create({
        tutor,
        selected_subject,
        booked_by,
        level_being_applied_for,
        days_of_tuition,
        duration_in_week,
        time_of_tuition,
        ...req.body,
      });
      return BookingController.successResponse(res, "Session booked");
    } catch (error) {
      return BookingController.failedServerResponse(res, this.error_message);
    }
  }
}

module.exports = BookingController;
