const access_token = "access_token"
const refresh_token = "refresh_token"

export function save_access_token(token: string) {
    localStorage.setItem(access_token, token)
}

export function save_refresh_token(token: string) {
    localStorage.setItem(refresh_token, token)
}

export function delete_token() {
    localStorage.removeItem(access_token)
    localStorage.removeItem(refresh_token)
}

export function get_refresh_token() {
    return localStorage.getItem(refresh_token) || ""
}

export function get_access_token() {
    return localStorage.getItem(access_token) || ""
}
