const ClothingItem = require("../models/clothingItem");
const {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/error");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(OK_STATUS).send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner: ownerId })
    .then((item) => res.status(CREATED_STATUS).send(item))
    .catch((err) => {
      console.log(ownerId);
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid item data" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN_ERROR)
          .send({ message: "You are not the owner of this item" });
      }
      return ClothingItem.deleteOne(item).then(() => res.send(item));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid item ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK_STATUS).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid item ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK_STATUS).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid item ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
