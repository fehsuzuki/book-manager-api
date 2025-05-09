const HttpError = require("../errors/http-error");
const authModel = require("../models/auth-model");

const authController = {
  // POST /auth/register
  register: async(req, res) => {
    const { name, email } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) throw new HttpError(400, "Invalid email.");

    if (typeof name !== "string")
      throw new HttpError(400, "Invalid credentialis.");

    const newUser = await authModel.register(req.body);

    // req.session.authenticated = true;
    // req.session.currentUser = newUser;

    res.status(201).json({message: `Welcome, ${newUser.name}`});
  },

  // POST /auth/login
  login: async(req, res) => {
    const user = await authModel.login(req.body)

    // req.session.authenticated = true;
    // req.session.currentUser = user;

    res.status(200).json({message: `Welcome, ${user.name}`})
  },

  // POST /auth/logout
  logout: async(req, res) => {
    req.authenticatedUser = undefined

    res.status(200).json({message: `User logged out.`})
  }
}

module.exports = authController