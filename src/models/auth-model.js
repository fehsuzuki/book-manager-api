const { query } = require("../database");
const HttpError = require("../errors/http-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../validations/users-schema");


const authModel = {
  // Register ---------------------------------------------------------------------------------
  async register({ name, email, password, role }) {
    const isUserCredentialsValid = userSchema.validate({
      name,
      email,
      password,
      role,
    });

    if (isUserCredentialsValid.error) {
      throw new HttpError(400, isUserCredentialsValid.error.message);
    }

    const userSearchResult = await query(
      `
      SELECT *
      FROM users
      WHERE email = $1;
      `,
      [email]
    );

    if (userSearchResult.rows[0])
      throw new HttpError(400, "Email already in use.");

    const newUserResult = await query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [name, email, bcrypt.hashSync(password, 10), role]
    );

    return newUserResult.rows[0];
  },

  // Login --------------------------------------------------------------------------------------
  async login({ email, password }) {
    const userSearchResult = await query(
      `
      SELECT *
      FROM users
      WHERE email = $1;
      `,
      [email]
    );

    const userData = userSearchResult.rows[0];

    if (!userData) throw new HttpError(400, "Email or password incorrect.");

    const isValidPassword = await bcrypt.compare(password, userData.password);

    console.log(userData.password);

    if (!isValidPassword)
      throw new HttpError(400, "Email or password incorrect.");

    const payload = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

    console.log(token);

    return userData;
  },
};

module.exports = authModel;
