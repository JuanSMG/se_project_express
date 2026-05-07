const User = require("../models/user");
const { OK_ERROR, CREATED_ERROR, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require("../utils/error");

const getUsers = (req, res) => {
  User.find({})
  .then((users) => res.status(OK_ERROR).send(users))
  .catch((err) => {
    console.error(err);
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
  .then((user) => res.status(CREATED_ERROR).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
    }
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
  .orFail() // This will throw a DocumentNotFoundError if no user is found
  .then((user) => res.status(OK_ERROR).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
    } if (err.name === "CastError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid user ID format" });
    }
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });

}

module.exports = { getUsers, createUser, getUserById };