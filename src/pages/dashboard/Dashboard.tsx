import React from "react";
import { get_access_token, get_refresh_token } from "../../config/token"
export default function Dashboard() {
    return (<div>
        hello
        <div>{get_access_token()}</div>
        <div>{get_refresh_token()}</div>
    </div>
    )
}
