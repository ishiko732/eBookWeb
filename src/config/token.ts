import localstorage from "../utils/localstorage";
export const access_token = "access_token";
export const refresh_token = "refresh_token";
export const access_token_expire_length = 10 * 60 * 1000; //10分钟
export const refresh_token_expire_length = 100 * 60 * 1000; //100分钟
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
  return localstorage.getItem(refresh_token) || "";
}

export function get_access_token(): string {
  return localstorage.getItem(access_token) || "";
}
