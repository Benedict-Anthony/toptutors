


function welcomeMail(name, link, code) {
  return `
        <div style="height: 100vh;">
            <div style="margin: auto; padding: 50px 0 0 0; text-align: center;">
                <h1 style="text-align: center; font-size: 48px;">Welcome ${name}</h1>
                <p style="font-size: 26px;">Welcome to Top tutors. We are glad you are here</p>
                <p style="font-size: 26px;">Enter this ${code}. Expires in 1 hour.</p>
                <a style="font-size: 26px; cursor: pointer;" href='${link}'>Verify now.</a>
                <p style="font-size: 26px;">Visit this link to verify ${link}</p>
            </div>
        </div>
`;
}


module.exports = welcomeMail