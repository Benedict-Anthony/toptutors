const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  auth_secretkey: process.env.auth_secretkey,
  port: process.env.PORT,
  Messagekey:process.env.Messagekey,
  password_reset_secret:process.env.password_reset_secret,
  clientUrl :process.env.clientUrl,
  hostAddress :process.env.hostAddress,
};