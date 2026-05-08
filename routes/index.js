const router = require("express").Router();

const clothingItemsRouter = require("./clothingItems");
const userRouter = require("./users");
const { NOT_FOUND_ERROR } = require("../utils/error");

router.use("/items", clothingItemsRouter);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Requested resource not found" });
});

module.exports = router;
