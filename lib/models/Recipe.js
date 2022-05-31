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
    this.imageId = row.imageId;
  }

  static async insert({ title, bookId, pageNumber, ingredients, imageId }) {
    const { rows } = await pool.query(
      `INSERT INTO 
      recipes(title, book_id, page_number, ingredients, image_id)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING 
      *`,
      [title, bookId, pageNumber, ingredients, imageId]
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