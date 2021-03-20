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

router.post("/login", (req, res) => {
    var { email, password } = req.body;
    dbParents
      .findOne({ email })
      .then((doc) => {
        doc.comparePassword(password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            doc.generateToken((error, user) => {
              console.log(error);
              if (error) return res.send(400, error);
              res.set("token", user.token);
              res.send(200, {
                message: "User loggedIn",
                id: user.id,
              });
            });
          } else {
            res.send(400, {
              message: "Auth failed password incorrect",
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          message: "logged in failed user not found",
          error,
        });
      });
  });

module.exports = router;
