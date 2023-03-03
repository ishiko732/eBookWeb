import { Rating, State } from "../../algorithm/fsrs/models";
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
  browseFor4Hour: boolean;
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
  uid: number;
  user: string;
  message: string;
  children: commentTree[];
  createdAt: string;
  updateAt: string;
  parentId: number | null;
}

export interface createTopicVo {
  name?: string;
  fileId?: number;
  data?: string;
  topicId?: string;
}

export interface topic {
  id: string;
  createdAt: number;
  updateAt: number;
  uid: number;
  name: string;
  data?: string;
  topicId?: string;
  fileId?: string;
}

export interface queryTopicsVo {
  fileId?: number;
  uid?: number;
  topicId?: string;
}

export interface createNoteVo {
  data?: string;
  uid: number;
  topicId: string;
  comment: string;
}
export interface note {
  id: string;
  createdAt: number;
  updateAt: number;
  tid: string;
  uid: number;
  tags: string;
  flds: string;
  sfld: string;
  data: string;
}

export interface queryNotesVo {
  uid?: number;
  topicId?: string;
  firstField?: string;
  allField?: string;
}

export interface fsrsParameter {
  uid: number;
  createdAt: number;
  updateAt: number;
  request_retention: number;
  maximum_interval: number;
  easy_bonus: number;
  hard_factor: number;
  w: number[];
  enable_fuzz: boolean;
}

export interface createCardVo {
  nid: string;
  type: number;
  card: cardVo;
}

export interface cardVo {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review?: string;
}
export interface card {
  id: string;
  type: number;
  createdAt: number;
  updateAt: number;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State | string;
  last_review?: string;
  note: note;
}

export interface queryCardVo {
  id: string;
  type: number;
}

export interface updateCardVo {
  nid: string;
  id: queryCardVo;
  card: cardVo;
  log: reviewLog;
}

export interface reviewLog {
  id: string;
}

export interface reviewLog {
  rating: Rating;
  state: State;
  elapsed_days: number;
  scheduled_days: number;
  review: string;
}

export interface queryCardsVo {
  uid?: number;
  state?: State;
  id?: string;
  beforeTime?: string;
  start?: string;
  end?: string;
}
