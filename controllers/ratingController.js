const Rating = require("../model/rating");
const BaseController = require("./base");

class RatingController extends BaseController {
  async getTutorRate(req, res) {
    const tutorId = req.params.id;
    try {
      const user = req.user;
      let ratings = await Rating.find({ tutor: tutorId });

      ratings =
        ratings
          .map((rating) => rating.rating)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue
          ) / ratings.length;
      BaseController.successResponse(res, ratings);
    } catch (error) {
      BaseController.failedResponse(res, { error });
    }
  }

  async rateTutor(req, res) {
    const user = req.user;
    const tutorId = req.params.id;

    try {
      const currentRating = await Rating.findOne({ parent: user._id });

      if (currentRating) {
        currentRating.rating = req.body.rating || currentRating.rating;
        await currentRating.save();
        BaseController.successResponse(res, currentRating);
        return;
      }
      const rating = await Rating.create({
        ...req.body,
        parent: user._id,
        tutor: tutorId,
      });

      BaseController.successResponse(res, rating);
    } catch (error) {
      BaseController.failedResponse(res, { error });
    }
  }
}

module.exports = RatingController;
