import axios from "axios";
import { HttpStatusCode as Status } from "../utils/StatusCode";
import localstorage from "../utils/localstorage";
import {
  get_refresh_token,
  save_access_token,
  save_refresh_token,
  access_token as access_string,
  refresh_token as refresh_string,
  refresh_token_expire_length,
} from "./token";
import { logOut } from "./logOut";
import { defaultLanguage } from "./config";
import { refreshtokenURL } from "../api/auth";
import { timer } from "../utils/sleep";
// 这里取决于登录的时候将 token 存储在哪里
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
    const token = localstorage.getItem(access_string);
    token && (config.headers.Authorization = `Bearer ${token}`);
    config.headers["Accept-Language"] = (
      localStorage.language || defaultLanguage
    ).replace("_", "-");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const overTime = 15 * 1000; // token 超过15秒
// 添加响应拦截器
let flag = false;
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
    if (error.code === "ERR_NETWORK") {
      error.msg = "server not started"; //服务器未启动
      return Promise.reject(error);
    }
    switch (error.response.data.code) {
      case 401:
        // console.log("error401:" + error.response.data.msg);
        const refresh_token = get_refresh_token();
        if (refresh_token.length !== 0) {
          // 1. 判断flag是否为false,true则阻塞
          while (flag) {
            await timer(300);
            console.log("延迟0.3s,等待新token");
          }
          // 2. 判断是否存在tokenTime,不存在说明被清理掉了token信息
          // 在开头refresh_token.length !== 0 已经判断是存在token的,但在while等待中被清理了
          const tokenTime = localstorage.getExpire(refresh_string) as number;
          // console.log("过期时间:"+tokenTime+" 当前时间:"+Date.now())
          if (tokenTime == null) {
            // 未获取到时间,说明进入注销删除了token
            return Promise.reject(error);
          }
          // 3. 获取流动时间,token保存时间=tokenTime-refresh_token_expire_length
          // 判断差值 (当前时间-token保存时间)是否大于最大延迟时间overTime
          const flowtime = Date.now() - tokenTime + refresh_token_expire_length;
          if (!flag && flowtime > overTime) {
            // 1. 请求新token
            flag = true; // 阻塞后续请求
            await axios({
              url: error.config.baseURL + refreshtokenURL,
              method: "POST",
              headers: {
                // Authorization: `Bearer ${refresh_token}`
                "Content-Type": "application/x-www-form-urlencoded",
              },
              data: {
                refreshToken: refresh_token,
              },
            })
              .then((res) => {
                // 2. 保存到token
                // console.log("刷新token:"+res);
                if (res.data.code !== Status.Ok) {
                  console.log("请求新token失败");
                  return Promise.reject(error);
                }
                console.log("请求到的新token", res.data.data);
                save_access_token(res.data.data.access_token);
                save_refresh_token(res.data.data.refresh_token);
              })
              .catch((err) => {
                console.log(error);
                logOut();
              });
            flag = false; // 解除阻塞
          }
          // 3. 重放请求
          // request是上面创建的axios的实例
          //这里不需要error.config.headers.Authorization = `Bearer ${newToken}`
          // 调用instance(error.config) 会使其被请求拦截器拦截并添加新的token
          return instance(error.config);
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
