const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication.js');
const UserService = require('../services/UserService.js');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user`
    );
  })
  .get('/login/callback', async (req, res) => {
    const user = await UserService.create(req.query.code);
    const userJWT = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res
      .cookie('session', userJWT, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .redirect('/api/v1/users/dashboard');
  })
  .get('./dashboard', authentication, async (req, res) => {
    res.json(req.user);
  });
//add the delete
