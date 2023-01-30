import axios from "axios";
import { HttpStatusCode as Status } from "../utils/StatusCode";
import localstorage from "../utils/localstorage";
import {
  get_refresh_token,
  save_access_token,
  save_refresh_token,
} from "./token";
import { logOut } from "./logOut";
import { language } from "../locales";
// 这里取决于登录的时候将 token 存储在哪里
const instance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 5000,
});
const lang = language();

// 设置post请求头
instance.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 将 token 添加到请求头
    const token = localstorage.getItem("access_token");
    token && (config.headers.Authorization = `Bearer ${token}`);
    config.headers["Accept-Language"] = lang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
let refresh = false;
instance.interceptors.response.use(
  (response) => {
    if (response.status === Status.Ok) {
      if (response.data?.code) {
        if (response.data.code === Status.Ok) {
          return Promise.resolve(response.data);
        } else {
          return Promise.reject(response.data);
        }
      }
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response.data);
    }
  },
  async function (error) {
    // 相应错误处理
    // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
    console.log(error.response.data.code);
    switch (error.response.data.code) {
      case 401:
        const refresh_token = get_refresh_token();
        if (refresh_token.length !== 0) {
          // 1. 请求新token
          if (refresh) {
            return Promise.reject(error);
          }
          refresh = true;
          try {
            const res = await axios({
              url: "http://localhost:8080/auth/regenerateToken",
              method: "POST",
              headers: {
                // Authorization: `Bearer ${refresh_token}`
                "Content-Type": "application/x-www-form-urlencoded",
              },
              data: {
                refreshToken: refresh_token,
              },
            });
            // 2. 保存到token
            if (!res.data.data) {
              console.log("请求新token失败");
              return Promise.reject(error);
            }
            console.log("请求新token", res.data.data);
            save_access_token(res.data.data.access_token);
            save_refresh_token(res.data.data.refresh_token);
            // 3. 重发请求
            // request是上面创建的axios的实例
            refresh = false;
            return instance(error.config);
          } catch (error) {
            refresh = false;
            console.log(error);
            logOut();
          }
        }
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
