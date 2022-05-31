/* eslint-disable no-console */
const { Router } = require('express');
const Note = require('../models/Note');
const authenticate = require('../middleware/authenticate');

module.exports = Router()

  .post('/', authenticate, async (req, res) => {
    try {
      const note = await Note.insert(req.body);
      res.send(note);
    } catch (error) {
      console.log(error);
    }
  });
