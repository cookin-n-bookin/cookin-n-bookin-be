/* eslint-disable no-console */

const { Router } = require('express');
const Book = require('../models/Book');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res,) => {

    try {
      const book = await Book.insert(req.body);
      await book.addBookUser(req.user.id);
      res.send(book);

    } catch (error) {
      console.log(error);
    }
  })

  .get('/', async (req, res) => {
    const book = await Book.getAll();
    res.send(book);
  })

  .get('/:id', async (req, res) => {
    const book = await Book.getById(req.params.id);
    const users = await book.getUsers();
    res.send({ ...book, users });
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedBook = await Book.updateById(id, req.body);

      if (!updatedBook) {
        const error = new Error(`Book ${id} not found`);
        error.status = 404;
        throw error;
      }
      res.send(updatedBook);
    } catch (error) {
      next(error);
    }
  });
