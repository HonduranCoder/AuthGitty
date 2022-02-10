const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    //check the session cookie for the current user
    const cookie = req.cookies.session;
    //verify the JWT token & attach to each request.
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};
