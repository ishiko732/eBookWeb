import request from "../config/request";
import {
  createCardVo,
  fsrsParameter,
  queryCardsVo,
  queryCardVo,
  queryLogVo,
  updateCardVo,
} from "./models";

export const queryParameter = (uid: number) =>
  request.get(`fsrs/parameter/${uid}`);

export const updateParameter = (vo: fsrsParameter) =>
  request({
    method: "put",
    url: `fsrs/parameter/${vo.uid}`,
    data: {
      request_retention: vo.request_retention || 0.9,
      maximum_interval: vo.maximum_interval || 36500,
      easy_bonus: vo.easy_bonus || 1.3,
      hard_factor: vo.hard_factor || 1.2,
      w: vo.w || [1, 1, 5, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2, -0.2, 0.2, 1],
      enable_fuzz: vo.enable_fuzz || false,
    },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const createCard = (vo: createCardVo) =>
  request({
    method: "post",
    url: `fsrs/card`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const queryCard = (vo: queryCardVo) =>
  request.get(`fsrs/card`, { params: vo });

export const updateCard = (vo: updateCardVo) =>
  request({
    method: "put",
    url: `fsrs/card`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const deleteCard = (vo: queryCardVo) =>
  request({
    method: "delete",
    url: `fsrs/card`,
    data: vo,
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });

export const queryCards = (vo: queryCardsVo) =>
  request.get(`fsrs/cards`, { params: vo });

export const queryCardLog = (vo: queryLogVo) =>
  request.get(`fsrs/log`, { params: vo });

export const deleteCardLog = (logId: string) =>
  request.delete(`fsrs/log`, { params: logId });
