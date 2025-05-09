const { query } = require("../database");
const HttpError = require("../errors/http-error");
const bcrypt = require("bcrypt");

class User {
  constructor(userRow) {
    this.id = userRow.id;
    this.name = userRow.name;
    this.email = userRow.email;
    this.password = userRow.password;
    this.role = userRow.role;
    this.createdAt = new Date(userRow.created_at);
    this.updatedAt = new Date(userRow.updated_at);
  }

  // Get all ---------------------------------------------------------------------------------
  static async getAll() {
    const usersResult = await query(
      `
      SELECT * 
      FROM users
      ORDER BY id;
      `
    );

    return usersResult.rows.map((row) => new User(row));
  }

  // Get by ID -------------------------------------------------------------------------------
  static async getById(userId) {
    const userResult = await query(
      `
      SELECT * 
      FROM users
      WHERE id = $1;
      `,
      [userId]
    );

    if (!userResult.rows[0]) throw new HttpError(404, "User not found.");

    return new User(userResult.rows[0]);
  }

  // Update --------------------------------------------------------------------------------
  static async update(userId, { name, email, password }) {
    const userResult = await query(
      `
      SELECT * 
      FROM users
      WHERE id = $1;
      `,
      [userId]
    );

    if (!userResult.rows[0]) throw new HttpError(404, "User not found.");

    const userData = userResult.rows[0];

    if(name === undefined) name = userData.name
    if(email === undefined) email = userData.email
    if(password === undefined) password = userData.password

    const updatedAt = new Date();

    // Verificando se o email atualizado já está em uso
    const userExistsResult = await query(
      `
      SELECT *
      FROM users
      WHERE email = $1;
      `,
      [email]
    )

    if(email !== userData.email && userExistsResult) throw new HttpError(400, 'Email already in use;')
   
    const updatedUserResult = await query(
      `
      UPDATE users
      SET
        name = $1,
        email = $2, 
        password = $3, 
        updated_at = $4
      WHERE id = $5
      RETURNING*;
      `,
      [
        name,
        email,
        password,
        updatedAt,
        userId,
      ]
    );

    if (!updatedUserResult.rows[0])
      throw new HttpError(400, "Something went wrong while editing data.");

    return new User(updatedUserResult.rows[0]);
  }
}

module.exports = User;
