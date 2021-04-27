const express = require("express");
const tutorsAuth = require("../middleware/tutors-check-auth");
const router = express.Router();
var Tutors = require("../model/tutors.model");

router.get("/", (req, res) => {
  res.send({
    message: "message sending",
  });
});

router.post("/signup", (req, res) => {
  Tutors.findOne({ email: req.body.email })
    .then((resp) => {
      console.log(resp);
      const users = new Tutors({ ...req.body });
      users
        .save()
        .then(() => {
          res.status(201).json({
            message: "Tutor created",
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            message: "Tutor creation failed",
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

//Profile Update
router.put("/update", tutorsAuth, (req, res) => {
  const token = req.headers.authorization;
  const Token = token.split(" ")[1]; //Separate bearer from the token
  Tutors
    .findOneAndUpdate({ token: Token },{...req.body},{returnNewDocument: true})
    .then((found_user) => {
          res.status(200).json({
            message: "Tutor Updated",
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

router.get("/details", tutorsAuth, (req, res) => {
  const token = req.headers.authorization;
  const Token = token.split(" ")[1]; //Separate bearer from the token
  Tutors
    .findOne({ token: Token })
    .then((user) => {
      console.log(user);
      res.send(200, {
        message: "Successfully retrieved tutors information",
        id: user.id,
        user: user,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "This token does not exist",
        error,
      });
    });
});

router.post("/login", (req, res) => {
  console.log(req);
  var { email, password } = req.body;
  console.log(email);
  Tutors.findOne({ email })
    .then((doc) => {
      if (doc) {
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
                token: user.token,
              });
            });
          } else {
            res.send(400, {
              message: "Auth failed password incorrect",
            });
          }
        });
      } else {
        res.status(404).json({
          doc,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        message: "log in failed email is not registered",
        error: error.response,
      });
    });
});

module.exports = router;
