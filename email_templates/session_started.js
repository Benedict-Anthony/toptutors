const moment = require("moment");

const start_session_email = (text) => {
  return `
    <!DOCTYPE html>
<html lang="en">

<body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

  <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #3498db; color: #fff; padding: 10px; text-align: center;">
      <h2>Iklass Session Started</h2>
    </div>

    <div style="padding: 20px; color: #333; text-align:center; font-size:20px">
      <p>${text} at ${moment(new Date()).format("MMMM Do YYYY, h:mm:ss a")}</p> 
      

    </div>

    <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
      <p>Thank you for choosing Iklass Tutorial! </p>
    </div>
  </div>

</body>

</html>

    `;
};

module.exports = start_session_email;
