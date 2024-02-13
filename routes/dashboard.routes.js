const express = require("express");
const UserDashboard = require("../controllers/dashboardController");
const userAuth = require("../middleware/userauth");
const router = express.Router();

router.get("/contracts", userAuth, async (req, res) => {
  const dashboard = new UserDashboard();
  const role = req.user.role;
  if (role === "parent") {
    return await dashboard.parentContracts(req, res);
  } else if (role === "tutor") {
    return await dashboard.tutorContracts(req, res);
  }
  return dashboard.allContracts(req, res);
});

router.get("/contracts/active", userAuth, async (req, res) => {
  const dashboard = new UserDashboard();
  return await dashboard.activeContracts(req, res);
});

router.get("/contracts/active/sessions", userAuth, async (req, res) => {
  const dashboard = new UserDashboard();
  return await dashboard.activeSessions(req, res);
});

router.post("/contracts/active/sessions/:id", userAuth, async (req, res) => {
  const dashboard = new UserDashboard();
  return await dashboard.startSession(req, res);
});

router.post("/contracts/active/:id", userAuth, async (req, res) => {
  const dashboard = new UserDashboard();
  return await dashboard.activateContract(req, res);
});

router.route("/contracts/details/:id").get(userAuth, async (req, res) => {
  const dashboard = new UserDashboard();
  return await dashboard.contractsDetails(req, res);
});

router
  .route("/contracts/details/:id/attendance")
  .get(userAuth, async (req, res) => {
    const dashboard = new UserDashboard();
    return await dashboard.getAttendance(req, res);
  });

router.route("/contracts/price").get(userAuth, async (req, res) => {
  const dashboard = new UserDashboard();
  return await dashboard.getEarnedPrice(req, res);
});

module.exports = router;
