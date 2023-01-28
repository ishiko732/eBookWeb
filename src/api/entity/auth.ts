export interface loginVo {
  name: string;
  password: string;
}

export interface registerVo {
  name: string;
  pwd: string;
  phone: string;
}

export enum role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  TEMP = "TEMP",
}
export interface updateRoleVo {
  uid: number;
  role: role;
}

export enum userStatus {
  EXPIRED = "EXPIRED",
  ENABLED = "ENABLED",
  LOCKED = "LOCKED",
}

export interface updateUserStatusVo {
  uid: number;
  status: userStatus;
}

export interface updatePasswordVo {
  uid: number;
  rawPassword: string;
  newPassword: string;
}
