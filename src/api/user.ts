import request from "../config/request";
import { selectVo } from "./models";

export const getUsers = (params?: selectVo) =>
  request({
    method: "get",
    url: "user/lists",
    data: params,
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const userById = (id: number) =>
  request({
    method: "get",
    url: "user/user",
    data: { uid: id },
    transformRequest: [(data) => JSON.stringify(data)],
  });
