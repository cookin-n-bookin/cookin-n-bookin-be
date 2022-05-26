const pool = require('../utils/pool');

module.exports = class Book {
  id;
  title;
  author;
  imageId;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.author = row.author;
    this.imageId = row.image_id;
  }

  static async insert({ title, author, imageId }) {
    const { rows } = await pool.query(
      `INSERT INTO 
      books(title, author, image_id)
      VALUES
      ($1, $2, $3)
      RETURNING 
      *`,
      [title, author, imageId]
    );
    return new Book(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `SELECT
      *
      FROM 
      books
      `
    );
    return rows.map((row) => new Book(row));
  }
}