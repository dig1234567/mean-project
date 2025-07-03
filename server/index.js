require("dotenv").config();
const express = require("express");
const path = require('path');
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./router").auth;
const courseRouter = require("./router").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB 連線
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 已連接"))
  .catch((err) => console.error("MongoDB 連線失敗", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API 路由
app.use("/api/user", authRouter);
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRouter
);

// 如果是部署（production）環境，提供 React 前端
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client1/build")));

  // 所有非 API 路由，導向 React 前端
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client1/build/index.html"));
  });
}

// 預設首頁（可省略）
app.get("/", (req, res) => {
  res.send("後端 API 運作中 🚀");
});

// 啟動伺服器
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
