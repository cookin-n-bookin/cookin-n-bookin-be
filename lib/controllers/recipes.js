/* eslint-disable no-console */
const { Router } = require('express');
const Recipe = require('../models/Recipe');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const recipe = await Recipe.insert(req.body);
      await recipe.addRecipeUser(req.user.id);
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const recipe = await Recipe.getAll();
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const recipe = await Recipe.getById(req.params.id);
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedRecipe = await Recipe.updateById(id, req.body);

      if (!updatedRecipe) {
        const error = new Error(`Recipe ${id} not found`);
        error.status = 404;
        throw error;
      }
      res.send(updatedRecipe);
    } catch (error) {
      next(error);
    }
  });
