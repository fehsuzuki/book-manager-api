const HttpError = require("../errors/http-error")

const errorMiddleware = (err, req, res, next) => {
  if(err) {
    if(err instanceof HttpError) {
      res.status(err.status).json({message: err.message})
    }
    res.status(400).json({message: err.message})
  } else {
    next()
  }
}

module.exports = errorMiddleware