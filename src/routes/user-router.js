const express = require('express')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')

const userRouter = express.Router()

userRouter.get('', authMiddleware, adminMiddleware, userController.index)

userRouter.get('/:id', authMiddleware, adminMiddleware, userController.show)

userRouter.put('/update/:id', authMiddleware, userController.update)

module.exports = userRouter