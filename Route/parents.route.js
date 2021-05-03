const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
var dbParents = require("../model/parent.model");
var dbTutors = require("../model/tutors.model");

router.get("/", (req, res) => {
  res.send({
    message: "message sending",
  });
});

router.get("/search/tutors", checkAuth, (req, res) => {
  console.log(req.query.firstname);
  let aggregate
  if (req.query.firstname) {
     aggregate = dbTutors.aggregate([
      { $match: { first_name: req.query.firstname } },
    ]);
  }
  if (req.query.city) {
    console.log(req.query.city);
     aggregate = dbTutors.aggregate([{ $match: { city: req.query.city } }]);
  }
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    nextpageurl: "",
    prevpageurl: "",
    _id: 1,
    pagination: true,
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
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    // sort: {
    //   first_name: req.query.sort,
    // },
    nextpageurl: "",
    prevpageurl: "",
    _id: 1,
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
  dbParents
    .findOne({ email: req.body.email })
    .then((resp) => {
      console.log(resp);
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

router.get("/:token", (req, res) => {
  console.log(req.params.token);
  dbParents
    .findOne({ token: req.params.token })
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
              token: user.token,
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
        message: "log in failed email is not registered",
        error,
      });
    });
});

router.put("/forgot-password", (req, res) => {
  const { email } = req.body;
  dbParents.findOne({ email }, (err, doc) => {
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
    dbParents.findOne({_id:decoded._id})
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
module.exports = router;
