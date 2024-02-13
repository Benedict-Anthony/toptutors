const BaseController = require("../controllers/base");
const Bookings = require("../model/bookings.model");
const emailService = require("../utils/emailService");

const start_session_email = require("../email_templates/session_started");
const select =
  "status terminated start_session time_of_tuition level_being_applied_for";
const select_user = "email first_name last_name";
class UserDashboard extends BaseController {
  // ADMIN PRIVILEDGES
  async allContracts(req, res) {
    const role = req.user.role;
    if (role !== "admin") {
      UserDashboard.failedResponse(res, {
        message: "you're not allowed to access these resources",
      });
    }
    try {
      let result = await Bookings.find()
        .select(select)
        .populate({
          path: "tutor",
          select: select_user,
        })
        .populate({
          path: "booked_by",
          select: select_user,
        });
      result = {
        count: result.length,
        result,
      };

      UserDashboard.successResponse(res, {
        message: "admin identified",
        result,
      });
      return;
    } catch (error) {
      console.log(error);
      UserDashboard.failedResponse(res, {
        message: "error",
        error,
      });
    }
  }

  // PARENT BOOKINGS
  async parentContracts(req, res) {
    const user = req.user;
    try {
      const bookings = await Bookings.find({
        booked_by: user._id,
      })
        .select(select)
        .populate({
          path: "tutor",
          select: select_user,
        });
      const result = {
        count: bookings.length,
        bookings,
      };
      UserDashboard.successResponse(res, {
        message: "parent identified",
        result,
      });
      return;
    } catch (error) {
      console.log(error);
      UserDashboard.failedResponse(res, {
        message: "error",
        error,
      });
    }
  }

  // TUTORS BOOKINGS
  async tutorContracts(req, res) {
    const user = req.user;
    try {
      const bookings = await Bookings.find({ tutor: user._id })
        .select(select)
        .populate({
          path: "booked_by",
          select: select_user,
        });
      const result = {
        count: bookings.length,
        bookings,
      };
      UserDashboard.successResponse(res, {
        message: "tutor identified",
        result,
      });
      return;
    } catch (error) {
      console.log(error);
      UserDashboard.failedResponse(res, {
        message: "error",
        error,
      });
    }
  }

  // BOOKING DETAILS
  async contractsDetails(req, res) {
    const bookingId = req.params.id;
    const user = req.user;
    const role = user.role;

    if (!bookingId) {
      UserDashboard.failedResponse(res, {
        message: "Please provide a booking ID",
      });
    }

    const message =
      role === "parent"
        ? "parent identified"
        : role === "tutor"
        ? "Tutor identified"
        : "admin identify";

    const params =
      role === "parent"
        ? {
            booked_by: user._id,
            _id: bookingId,
          }
        : role === "tutor"
        ? {
            tutor: user._id,
            _id: bookingId,
          }
        : {};
    try {
      const result = await Bookings.findOne(params)
        .populate({
          path: "tutor",
          select:
            "email sex first_name last_name marital_status state_of_residence city",
        })
        .populate({
          path: "booked_by",
          select: select_user,
        });

      UserDashboard.successResponse(res, {
        message,
        result,
      });
    } catch (error) {
      UserDashboard.failedResponse(res, {
        message: "Error",
        error,
      });
    }
  }

  // GET ALL CONTRACTS
  async activeContracts(req, res) {
    const user = req.user;
    const role = user.role;
    const params =
      role === "parent"
        ? {
            booked_by: user._id,
            status: "Accepted",
            accepted: true,
          }
        : role === "tutor"
        ? {
            tutor: user._id,
            status: "Accepted",
            accepted: true,
          }
        : {
            status: "Accepted",
            accepted: true,
          };
    try {
      const bookings = await Bookings.find(params).select(select);
      const data = {
        count: bookings.length,
        results: bookings,
      };

      BaseController.successResponse(res, data);
    } catch (error) {
      BaseController.failedResponse(res, {
        message: "something went wrong...",
      });
    }
  }

