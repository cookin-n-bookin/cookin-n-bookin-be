const { Router } = require('express');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const UserService = require('../services/UserService');
const authenticate = require('../middleware/authentication');

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  .post('/signin', async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const token = await UserService.signIn({ username, password });

      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!' });
    } catch (error) {
      next(error);
    }
  })

  .get('/me', authenticate, (req, res) => {
    res.send(req.user);
  })


  .delete('/sessions', async (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ message: 'Successfully signed out' });
  });

