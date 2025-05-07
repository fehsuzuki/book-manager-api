const express = require('express')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')

const userRouter = express.Router()

userRouter.get('', userController.index)

userRouter.get('/:id', userController.show)

userRouter.put('/update/:id', authMiddleware, userController.update)

module.exports = userRouter