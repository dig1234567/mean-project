const router = require("express").Router();
const User = require("../model").user;
const jwt = require("jsonwebtoken");
const { user } = require("../model");
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;

router.use((req, res, next) => {
  console.log("正在經過authMiddle函數...");
  next();
});

// 新增用戶Router
router.post("/register", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認此信箱是否已註冊過
  const emailFound = await User.findOne({ email: req.body.email });
  if (emailFound) {
    return res.status(400).send("此信箱已經被註冊過..");
  }

  // 取得用戶資料
  let { username, email, password } = req.body;
  let newUser = new User({ username, email, password });
  try {
    let saveUser = await newUser.save();
    return res.send({
      msg: "資料已存入資料庫",
      saveUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者...");
  }
});

// 登入驗證Router
router.post("/login", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認有無使用者
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("無此用戶存在,請重新註冊新帳戶..");
  }
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      //製作JsonWebToken
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "成功登入",
        token: token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤....");
    }
  });
});

// 刪除所有資料Router
router.get("/delete", async (req, res) => {
  let SuccessDelete = await User.deleteMany({});
  return res.send("資料成功刪除...");
});

module.exports = router;
