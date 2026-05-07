const clothingItems = require("../models/clothingItem");
const { OK_ERROR, CREATED_ERROR, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require("../utils/error");

const getClothingItems = (req, res) => {
  clothingItems.find({})
  .populate(["owner"])
  .then((clothingItems) => res.status(OK_ERROR).send(clothingItems))
  .catch((err) => {
    console.error(err);
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });
};

const createClothingItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id;

  clothingItems.create({ name, weather, imageUrl, owner: ownerId  })
  .then((clothingItem) => res.status(CREATED_ERROR).send(clothingItem))
  .catch((err) => {
    console.log(ownerId);
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
    }
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });
};

const deleteClothingItem = (req, res) => {
  clothingItems.findByIdAndDelete(req.params.itemId)
  .orFail()
  .then((clothingItem) => res.status(OK_ERROR).send({ message: "Clothing item deleted successfully" }))
  .catch((err) => {
    console.error(err);
     if (err.name === "CastError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID format" });
    } else if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: "Clothing item not found" });
    }
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });
};

const likeItem = (req, res) => {
  clothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
).orFail()
  .then((clothingItem) =>
  res.status(OK_ERROR).send({ data: clothingItem }))
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item ID format" });
    } else if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: "Clothing item not found" });
    }
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });
};

const dislikeItem = (req, res) => {
  clothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  ).orFail()
   .then((clothingItem) =>
    res.status(OK_ERROR).send({ message: "Clothing item disliked successfully" }))
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
    } else if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: "Clothing item not found" });
    }
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  });
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem, likeItem, dislikeItem };