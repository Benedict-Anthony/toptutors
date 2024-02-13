const express = require("express");
const userAuth = require("../middleware/userauth");
const parentAuth = require("../middleware/parentAuth");
const RatingController = require("../controllers/ratingController");

const ratingController = new RatingController();
const router = express.Router();

router
  .route("/:id")
  .get(userAuth, parentAuth, async (req, res) => {
    return await ratingController.getTutorRate(req, res);
  })
  .post(userAuth, parentAuth, async (req, res) => {
    return await ratingController.rateTutor(req, res);
  });

module.exports = router;
