import { role, userStatus } from "../entity/auth";

export interface selectVo {
  page?: number;
  size?: number;
}
export interface User {
  name: string;
  id: number;
  phone: string;
  role: role;
  active: userStatus;
  createdAt: string;
  updateAt: string;
  password: string;
  links: [];
}

export interface OnlineUsers {
  cnt: number | string;
  users: User[];
}

export interface folder {
  id: number;
  uid?: number;
  name: string;
  parentId: number | null;
  files: file[];
  createdAt: string;
  updateAt: string;
}

export interface file {
  id: number;
  fid: number; // 文件夹id
  fsId: string; // 媒体文件id
  uid: number;
  filename: string;
  md5: string;
}

export interface book {
  id: number;
  mid: string;
  author: string | null;
  title: string | null;
  subject: string | null;
  creator: string | null;
  creationDate: string | null;
  keywords: bookKeyword[];
  types: bookType[];
}

export interface bookKeyword {
  id: number;
  createdAt: string;
  updateAt: string;
  keyword: string;
}

export interface bookType {
  id: number;
  createdAt: string;
  updateAt: string;
  type: string;
}

export interface shareBook {
  id: number;
  book: book;
  browse: number;
  love: number;
  review: review;
  file: file;
  createdAt: string;
  updateAt: string;
}
export interface shareBook {
  store: boolean;
  loveForDay: boolean;
  shareUserName: string;
}
export interface review {
  id: number;
  checkUser: User;
  comment: string;
  status: reviewStatusType;
  createdAt: string;
  updateAt: string;
}

export const reviewStatus = ["AGREE", "WAIT", "REVOKE"] as const;
export type reviewStatusType = (typeof reviewStatus)[number];

export interface comment {
  id: number;
  bid: number;
  cid: number | null;
  uid: number;
  createdAt: string;
  updateAt: string;
}

export interface commentTree {
  cid: number;
  bid: number;
  uid:number;
  user: string;
  message: string;
  children: commentTree[];
  createdAt: string;
  updateAt: string;
  parentId: number | null;
}
