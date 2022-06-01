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

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT
      *
      FROM 
      notes
      WHERE 
      notes.id=$1
      `,
      [id]
    );
    if (!rows) return null;
    return new Note(rows[0]);
  }

  static async updateById(id, { content, isPrivate, userId, recipeId }) {
    const currentNote = await Note.getById(id);
    if (!currentNote) return null;
    const newContent = content ?? currentNote.content;
    const newIsPrivate = isPrivate ?? currentNote.isPrivate;
    const newUserId = userId ?? currentNote.userId;
    const newRecipeId = recipeId ?? currentNote.recipeId;

    const { rows } = await pool.query(
      `UPDATE
      notes 
      SET
      content=$2, private=$3, user_id=$4, recipe_id=$5
      WHERE
      id=$1
      RETURNING 
      *`,
      [id, newContent, newIsPrivate, newUserId, newRecipeId]
    );
    return new Note(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      `DELETE FROM 
      notes
      WHERE
      id=$1
      RETURNING 
      *`,
      [id]
    );
    if (!rows) return null;
    return new Note(rows[0]);
  }

};
