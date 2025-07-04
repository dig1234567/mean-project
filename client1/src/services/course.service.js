import axios from "axios";
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://mean-project-1-1x9r.onrender.com/api/user"
    : "http://localhost:10000/api/user";

class CourseService {
  // Post資料
  post(title, description, price) {
    let token = "";
    const userData = localStorage.getItem("user");

    if (userData) {
      token = JSON.parse(userData).token;
    }

    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: {
          Authorization: `Bearer ${token}`, // <-- 加上 Bearer
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 尋找資料
  get() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // <-- 加上 Bearer
        "Content-Type": "application/json",
      },
    });
  }

  // 刪除所有資料
  delete() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.delete(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // <-- 加上 Bearer
        "Content-Type": "application/json",
      },
    });
  }
}

export default new CourseService();
