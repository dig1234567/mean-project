require dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./router").auth;
const courseRouter = require("./router").course;
const dotenv = require("dotenv");
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRouter);
// 任何到此Router都會執行此函數
// course route應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unauthorized
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRouter
);

app.listen(8080, () => {
  console.log("Server is running Port 8080...");
});
