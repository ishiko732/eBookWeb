import React from "react";
import "./App.css";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/dashboard/Home";
import Stile from "./pages/dashboard/OutletStile";
import Hello from "./pages/dashboard/Hello";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { get_access_token } from "./config/token";
import LinearProgress from "@mui/material/LinearProgress";
import NotFound from "./pages/exception/404";
const access_token = get_access_token();
interface route {
  path: string;
  element: JSX.Element;
  redirect?: string;
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
    redirect: "home", //开头不能添加/,不然得从根目录写起'/dashboard/home'
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/test",
        element: <Stile />,
        redirect: ".",
        children: [
          {
            path: "/",
            element: <Hello text="TEST" />,
          },
          {
            path: "/hello",
            element: <Hello text="Hello" />,
          },
        ],
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
  {
    path: "*",
    element: <NotFound />,
  },
];
const rotuerViews = (routerItems: route[], parent?: string) => {
  return routerItems.map((item: route) => {
    const path = parent ? `${parent}${item.path}` : `${item.path}`;
    return item.children ? (
      <Route
        path={path}
        key={path}
        element={
          <React.Suspense fallback={<Loading />}>{item.element}</React.Suspense>
        }
      >
        {rotuerViews(item.children, path)}
        {item.redirect ? (
          <Route path={path} element={<Navigate to={item.redirect} />}></Route>
        ) : (
          <Route
            path={path}
            element={<Navigate to={item.children[0].path} />}
          ></Route>
        )}
      </Route>
    ) : (
      <Route
        path={path}
        key={path}
        element={
          <React.Suspense fallback={<Loading />}>{item.element}</React.Suspense>
        }
      ></Route>
    );
  });
};

function App() {
  return (
    <BrowserRouter>
      {/* <RouteProvider routes={routes}/> */}
      <Routes>{rotuerViews(routes)}</Routes>
    </BrowserRouter>
  );
}
const Loading = () => <LinearProgress />;
export default App;
