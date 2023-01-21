import axios from "axios";
import { HttpStatusCode as Status } from "../api/StatusCode";
import localstorage from "./localstorage";
// 这里取决于登录的时候将 token 存储在哪里
const token = localstorage.getItem("access_token");
const instance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 5000,
});

// 设置post请求头
instance.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 将 token 添加到请求头
    token && (config.headers.Authorization = "Bearer " + token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status === Status.Ok) {
      if (response.data?.code) {
        if (response.data.code === Status.Ok) {
          return Promise.resolve(response.data);
        } else {
          return Promise.reject(response);
        }
      }
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    // 相应错误处理
    // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
    switch (error.response.status) {
      case 401:
        const refreshAPI = "auth/register";
        const refresh_token = localstorage.getItem("refresh_token");
        // "用户未登录或用户已过期,请重新登录"
        break;
      case 403:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        console.log("其他错误信息");
    }
    return Promise.reject(error);
  }
);

export default instance;
