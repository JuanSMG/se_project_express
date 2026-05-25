const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
