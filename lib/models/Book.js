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

  async addBookUser(userId) {
    await pool.query(
      `INSERT INTO 
      books_users(book_id, user_id)
      VALUES
      ($1, $2)
      RETURNING 
      *`,
      [this.id, userId]
    );
    return this;
  }

  async getUsers() {
    const { rows } = await pool.query(
      `SELECT
      users.id AS user_id,
      users.username
      FROM
      users
      LEFT JOIN
      books_users
      ON 
      users.id = books_users.user_id
      WHERE 
      books_users.book_id=$1
    `,

      [this.id]
    );
    return rows;
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

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT
      books.id,
      books.title,
      books.author,
      books.image_id,
      users.id AS user_id,
      users.username
      FROM
      books
      LEFT JOIN 
      books_users
      ON
      books_users.book_id = books.id
      LEFT JOIN 
      users
      ON
      users.id = books_users.user_id
      WHERE 
    books.id=$1`,
      [id]
    );

    if (!rows) return null;
    return new Book(rows[0]);
  }

  static async updateById(id, { title, author, imageId }) {
    const currentBook = await Book.getById(id);
    if (!currentBook) return null;
    const newTitle = title ?? currentBook.title;
    const newAuthor = author ?? currentBook.author;
    const newImageId = imageId ?? currentBook.imageId;
    const { rows } = await pool.query(
      `UPDATE
        books
        SET 
        title=$2, author=$3, image_id=$4
        WHERE
        id=$1
        RETURNING 
        *`,
      [id, newTitle, newAuthor, newImageId]
    );
    return new Book(rows[0]);
  }
};
