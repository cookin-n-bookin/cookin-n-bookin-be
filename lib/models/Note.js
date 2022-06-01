const pool = require('../utils/pool');

module.exports = class Note {
  id;
  content;
  isPrivate;
  userId;
  recipeId;

  constructor(row) {
    this.id = row.id;
    this.content = row.content;
    this.isPrivate = row.private;
    this.userId = row.user_id;
    this.recipeId = row.recipe_id;
  }

  static async insert({ content, isPrivate, userId, recipeId }) {
    const { rows } = await pool.query(
      `INSERT INTO
      notes(content, private, user_id, recipe_id)
      VALUES
      ($1, $2, $3, $4)
      RETURNING
      *`,
      [content, isPrivate, userId, recipeId]
    );
    return new Note(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `SELECT
        *
        FROM
        notes`
    );
    return rows.map((row) => new Note(row));
  }


};
