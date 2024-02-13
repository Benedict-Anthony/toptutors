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
const dashboardRoutes = require("./routes/dashboard.routes");
const ratingRoutes = require("./routes/ratings.routes");

const morgan = require("morgan");
var colors = require("colors");

// var config = require("./config");
var cors = require("cors");
var dotenv = require("dotenv");
const serverless = require("serverless-http");
const UtilityService = require("./services/UtilityService");
dotenv.config();

// use morgan for logs
if (process.env.MODE === "DEVELOPMENT") {
  app.use(morgan("dev"));
}
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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/rating", ratingRoutes);

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
  db.once("open", () => console.log(colors.blue("db is initailized")));
  db.on("err", () => console.log(err));
} catch (error) {
  console.log(error);
}

const port = process.env.PORT || 3000;
//replicated for netlify
// app.use('/.netlify/functions/api', tutorRoute);
const server = app.listen(port, () => {
  console.log(colors.green("server is running on port " + port));
});

// process.on("unhandledRejection", (reason, p) => {
//   console.error(
//     colors.red.bold("Unhandled Rejection at:", p, "reason:", reason)
//   );
//   server.close(() => {
//     return process.exit(1);
//   });
// });

// process.on("uncaughtException", (error) => {
//   console.error(
//     `Caught exception: ${error}\n` + `Exception origin: ${error.stack}`
//   );
//   server.close(() => {
//     return process.exit(1);
//   });
// });
module.exports.handler = serverless(app);
