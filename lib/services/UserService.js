const User = require('../models/User.js');
const { exchangeCode, getProfile } = require('../utils/user');

module.exports = class UserService {
  static async create(code) {
    //exchange code for access token
    const token = await exchangeCode(code);
    const { login, email } = await getProfile(token);

    let user = await User.findByUsername(login);
    //if no user, add user
    if (!user) {
      user = await User.insert({
        username: login,
        email: email,
      });
    }
    return user;
  }
};
