const { Router } = require('express');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const UserService = require('../services/UserService');

module.exports = Router()

  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error)
    }
  })