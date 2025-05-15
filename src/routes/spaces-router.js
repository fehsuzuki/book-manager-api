const express = require('express')
const spacesController = require('../controllers/spaces-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')

const spacesRouter = express.Router()

spacesRouter.get('', authMiddleware, adminMiddleware, spacesController.index)

spacesRouter.get('/:id', authMiddleware, adminMiddleware, spacesController.show)

spacesRouter.post('/create', authMiddleware, adminMiddleware, spacesController.create)

spacesRouter.put('/update/:id', authMiddleware, adminMiddleware, spacesController.update)

module.exports = spacesRouter