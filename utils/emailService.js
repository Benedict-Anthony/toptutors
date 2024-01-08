const nodemailer = require("nodemailer");

function emailService(options) {
  try {
    const transporter = nodemailer.createTransport({
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
      },
      service: "gmail",
    });

    transporter.sendMail(options, (err, info) => {
      if (err) {
        throw err;
      }
      console.log(info.response)
    });
  } catch (error) {}
}

module.exports = emailService