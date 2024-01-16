const express = require("express");
const userAuth = require("../middleware/userauth");
const parentAuth = require("../middleware/parentAuth");
const BookingController = require("../controllers/bookingController");
const router = express.Router();


router.post('/', [userAuth, parentAuth], async (req, res)=>{
    const bookingController = new BookingController()
    return await bookingController.createBooking(req, res)
})

module.exports = router;
