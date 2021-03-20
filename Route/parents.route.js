const express = require("express");
const router = express.Router();
var dbParents = require("../model/parent.model");

router.get("/", (req, res) => {
  res.send({
    message: "message sending",
  });
});

router.post("/signup", (req, res) => {
  dbParents
    .findOne({ email: req.body.email })
    .then((resp) => {
        console.log(resp)
      const users = new dbParents({ ...req.body });
      users
        .save()
        .then(() => {
          res.status(201).json({
            message: "Parent created",
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            message: "Parent creation failed",
            error: err,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "This email already exist",
        error,
      });
    });
});

module.exports = router;
