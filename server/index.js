require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");

const authRouter = require("./router").auth;
const courseRouter = require("./router").course;
require("./config/passport")(passport);

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 已連接"))
  .catch((err) => console.error("MongoDB 連線失敗", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use("/api/user", authRouter);
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRouter
);

// Serve frontend build files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client1/build")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client1/build/index.html"));
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
