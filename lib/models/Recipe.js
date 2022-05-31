const pool = require('../utils/pool');

module.exports = class Recipe {
  id;
  title;
  bookId;
  pageNumber;
  ingredients;
  rating;
  imageId;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.bookId = row.book_id;
    this.pageNumber = row.page_number;
    this.ingredients = row.ingredients;
    this.imageId = row.image_id;
    this.rating = row.rating;
  }

  static async insert({ title, rating, bookId, pageNumber, ingredients, imageId }) {
    const { rows } = await pool.query(
      `INSERT INTO 
      recipes(title, rating, book_id, page_number, ingredients, image_id)
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING 
      *`,
      [title, rating, bookId, pageNumber, ingredients, imageId]
    );
    return new Recipe(rows[0]);
  }
  async addRecipeUser(userId) {
    await pool.query(
      `INSERT INTO 
      users_recipes(recipe_id, user_id)
      VALUES
      ($1, $2)
      RETURNING 
      *`,
      [this.id, userId]
    );
    return this;
  }

  static async getAll() {
    const { rows } = await pool.query(
      `SELECT 
      *
      FROM 
      recipes
      `
    );
    return rows.map((row) => new Recipe(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT
      *
      FROM
      recipes
      WHERE
      recipes.id=$1
      `,
      [id]
    );
    if (!rows) return null;
    return new Recipe(rows[0]);
  }

  static async updateById(id, { title, rating, bookId, pageNumber, ingredients, imageId }) {
    const currentRecipe = await Recipe.getById(id);
    if (!currentRecipe) return null;
    const newTitle = title ?? currentRecipe.title;
    const newRating = rating ?? currentRecipe.rating;
    const newBookId = bookId ?? currentRecipe.bookId;
    const newPageNumber = pageNumber ?? currentRecipe.pageNumber;
    const newIngredients = ingredients ?? currentRecipe.ingredients;
    const newImageId = imageId ?? currentRecipe.imageId;

    const { rows } = await pool.query(
      `UPDATE
      recipes
      SET
      title=$2, rating=$3, book_id=$4, page_number=$5, ingredients=$6, image_id=$7
      WHERE
      id=$1
      RETURNING
      *`,
      [id, newTitle, newRating, newBookId, newPageNumber, newIngredients, newImageId]
    );
    return new Recipe(rows[0]);
  }

};
