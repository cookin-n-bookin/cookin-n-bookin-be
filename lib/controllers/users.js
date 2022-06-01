const { Router } = require('express');
const UserService = require('../services/UserService');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IS_DEPLOYED = process.env.NODE_ENV === 'production';

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const { token, user } = await UserService.create({ username, password });

      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
          secure: IS_DEPLOYED,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
        })
        .json({ user, message: 'Signed up successfully!' });
    } catch (error) {
      next(error);
    }
  })

  .post('/signin', async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const { token, user } = await UserService.signIn({ username, password });

      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
          secure: IS_DEPLOYED,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
        })
        .json({ user, message: 'Signed in successfully!' });
    } catch (error) {
      next(error);
    }
  })

  .get('/me', authenticate, (req, res) => {
    res.send(req.user);
  })

  .get('/:id', authenticate, async (req, res) => {
    const user = await User.getById(req.params.id);
    const books = await user.getBooks();
    res.send({ ...user, books });
  })

  .delete('/sessions', async (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ message: 'Successfully signed out' });
  });
