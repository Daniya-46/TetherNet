require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");

const app = express();

//middleware
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("db is connected & Listening on port", process.env.PORT);
    });
  })
  .catch((err) => console.log(err));
