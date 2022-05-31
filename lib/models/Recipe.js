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
    this.rating = row.rating
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
    return this
  }
}