const express = require('express')
const spacesController = require('../controllers/spaces-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')

const SpacesRouter = express.Router()

SpacesRouter.get('', spacesController.index)

SpacesRouter.get('/:id', authMiddleware, adminMiddleware, spacesController.show)

SpacesRouter.post('/create', authMiddleware, adminMiddleware, spacesController.create)

SpacesRouter.put('/update/:id', authMiddleware, adminMiddleware, spacesController.update)

module.exports = SpacesRouter