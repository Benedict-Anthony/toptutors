const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  auth_secretkey: process.env.auth_secretkey,
  port: process.env.PORT
};