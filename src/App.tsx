import React from "react";
import "./App.css";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/dashboard/Home";
import Test from "./pages/dashboard/Home2";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./locales/index";
import { get_access_token } from "./config/token";
const access_token = get_access_token();
interface route {
  path: string;
  element: JSX.Element;
  children?: route[];
}
const routes: route[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/",
        element: <Navigate replace to="home" />,
      },
      {
        path: "/test",
        element: <Test />,
      },
    ],
  },
  {
    path: "/",
    element:
      access_token === "" ? (
        <Navigate to="/login" />
      ) : (
        <Navigate to="/dashboard" />
      ),
  },
];

function RouteProvider({routes}:{routes:route[]}){
  return (
    <Routes>
      {
        routes.map(
          (route:route) => (
            <Route path={route.path} element={route.element}>
              {
                route.children?.map((c:route)=>{
                  return (<Route path={`${route.path}/${c.path}`} element={c.element} />)
                })
              }
              
              {/* <ChildrenProvider path={route.path} children={route.children}/> */}
            </Route>
          )
        )
      }
    </Routes>
  )
}

// 失败品
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// TODO 待处理
function ChildrenProvider({path,children}:{path:string,children?: route[]}){
    return(
        <React.Fragment>
        {children?.map((c:route)=>{
          return (<Route path={`${path}/${c.path}`} element={c.element} />)
        })}
        </React.Fragment>
    )
}

function App() {
  return (
    <BrowserRouter>
      <RouteProvider routes={routes}/>
    </BrowserRouter>
  );
}

export default App;
