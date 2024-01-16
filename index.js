var express = require("express");
var app = express();
var userRoutes = require("./routes/users.route");
const mongoose = require("mongoose");
var adminRoutes = require("./routes/admin.route");
var companyRoutes = require("./routes/company.route");
var parentRoute = require("./routes/parents.route");
var tutorRoute = require("./routes/tutors.route");
var userRoutes = require("./routes/users.route");
var bookingRoutes = require("./routes/booking.route");
var seedRoutes = require("./routes/seed.route");
// var config = require("./config");
var cors = require("cors");
var dotenv = require("dotenv");
const serverless = require("serverless-http");
const UtilityService = require("./services/UtilityService");
dotenv.config();

app.use(cors());
app.use(
  express.json({
    inflate: true,
    limit: "100kb",
    reviver: null,
    type: "application/json",
    verify: undefined,
  })
);

app.use(express.urlencoded({ extended: false }));
//app middleware sec
// app.use('/users',userRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Top Tutors...");
});
app.use("/api/admins", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/parent", parentRoute);
app.use("/api/tutors", tutorRoute);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/seed", seedRoutes);



//connect to mongodb
// mongoose.Promise = global.Promise;
try {
  mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
    useCreateIndex: true,
  });
  // mongoose.set("useFindAndModify", false);
  let db = mongoose.connection;
  db.once("open", () => console.log("db is initailized"));
  db.on("err", () => console.log(err));
} catch (error) {
  console.log(error);
}



const port = process.env.PORT || 3000;
//replicated for netlify
// app.use('/.netlify/functions/api', tutorRoute);
app.listen(port, () => {
  console.log("server is running on port" + port);
});

module.exports.handler = serverless(app);
