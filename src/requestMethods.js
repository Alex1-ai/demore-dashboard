import axios from "axios";
const persistRoot = localStorage.getItem("persist:root");
// const BASE_URL = "http://localhost:5000/api/";
// const BASE_URL="/api/"
const BASE_URL="https://demore-shop.onrender.com/api/"
let TOKEN = "";

if (persistRoot) {
  const user = JSON.parse(JSON.parse(persistRoot).user);
  if (user && user.currentUser) {
    TOKEN = user.currentUser.accessToken;
  }
}

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
// TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;

// export const publicRequest = axios.create({
//   baseURL: BASE_URL,
// });

// export const userRequest = axios.create({
//   baseURL: BASE_URL,
//   headers: { token: `Bearer ${TOKEN}` },
// });
