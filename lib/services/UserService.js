const User = require('../models/User.js');
const { exchangeCode, getProfile } = require('../utils/user');

module.exports = class UserService {
  static async create(code) {
    //code from query params in url
    //exchange code for access token
    //access token is what we will use to make API requests to (githubs) resource server.
    const token = await exchangeCode(code);
    const { login, email } = await getProfile(token);
    //^destructure to create a user

    let user = await User.findByUsername(login);
    //if no user, add user
    if (!user) {
      user = await User.insert({
        //username we got from login
        username: login,
        email: email,
      });
    }
    return user;
  }
};
