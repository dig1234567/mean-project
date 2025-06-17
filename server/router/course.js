const router = require("express").Router();
const Course = require("../model").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("正在接收Course req的請求....");
  next();
});

//查詢所有課程
router.get("/", async (req, res) => {
  try {
    let CourseData = await Course.find({}).exec();
    return res.send(CourseData);
  } catch (e) {
    return res.status(500).send("發生錯誤");
  }
});

// 透過id查詢課程
router.get("/query/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let data = await Course.find({ _id }.exec());
    return res.send({
      message: "你所需要的資料如下",
      data,
    });
  } catch (e) {
    return res.status(500).send("發生錯誤請確認輸入ID是否正確....");
  }
});

// 發布課程
router.post("/", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
    });
    let saveCourse = await newCourse.save();
    return res.json({ message: "資料儲存成功" });
  } catch (e) {
    return res.status(500).send("資訊創建失敗....");
  }
});

// 刪除特定資訊
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let deleteData = await Course.findOne({ _id }).exec();
    if (!deleteData) {
      return res.send("你輸入要刪除的資訊不存在,請重新輸入...");
    }
    await Course.deleteOne({ _id }).exec();
    return res.send({
      message: "資料刪除成功..",
    });
  } catch (e) {
    return res.status(500).send("發生錯誤....");
  }
});

// 刪除所有資料Router
router.delete("/", async (req, res) => {
  let SuccessDelete = await Course.deleteMany({});
  return res.send("資料成功刪除...");
});

module.exports = router;
