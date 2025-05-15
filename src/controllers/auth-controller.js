const HttpError = require("../errors/http-error");
const authModel = require("../models/auth-model");

const authController = {
  // POST /auth/register
  register: async (req, res) => {
    const newUser = await authModel.register(req.body);

    res.status(201).json({ message: `Welcome, ${newUser.name}` });
  },

  // POST /auth/login
  login: async (req, res) => {
    const user = await authModel.login(req.body);

    res.status(200).json({ message: `Welcome, ${user.name}` });
  },

  // POST /auth/logout
  logout: async (req, res) => {
    req.authenticatedUser = undefined;

    res.status(200).json({ message: `User logged out.` });
  },
};

module.exports = authController;
