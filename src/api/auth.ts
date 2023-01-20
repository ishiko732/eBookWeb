import request from '../config/request'


export const Login = (params: any) => request({
    method: "post",
    url: 'auth/login',
    data: params,
    headers: { "Content-Type": "application/json" },
    transformRequest: [data => JSON.stringify(data)]
})