import React from "react";
import "./App.css";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./locales/index";
import { get_access_token } from "./config/token";
const access_token = get_access_token();
const routes: { path: string; element: JSX.Element }[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
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

const routeProvider = routes.map(
  ({ path, element }: { path: string; element: JSX.Element }) => (
    <Route path={path} element={element} />
  )
);

function App() {
  return (
    <BrowserRouter>
      <Routes>{routeProvider}</Routes>
    </BrowserRouter>
  );
}

export default App;
