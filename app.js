const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const cors = require("cors");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "69fb813a4e2e931638d47c1a",
//   };
//   next();
// }); --- added from the last Sprint, but now we will use auth middleware instead of this hardcoded user
app.use(cors());
app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
