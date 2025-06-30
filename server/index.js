require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./router").auth;
const courseRouter = require("./router").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 已連接"))
  .catch((err) => console.error("MongoDB 連線失敗", err));
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 👉 設定 Express 提供 React 的 build 靜態檔案
app.use(express.static(path.join(__dirname, "../client/build")));


// 👇 所有未配對的路由都導向 React 的 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.get("/", (req, res) => {
  res.send("後端 API 運作中 🚀");
});

app.use("/api/user", authRouter);
// 任何到此Router都會執行此函數
// course route應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unauthorized
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRouter
);

const path = require("path");

// ===== 加入這段來服務 React 的 build =====
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
