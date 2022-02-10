const pool = require('../utils/pool');

module.exports = class Post {
  id;
  userId;
  post;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.post = row.post;
  }
  static async insert({ userId, post }) {
    const { rows } = await pool.query(
      `INSERT INTO posts (user_id, post)
       VALUES ($1, $2)
       RETURNING *
      `,
      [userId, post]
    );
    return new Post(rows[0]);
  }
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows.map((row) => new Post(row));
  }
};
