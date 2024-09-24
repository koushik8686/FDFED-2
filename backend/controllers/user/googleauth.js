const { google } = require('googleapis');
const axios = require('axios');
const usermodel = require('../../models/usermodel'); // Adjust the import path accordingly

const oauth2client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postsecret"
);

// Google login function
const googleLogin = async (req, res) => {
  try {
    const { tokens } = req.query;
    const userInfo = await getUserInfo(tokens.access_token);
    const { email, name } = userInfo;

    console.log(email, name);
    const userExists = await usermodel.findOne({ email: email });
    if (userExists) {
      return res.status(200).send({ message: "Email Already Exists" , userId: userExists._id });
    }
    const newUser = new usermodel({
      username: name,
      email: email,
      items: []
    });
    // await newUser.save();
    res.status(200).send({ message: "Account Created Successfully", userId: newUser._id });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).send("An error occurred during Google login.");
  }
};

const getUserInfo = async (accessToken) => {
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
  );
  return userRes.data;
};

module.exports = googleLogin ;
