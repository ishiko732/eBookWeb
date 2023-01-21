import request from "../config/request";
import { loginVo, registerVo } from "./entity/auth";

// 登录
export const Login = (params: loginVo) =>
  request({
    method: "post",
    url: "auth/login",
    data: params,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 刷新token
export const refreshtoken = (refreshToken: string) =>
  request.post("auth/regenerateToken", { refreshToken: refreshToken });

// 注册
export const register = (params: registerVo) =>
  request({
    method: "post",
    url: "auth/register",
    data: params,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 注销
export const logout = () => request.get("auth/logout");

// 获取个人信息
export const info = () => request.get("auth/info");
