const HttpError = require("../errors/http-error");
const jwt = require('jsonwebtoken');
const User = require("../models/users-model");

const authMiddleware = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new HttpError(401, "Authorization token required.");

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY)

    const user = await User.getById(decodedToken.id)

    if(!user) throw new HttpError(404, 'User not found.')

    req.authenticatedUser = user

    console.log(req.authenticatedUser)

    next()

  } catch (error) {
    throw new HttpError(401, "Invalid token.")
  }
};

module.exports = authMiddleware;
