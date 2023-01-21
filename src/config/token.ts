import localstorage from "./localstorage";
const access_token = "access_token";
const refresh_token = "refresh_token";
const access_token_expire_length = 300000 //5分钟
const refresh_token_expire_length = 6000000 //100分钟

export function save_access_token(token: string): void {
  localstorage.setItem(access_token, token, access_token_expire_length);
}

export function save_refresh_token(token: string): void {
  localstorage.setItem(refresh_token, token, refresh_token_expire_length);
}

export function delete_token(): void {
  localstorage.removeItem(access_token);
  localstorage.removeItem(refresh_token);
}

export function get_refresh_token(): string {
  return localStorage.getItem(refresh_token) || "";
}

export function get_access_token(): string {
  return localStorage.getItem(access_token) || "";
}
