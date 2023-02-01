import { role, userStatus } from "../entity/auth";

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
