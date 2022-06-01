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
  })

  .get('/', async (req, res, next) => {
    try {
      const note = await Note.getAll();
      res.send(note);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const notes = await Note.getById(req.params.id)
      res.send(notes);
    } catch (error) {
      console.log(error);
    }
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedNote = await Note.updateById(id, req.body);

      if (!updatedNote) {
        const error = new Error(`Note ${id} not found`);
        error.status = 404;
        throw error;
      }
      res.send(updatedNote)
    } catch (error) {
      next(error);
    }
  })


