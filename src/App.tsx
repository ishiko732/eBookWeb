import React from "react";
import "./App.css";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/register";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/dashboard/Home";
import Stile from "./components/OutletStile";
import Hello from "./pages/dashboard/Hello";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/exception/404";
import { Loading } from "./components/Loading";
import { info, health as healthApi } from "./api/auth";
import { get_refresh_token } from "./config/token";

interface route {
  path: string;
  element: JSX.Element;
  redirect?: string;
  children?: route[];
}
const routes = (props: any): route[] => {
  return [
    {
      path: "/login",
      element: <Login {...props} />,
    },
    {
      path: "/register",
      element: <SignUp />,
    },
    {
      path: "/dashboard",
      element: <Dashboard {...props} />,
      redirect: "home", //开头不能添加/,不然得从根目录写起'/dashboard/home'
      children: [
        {
          path: "/home",
          element: <Home {...props} />,
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
        get_refresh_token() === "" ? (
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
};
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

const App = () => {
  const [user, setUser] = React.useState<any>(null);
  const [health, setHealth] = React.useState<any>(false);
  const [isloading, setLoading] = React.useState(false);
  const onHealth = React.useRef(false);
  const submittingStatus = React.useRef(false);
  const first = React.useRef(true);
  React.useEffect(() => {
    console.log("user 请求更新:" + JSON.stringify(user));
    if (submittingStatus.current) {
      submittingStatus.current = false;
      setLoading(true);
      info()
        .then((res: any) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user]);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      console.log("Health 请求更新:" + health);
      setInterval(() => {
        if (onHealth.current) {
          healthApi()
            .then((res) => {
              console.log(res.data);
              if ("OK" === res.data) {
                if (health === false) {
                  setHealth(true);
                }
              }
            })
            .catch((err) => {
              if (health === true) {
                setHealth(false);
              }
            });
        }
      }, 60000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {rotuerViews(
          routes({
            submittingStatus,
            user,
            setUser,
            health,
            setHealth,
            onHealth,
            isloading,
            setLoading,
          })
        )}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
