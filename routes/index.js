const router = require("express").Router();

const clothingItemsRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItemsRouter);
router.use("/users", userRouter);

module.exports = router;
