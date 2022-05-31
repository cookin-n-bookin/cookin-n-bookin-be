const { Router } = require('express');
const Recipe = require('../models/Recipe');
const authenticate = require('../middleware/authenticate');

module.exports = Router()

  .post('/', authenticate, async (req, res) => {
    try {
      const recipe = await Recipe.insert(req.body);
      await recipe.addRecipeUser(req.user.id);
      res.send(recipe);
    } catch (error) {
      console.log(error);
    }
  })