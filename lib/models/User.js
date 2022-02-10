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
    try {
      if (!username) throw new Error('Required Username');

      const { rows } = await pool.query(
        `INSERT INTO users(username, email)
      VALUES ($1, $2)
      RETURNING *
      `,
        [username, email]
      );
      return new User(rows[0]);
    } catch (e) {
      console.log(e);
    }
  }

  static async findByUsername(username) {
    try {
      const { rows } = await pool.query(
        `SELECT *
      FROM users
      WHERE username=$1
      `,
        [username]
      );
      if (!rows[0]) return null;
      return new User(rows[0]);
    } catch (e) {
      console.log(e);
    }
  }
  toJSON() {
    return { ...this };
  }
};
