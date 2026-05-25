const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.use((err, req, res) => {
  console.error(err);
  res.status(500).send({ message: "An error has occurred on the server" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
