var express = require("express");
var router = express.Router();
var dbUsers = require("../model/user.model");
var bcrypt = require("bcryptjs");
var userAuth = require("../middleware/userauth");

var paginatedModel = require("../middleware/pagination_middleware");
const UserController = require("../controllers/userController");

const Users = [
  { name: "User 1", id: 1 },
  { name: "User 2", id: 2 },
  { name: "User 3", id: 3 },
  { name: "User 4", id: 4 },
  { name: "User 5", id: 5 },
  { name: "User 6", id: 6 },
  { name: "User 7", id: 7 },
  { name: "User 8", id: 8 },
  { name: "User 9", id: 9 },
  { name: "User 10", id: 10 },
  { name: "User 11", id: 11 },
  { name: "User 12", id: 12 },
  { name: "User 13", id: 13 },
  { name: "User 14", id: 14 },
  { name: "User 15", id: 15 },
  { name: "User 16", id: 16 },
  { name: "User 17", id: 17 },
  { name: "User 18", id: 18 },
  { name: "User 19", id: 19 },
  { name: "User 20", id: 20 },
];

router.get("/", paginatedModel(Users), (req, res) => {
  res.json(res.paginatedModel);
});

router.post("/register", async (req, res)=>{
  const userController = new UserController()
  return await userController.registerUser(req, res)
})

router.put('/verify/:id', async(req, res)=>{
  const userController = new UserController()
  return await userController.verifyUser(req, res)
})

router.put('/resend/verification/', async(req, res)=>{
  const userController = new UserController()
  return await userController.resendVerfication(req, res)
})

router.post('/login', async(req, res)=>{
  const userController = new UserController()
  return await userController.login(req, res)
})

router.post('/forgot-password', async(req, res)=>{
  const userController = new UserController()
  return await userController.forgotPassword(req, res)
})
router.put('/reset/:id', async(req, res)=>{
  const userController = new UserController()
  return await userController.resetPassword(req, res)
})

router.get('/dashboard/stat', [userAuth], async(req, res)=>{
  const userController = new UserController()
  return await userController.dashboardStat(req, res)
})

router.get('/get-user', [userAuth], async(req, res)=>{
  const userController = new UserController()
  return await userController.getUser(req, res)
})







//a route to update the user category schema
router.put("/add_category/:username", (req, res) => {
  let user_name = req.params.username;
  let doc = dbUsers
    .findOne({ name: user_name })
    .then(async (res1) => {
      const { name, age, grade, _class } = req.body;
      res1.category = [{ name, age, grade, _class }, ...res1.category];
      await res1
        .save()
        .then((res2) => {
          res.json({
            message: "Update successful",
            status: 200,
            doc: res2,
          });
        })
        .catch((err) => {
          res.json({
            message: "failed to update",
            reason: err,
          });
        });
    })

    .catch((err2) => {
      res.status(404).json({
        message: "failed to update, user not found",
        reason: err2,
      });
    });
  // console.log(doc)
});

router.put("/update_password/:id", (req, res) => {
  const id = req.params.id;
  dbUsers
    .find({ _id: id })
    .then((doc) => {
      console.log("found doc" + doc);
      doc.password = req.body.password;
      doc.save(err, (saveddoc) => {
        if (err) {
          res.json({
            message: "Error occured failed to save",
            error: err,
          });
        }
        res.json({
          message: "Password save was successful",
          doc: saveddoc,
        });
      });
      res.json({
        message: "document was updated",
        doc,
      });
    })
    .catch((error) => {
      res.json({
        message: "User not found",
        error,
      });
    });
});

//get all users
// router.get("/user", userAuth(), (req, res) => {
//   dbUsers
//     .find()
//     .then((response) => {
//       res.json(response);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json(err);
//     });
// });

// router.get("/profile", (req, res) => {
//   const token = req.headers.token;
//   token
//     ? dbUsers.findByToken(token, (err, user) => {
//         if (err) throw err;
//         res.json(200, {
//           user,
//         });
//       })
//     : res.send(400, {
//         message: "Authentication required",
//       });
// });

module.exports = router;
