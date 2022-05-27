const { Router } = require('express');
const Book = require('../models/Book');
const authenticate = require('../middleware/Authentication');

module.exports = Router()
  .post('/', authenticate, async (req, res) => {
    const book = await Book.insert(req.body);
    await book.addUser(req.user.id);

    res.send(book);
  })

  .get('/', async (req, res) => {
    const book = await Book.getAll();
    res.send(book);
  })

  .get('/:id', async (req, res) => {
    const book = await Book.getById(req.params.id);
    res.send(book);
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