  // TOGGLE CONTRACTS
  async activateContract(req, res) {
    const bookingId = req.params.id;
    try {
      const booking = await Bookings.findById({ _id: bookingId });
      if (!booking) {
        res.status(404).json({ message: "Detail, Not found" });
        return;
      }

      const currentStatus = booking.status;
      booking.accepted = !booking.accepted;
      currentStatus === "Accepted"
        ? (booking.status = "Rejected")
        : (booking.status = "Accepted");

      await booking.save();

      const { status, accepted } = booking;
      BaseController.successResponse(res, { status, accepted });
    } catch (error) {
      BaseController.failedResponse(res, error);
    }
  }

  // GET ACTIVE SESSIONS
  async activeSessions(req, res) {
    const user = req.user;
    const role = user.role;
    const params =
      role === "parent"
        ? {
            booked_by: user._id,
            start_session: true,
          }
        : role === "tutor"
        ? {
            tutor: user._id,
            start_session: true,
          }
        : {
            start_session: true,
          };
    try {
      const bookings = await Bookings.find(params)
        .select(
          "selected_subjects start_session level_being_applied_for tutor booked_by"
        )
        .populate({
          path: "booked_by",
          select: select_user,
        })
        .populate({
          path: "tutor",
          select: select_user,
        })
        .exec();

      const data = {
        count: bookings.length,
        results: bookings,
      };

      BaseController.successResponse(res, data);
    } catch (error) {
      console.log(error);
      BaseController.failedResponse(res, { message: "Something went wrong" });
    }
  }

  // START AND END SESSIONS
  async startSession(req, res) {
    const user = req.user;
    const role = user.role;
    const bookingId = req.params.id;
    const params =
      role === "parent"
        ? {
            _id: bookingId,
            booked_by: user._id,
          }
        : {
            tutor: user._id,
            _id: bookingId,
          };

    try {
      if (role === "parent") {
        BaseController.failedResponse(res, {
          message: "You're not allowed to start a session",
        });
        return;
      }
      const booking = await Bookings.findOne(params)
        .populate("booked_by")
        .populate("tutor");

      if (!booking) {
        res.status(404).json({ message: "Detail, Not found" });
        return;
      }

      booking.start_session = !booking.start_session;

      await booking.save();

      const { start_session, booked_by, tutor } = booking;

      let html = start_session_email("Iklass Section Ended");
      let subject = "Iklass Class seection Ended";
      if (start_session) {
        html = start_session_email("class started");
        subject = "Iklass Class seection Started";
      }
      const options = {
        from: "acehelp@Iklass Toptutors Limited",
        to: booked_by.email,
        subject,
        html,
      };

      emailService(options);
      console.log(booked_by.email, tutor.email);
      BaseController.successResponse(res, { start_session });
    } catch (error) {
      console.log(error);
      BaseController.failedResponse(res, error);
    }
  }

  // GET ATTENDANCE
  async getAttendance(req, res) {
    const bookingId = req.params.id;
    const role = req.user.role;
    const user = req.user;
    const params =
      role === "parent"
        ? {
            _id: bookingId,
            booked_by: user._id,
          }
        : {
            tutor: user._id,
            _id: bookingId,
          };

    try {
      const bookings = await Bookings.findOne(params).select(
        "session_per_month"
      );

      BaseController.successResponse(res, bookings);
    } catch (error) {
      BaseController.failedResponse(res, error);
    }
  }

  // GET EARNED PRICES
  async getEarnedPrice(req, res) {
    const bookingId = req.params.id;
    const role = req.user.role;
    const user = req.user;
    const params =
      role === "parent"
        ? {
            booked_by: user._id,
          }
        : {
            tutor: user._id,
          };
    try {
      let sum = 0;
      const prices = await Bookings.find(params).select("price");
      prices.forEach((price) => {
        sum += price.price;
      });
      BaseController.successResponse(res, { sum });
    } catch (error) {
      console.log(error);
      BaseController.failedResponse(res, error);
    }
  }
}

module.exports = UserDashboard;
