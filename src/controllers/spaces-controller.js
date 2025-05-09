const Space = require("../models/spaces-model")

const spacesController = {
  // GET /spaces
  index: async(req, res) => {
    const spaces = await Space.getAll()

    res.status(200).json(spaces)
  },

  // GET /spaces/:id
  show: async(req, res) => {
    const id = req.params.id

    const space = await Space.getById(id)

    res.status(200).json(space)
  },

  // POST /spaces/create
  create: async(req, res) => {
    const newSpace = await Space.create(req.body)

    res.status(201).json(newSpace)
  },

  // PUT /spaces/update/:id
  update: async(req, res) => {
    const id = req.params.id

    const updatedSpace = await Space.update(id, req.body)

    res.status(200).json(updatedSpace)
  }
}

module.exports = spacesController