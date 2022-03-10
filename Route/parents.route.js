const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
var parents = require("../model/parent.model");
var dbTutors = require("../model/tutors.model");
var dbBooking = require("../model/bookings.model");

router.get("/search/tutors", checkAuth, (req, res) => {
  console.log(req.query.firstname);
  let aggregate;
  if (req.query.firstname) {
    aggregate = dbTutors.aggregate([
      { $match: { first_name: req.query.firstname } },
    ]);
  }
  if (req.query.city) {
    aggregate = dbTutors.aggregate([{ $match: { city: req.query.city } }]);
  }
  if (req.query.sex) {
    aggregate = dbTutors.aggregate([{ $match: { sex: req.query.sex } }]);
  }
  if (req.query.subject) {
    aggregate = dbTutors.aggregate([
      {
        $match: {
          subjects: {
            $in: [req.query.subject],
          },
        },
      },
    ]);
  }
  if (req.query.level) {
    aggregate = dbTutors.aggregate([
      {
        $match: {
          level: {
            $in: [req.query.level],
          },
        },
      },
    ]);
  }
  const options = {
  };
  console.log(aggregate);
  dbTutors
    .aggregatePaginate(aggregate, options)
    .then((doc) => {
      res.status(200).json({
        message: "Successful",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Failed",
        err,
      });
    });
});

router.get("/tutors", checkAuth, (req, res) => {
  console.log("Here");
  const options = {
    // page: req.query.page,
    // limit: req.query.limit,
    pagination: true,
  };
  const aggregate = dbTutors.aggregate();
  dbTutors
    .aggregatePaginate(aggregate, options)
    .then((doc) => {
      res.status(200).json({
        message: "Successful",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Failed",
        err,
      });
    });
});


//filter
router.get("/tutors/:keyword", checkAuth, (req, res) => {
  console.log(req.params.keyword);
  let options = {
    sort: { first_name: "Ekene" },
  };
  dbTutors
    .paginate(options)
    .then((doc) => {
      res.status(200).json({
        message: "Successful",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Failed",
        err,
      });
    });
});


router.post("/signup", (req, res) => {
  const { email } = req.body;
  parents
    .findOne({ email })
    .then((resp) => {
      res.status(400).json({
        message: "This email already exist",
        error,
        resp,
      });
    })
    .catch((error) => {
      console.log(error);
      const users = new parents({ ...req.body });
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
    });
});

router.post("/login", (req, res) => {
  let { email, password } = req.body;
  console.log(email);
  parents
    .findOne({ email })
    .then((doc) => {
      if (doc) {
        doc.comparePassword(password, function (err, isMatch) {
          if (err || !isMatch) {
            return res.status(400).json({
              message: "Auth failed password incorrect",
              err,
            });
          }
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
      console.log(error);
      res.json({
        message: "log in failed email is not registered",
        error,
      });
    });
});

router.put("/forgot-password", (req, res) => {
  const { email } = req.body;
  parents.findOne({ email }, (err, doc) => {
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
      console.log(token);
      if (token) {
        return doc.updateOne({ resetLink: token }, (err, success) => {
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
    parents
      .findOne({ _id: decoded._id })
      .then((doc) => {
        doc.updatePassword(password, (err, user) => {
          if (err) {
            console.log(err);
            res.json({
              err,
            });
          }
          if (user) {
            user
              .save()
              .then(() => {
                res.status(200).json({
                  message: "password successfully updated",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(422).json({
                  err,
                });
              });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json({
      message: "Password reset failed",
      error,
    });
  }
});

//bookings
router.post("/booking", checkAuth, (req, res) => {
  const { tutor } = req.body;
  dbBooking
    .findOne({ tutor })
    .then((data) => {
      console.log(data);
      const newBooking = new dbBooking({ ...req.body });
      newBooking
        .save()
        .then((data) => {
          res.status(200).json({
            data,
            message: "Successfully booked",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error,
            message: "Failed to save bookings",
          });
        });
      // res.status(400).json({
      //   message: "The current tutor has already been booked by this Parent",
      // });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/booking", (req, res) => {
  const _id = req.query.id;
  dbBooking
    .find()
    .populate({
      path: "booked_by",
      select: "first_name last_name phone_number email",
      match: {
        _id: _id,
      },
    })
    .then((data) => {
      let processed = data.filter((document) => {
        if (document.booked_by.length !== 0) {
          return document;
        }
      });
      console.log(processed);
      res.status(200).json({
        message: "Successfull",
        result: processed,
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
router.get("/details", checkAuth, (req, res) => {
  const token = req.headers.authorization;
  const Token = token.split(" ")[1]; //Separate bearer from the token
  parents
    .findOne({ token: Token })
    .then((user) => {
      console.log(user);
      res.send(200, {
        message: "Successfully retrieved user information",
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
module.exports = router;
