const BaseController = require("../controllers/base");
const parentAuth = (req, res, next) => {
  try {
    const role = req.user.role || "";

    if (role != "parent") {
      return BaseController.failedResponse(
        res,
        "You must be a parent to have access to this resource"
      );
    }
    next();
  } catch (error) {
    next();
    // return BaseController.failedServerResponse(res,'Something went wrong! Please try again later.');
  }
};

module.exports = parentAuth;
