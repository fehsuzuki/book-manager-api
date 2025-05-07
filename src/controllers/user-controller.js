const HttpError = require("../errors/http-error");
const User = require("../models/users-model");
const jwt = require('jsonwebtoken')

const userController = {

  // GET /users
  index: async (req, res) => {
    const users = await User.getAll();

    res.status(200).json(users);
  },

  // GET /users/:id
  show: async (req, res) => {
    const id = req.params.id;

    const user = await User.getById(id);

    res.status(200).json(user);
  },


  // PUT /users/update/:id
  update: async (req, res) => {
    const id = req.params.id;

    const authHeader = req.headers.authorization

    const token = authHeader.split(" ")[1]

    const decodedToken = jwt.verify(token, process.env.JWT_KEY)

    if(+id !== decodedToken.id) throw new HttpError(400, `Cannot edit another user's data.`)

    const updatedUser = await User.update(id, req.body);

    res.status(200).json(updatedUser);
  },
};

module.exports = userController;
