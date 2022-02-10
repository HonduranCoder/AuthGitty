const pool = require('../utils/pool.js');

module.exports = class User {
  id;
  username;
  email;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
  }

  static async insert({ username, email }) {
    if (!username) throw new Error('Required Username');

    const { rows } = await pool.query(
      `INSERT INTO users(username, email)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [username, email]
    );
    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `SELECT *
      FROM users
      WHERE usernam=$1
      `,
      [username]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
  toJSON() {
    return { ...this };
  }
};
