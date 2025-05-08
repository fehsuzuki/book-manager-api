const HttpError = require("../errors/http-error")

const adminMiddleware = async(req, res, next) => {
  if(req.authenticatedUser.role === 'admin') {
    next()
  } else {
    throw new HttpError(403, 'Not authorized.')
  }
}

module.exports = adminMiddleware