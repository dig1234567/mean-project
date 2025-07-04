import axios from "axios";
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://mean-project-1-1x9r.onrender.com/api/user"
    : "http://localhost:10000/api/user";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
    });
  }

  getCurrentuser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();


