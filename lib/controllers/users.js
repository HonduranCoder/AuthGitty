const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication.js');
const UserService = require('../services/UserService.js');

module.exports = Router()
  //login route for github user
  //kickoff github oauth flow
  .get('/login', async (req, res) => {
    //CLIENT_ID: id that you get when you register your app
    //..you will also receive a CLIENT_SECRET
    //redirect: the oauth authorization will happen, you will be redirected to specified URI
    //...you will provide the scopes. (Different types of permissions)
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user`
    );
    //^ will immediately redirect them to what you put here.
  })
  //callback route
  .get('/login/callback', async (req, res) => {
    //get the code query from exchange code function (exchanges code for access token)
    const user = await UserService.create(req.query.code);
    //get info from github about user with token
    const userJWT = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    //set cookie and redirect
    res
      .cookie('session', userJWT, {
        //you only want cookies on the server so they can't be modified.
        httpOnly: true,
        //set in ms
        maxAge: 1000 * 60 * 60 * 24,
      })
      .redirect('/api/v1/users/dashboard');
  })
  .get('/dashboard', authentication, async (req, res) => {
    //require req.user
    //get data about user and send it as json
    res.json(req.user);
  })
  //delete sessions, deletes cookies and functions as logout.
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
