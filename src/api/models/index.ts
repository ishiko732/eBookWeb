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
  keywords: string[];
  types: string[];
}