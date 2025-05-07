const HttpError = require("../errors/http-error")

const adminMiddleware = (req, res, next) => {
  if(req.session.currentUser.role === 'admin') {
    next()
  } else {
    throw new HttpError(200, 'Not authorized.')
  }
}

module.exports = adminMiddleware