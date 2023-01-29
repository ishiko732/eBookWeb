
import {delete_token } from "./token";
export const logOut=()=>{
    delete_token();
    localStorage.removeItem("list_data");
    localStorage.removeItem("remember");
}