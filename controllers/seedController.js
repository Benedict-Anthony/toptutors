const { parent_list, tutor_list } = require("../data");
const ParentModel = require("../model/parent.model");
const TutorModel = require("../model/tutors.model");
const BaseController = require("./base");

class SeedController extends BaseController {
  async seedParent(req, res) {
    try {
      await ParentModel.insertMany(parent_list);
      return SeedController.successResponse(res,'Parents created successfully');
    } catch (error) {
      return SeedController.failedServerResponse(res, this.error_message);
    }
  }
  async seedTutor(req, res) {
    try {
      await TutorModel.insertMany(tutor_list);
      return SeedController.successResponse(res,'Tutors created successfully');
    } catch (error) {
        console.log(error,'the er')
      return SeedController.failedServerResponse(res, this.error_message);
    }
  }
}

module.exports = SeedController;
