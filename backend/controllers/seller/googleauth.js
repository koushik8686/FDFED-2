const { google } = require('googleapis');
const axios = require('axios');

// Define the OAuth2 client directly in this file
const oauth2client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postsecret"
);
// Google login function
const googlelogin = async (req, res) => {
  try {
    // Extract the authorization code from the request
    const { tokens } = req.query;
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );
    const { email, name } = userRes.data;
    console.log(userRes.data);
    res.send(`User info: ${name}, ${email}`);
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error during Google login:', error);
    res.status(500).send("An error occurred during Google login.");
  }
};

module.exports = googlelogin;
