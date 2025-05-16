const Reservation = require("../models/reservations-model")

const reservationsController = {
  index: async(req, res) => {
    const reservations = await Reservation.getAll()

    res.status(200).json(reservations)
  },

  show: async(req, res) => {
    const id = req.params.id

    const reservation = await Reservation.getById(id)

    res.status(200).json(reservation)
  },

  create: async(req, res) => {
    const newReservation = await Reservation.create(req.body)

    res.status(201).json(newReservation)
  }
}

module.exports = reservationsController