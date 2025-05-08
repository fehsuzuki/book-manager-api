const { query } = require("../database");
const HttpError = require("../errors/http-error");
const jwt = require("jsonwebtoken");
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

    const userResultData = userResult.rows[0];

    const updatedAt = new Date();

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    )
      throw new HttpError(400, "Invalid credentials.");

    const hashPassword = bcrypt.hashSync(password, 10);

    const updatedUser = {
      name,
      email,
      hashPassword,
      updatedAt,
    };

    Object.assign(userResultData, updatedUser);

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
        userResultData.name,
        userResultData.email,
        userResultData.password,
        userResultData.updatedAt,
        userId,
      ]
    );

    if (!updatedUserResult.rows[0])
      throw new HttpError(400, "Something went wrong while editing data.");

    return { message: "User edited successfully." };
  }
}

module.exports = User;
