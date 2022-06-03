/* eslint-disable no-console */

const { Router } = require('express');
const Book = require('../models/Book');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const book = await Book.insert(req.body);
      await book.addBookUser(req.user.id);
      res.send(book);
    } catch (error) {
      next(error);
    }
  })

  .post('/userbook', authenticate, async (req, res, next) => {
    try {
      console.log('req.body.userId', req.body.userId);
      console.log('req.body.bookId', req.body.bookId);
      await Book.addBookAndUserJunction(req.body.bookId, req.body.userId);
      res.send({ message: 'added book' });
    } catch (error) {
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const book = await Book.getAll();
      res.send(book);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const book = await Book.getById(req.params.id);
      const users = await book.getUsers();
      res.send({ ...book, users });
    } catch (error) {
      next(error);
    }
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
