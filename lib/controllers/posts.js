const { Router } = require('express');
const authentication = require('../middleware/authentication.js');
const Post = require('../models/Post.js');

module.exports = Router()
  .post('/', authentication, async (req, res, next) => {
    try {
      //need to go through authentication and grab userId, post
      const posts = await Post.insert({
        userId: req.user.id,
        post: req.body.post,
      });
      res.send(posts);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authentication, async (req, res, next) => {
    try {
      //similar to other getAll routes w/authentication
      const posts = await Post.getAll();
      res.send(posts);
    } catch (e) {
      next(e);
    }
  });
