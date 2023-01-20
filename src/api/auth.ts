import request from '../config/request'


export const Login = (params: any) => request.post('auth/login', params)