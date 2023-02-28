import request from "../config/request";
import * as vo from "./entity/auth";

// 登录
export const Login = (params: vo.loginVo) =>
  request({
    method: "post",
    url: "auth/login",
    data: params,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

// 刷新token
export const refreshtokenURL = "auth/regenerateToken";
export const refreshtoken = (refreshToken: string) =>
  request.post(refreshtokenURL, { refreshToken: refreshToken });

// 注册
export const register = (params: vo.registerVo) =>
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

// 获取在线用户列表
export const loginUser = () => request.get("auth/loginUsers");

export const health = () => request.get("auth/health");

// export const underline = (uid: number) =>
//   request.post("auth/underline", { uid: uid });

/**
 * update 更新用户信息
 */
export const updateRole = (params: vo.updateRoleVo) =>
  request.put(`auth/update/role?uid=${params.uid}&role=${params.role}`);

export const updateStatus = (params: vo.updateUserStatusVo) =>
  request.put(`auth/update/active?uid=${params.uid}&status=${params.status}`);

export const updatePassword = (params: vo.updatePasswordVo) =>
  request({
    method: "post",
    url: "auth/update/password",
    data: params,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });
