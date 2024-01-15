


function passwordChanged(name) {
    return `
          <div style="height: 100vh;">
              <div style="margin: auto; padding: 50px 0 0 0; text-align: center;">
                  <h1 style="text-align: center; font-size: 48px;">Welcome ${name}</h1>
                  <p style="font-size: 26px;">You have successfully changed your password.</p>
              </div>
          </div>
  `;
  }
  
  
  module.exports = passwordChanged