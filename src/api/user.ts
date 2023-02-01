import request from "../config/request";
import * as vo from "./entity/user";

export const getUsers = (params?: vo.selectVo) =>
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
