const express = require("express");
const jwt = require("jsonwebtoken");
const tutorsAuth = require("../middleware/tutors-check-auth");
const router = express.Router();
var Tutors = require("../model/tutors.model");
const { Messagekey } = require("../config");
var api_key = Messagekey;
var domain = "sandbox05003ae3bfa540d28c2ae96b4b665132.mailgun.org";
const mailgun = require("mailgun-js")({ apiKey: api_key, domain });
var dbBooking = require("../model/bookings.model");


router.get("/", (req, res) => {
  res.send({
    message: "message sending",
  });
});

router.post("/signup", (req, res) => {
  const {email} = req.body
  Tutors.findOne({ email: req.body.email })
    .then((resp) => {
      console.log(resp);
      const users = new Tutors({ ...req.body });
      users
        .save()
        .then(() => {
          var data = {
            from: "toptutors@gmail.com",
            to: email,
            subject: "Welcome to Nigeria's Premiere Learning Platform",
            html: `<h6>This is Israel from toptutors</h6>
            `,
          };
          mailgun.messages().send(data, function (error, body) {
            if (error) {
              console.log(error);
              res.status(422).json({
                message: "Failed to process",
                error,
              });
            } else {
              res.json({
                body,
              });
            }
          });
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
  Tutors.findOneAndUpdate(
    { token: Token },
    { ...req.body },
    { returnNewDocument: true }
  )
    .then((found_user) => {
      res.status(200).json({
        message: "Tutor Updated",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(401).json({
        message: "Please sign in session expired",
        error,
      });
    });
});

router.get("/details", tutorsAuth, (req, res) => {
  const token = req.headers.authorization;
  const Token = token.split(" ")[1]; //Separate bearer from the token
  Tutors.findOne({ token: Token })
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
  var { email, password } = req.body;
  console.log(email);
  Tutors.findOne({ email })
    .then((doc) => {
      if (doc) {
        doc.comparePassword(password, function (err, isMatch) {
          if (err || !isMatch) {
            return  res.status(400).json({
              message: "Auth failed password incorrect",
              err
            });
          };
          if (isMatch) {
            doc.generateToken((error, user) => {
              if (error) return res.status(400).json(error);
              res.set("token", user.token);
              res.send(200, {
                message: "User loggedIn",
                id: user.id,
                token: user.token,
              });
            });
          } else {
            res.status(400).json({
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
      res.json({
        message: "log in failed email is not registered",
        error: error?.response,
      });
    });
});
router.put("/forgot-password", (req, res) => {
  const { email } = req.body;
  Tutors.findOne({ email }, (err, doc) => {
    if (err || !doc) {
      res.status(422).json({
        message: "Email is not registered",
        err,
      });
    }
    if (doc) {
      const token = jwt.sign(
        { _id: doc._id },
        process.env.password_reset_secret,
        { expiresIn: "24h" }
      );
      var data = {
        from: "toptutors@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `<h6>Please on the link to reset your password </h6>
        <p>${process.env.clientUrl}/resetpassword/${token}</p>
        `,
      };
      console.log(token)
      if (token) {
        return doc.updateOne({ reset_link: token }, (err, success) => {
          if (err) {
            res.status(422).json({
              message: "Failed to save new token",
              err,
            });
          }
          if (success) {
            mailgun.messages().send(data, function (error, body) {
              if (error) {
                console.log(error);
                res.status(422).json({
                  message: "Failed to process",
                  error,
                });
              } else {
                res.json({
                  body,
                });
              }
            });
          }
        });
      }
    }
  });
});
router.put("/reset-password", (req, res) => {
  const { password, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.password_reset_secret);
    Tutors.findOne({_id:decoded._id})
    .then((doc)=>{
      doc.updatePassword(password,(err,user)=>{
        if(err){
          console.log(err)
          res.json({
            err
          })
        }
        if(user){
          user.save()
          .then(()=>{
            res.status(200).json({
              message:"password successfully updated",
            })
          })
          .catch(err=>{
            console.log(err)
            res.status(422).json({
              err
            })
          })
        }
      })
    })
    .catch(err=>{
      console.log(err)
    })
  } catch(error) {
    res.json({
      message: "Password reset failed",
      error
    });
  }
});
router.get("/booking", (req, res) => {
  const _id = req.query.id;
  dbBooking
    .find()
    .populate({
      path: "tutor",
      select: "first_name last_name phone_number email",
      match: {
        _id: _id,
      },
    })
    .then((data) => {
     let processed = data.filter((document) => {
        console.log(document.tutor.length)
        if (document.tutor.length !== 0) {
          return document;
        }
      });
      console.log(processed)
      res.status(200).json({
        message: "Successfull",
        result:processed,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        err,
        message: "Failed to fetch bookings",
      });
    });
});

module.exports = router;
