const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ username, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO 
      users (username, password_hash)
      VALUES 
      ($1, $2)
      RETURNING 
      *`,
      [username, passwordHash]
    );
    return new User(rows[0]);
  }

  static async getByUserName(username) {
    const { rows } = await pool.query(
      `
      SELECT 
        *
      FROM 
        users
      WHERE
        username=$1
      `,
      [username]
    );

    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  async addUser(bookId) {
    await pool.query(
      `INSERT INTO 
      books_users(book_id, user_id)
      VALUES
      ($1, $2)
      RETURNING 
      *`,
      [this.id, bookId]
    );
    return this;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT
      books.id AS books_id,
      books.title,
      books.author,
      books.image_id,
      users.id,
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
     users.id=$1`,
      [id]
    );
    if (!rows) return null;
    return new User(rows[0]);
  }

  async getBooks() {
    const { rows } = await pool.query(
      `SELECT
      books.id AS book_id,
      books.title,
      books.author,
      books.image_id
      FROM
      books
      LEFT JOIN
      books_users
      ON
      books.id = books_users.book_id
      WHERE
      books_users.user_id=$1
      `,
      [this.id]
    );
    return rows;
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
