const express = require('express')
const reservationsController = require('../controllers/reservations-controller')

const reservationsRouter = express.Router()

reservationsRouter.get('', reservationsController.index)

reservationsRouter.get('/:id', reservationsController.show)

reservationsRouter.post('/create', reservationsController.create)

module.exports = reservationsRouter