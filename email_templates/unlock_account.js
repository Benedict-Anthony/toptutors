


function unlockAccount(name) {
    return `
          <div style="height: 100vh;">
              <div style="margin: auto; padding: 50px 0 0 0; text-align: center;">
                  <h1 style="text-align: center; font-size: 48px;">Dear ${name},</h1>
                  <p style="font-size: 26px;">Your account has been unlocked. Sorry for the inconviniences.</p>
              </div>
          </div>
  `;
  }
  
  
  module.exports = unlockAccount