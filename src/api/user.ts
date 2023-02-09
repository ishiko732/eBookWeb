import request from "../config/request";
import { selectVo } from "./models";

export const getUsers = (params?: selectVo) =>
  request({
    method: "get",
    url: "user/lists",
    data: params,
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const userById = (id: number) => request.get(`user/user?uid=${id}`);

export const userByName = (name: string) => request.get(`user/${name}`);

export const updatePhone = (name: string, newphone: string) =>
  request.put(`user/${name}?phone=${newphone}`.replaceAll("+", "%2B"));
