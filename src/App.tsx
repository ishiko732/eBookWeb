import React from "react";
import "./App.css";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/register";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/dashboard/Home";
import Stile from "./pages/dashboard/OutletStile";
import Hello from "./pages/dashboard/Hello";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { get_access_token } from "./config/token";
import NotFound from "./pages/exception/404";
import { Loading } from "./components/Loading";
import { info, health as healthApi } from "./api/auth";
const access_token = get_access_token();
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
      element: <Login />,
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

function App() {
  const [user, setUser] = React.useState<any>(null);
  const [health, setHealth] = React.useState<any>(true);
  const [isloading, setLoading] = React.useState(false);
  const onHealth = React.useRef(false);
  const submittingStatus = React.useRef(false);
  const isCompleted = React.useRef(false);
  React.useEffect(() => {
    if (submittingStatus.current) {
      submittingStatus.current = false;
      setLoading(true);
      info()
        .then((res: any) => {
          setUser(res.data);
          isCompleted.current = true;
          setLoading(false);
        })
        .catch(() => {
          isCompleted.current = true;
          setLoading(false);
        });
    }
  }, [user]);

  React.useEffect(() => {
    let healthTime = null;
    if (onHealth.current) {
      if (healthTime) {
        clearInterval(healthTime);
      }
      healthTime = setInterval(() => {
        healthApi().then((res) => {
          console.log(res.data);
          if ("OK" === res.data) {
            if (health === false) {
              setHealth(true);
            }
          } else {
            if (health === true) {
              setHealth(false);
            }
          }
        });
      }, 60000);
    } else {
      if (healthTime) {
        clearInterval(healthTime);
        healthTime = null;
      }
    }
  }, [health, onHealth]);

  return (
    <BrowserRouter>
      {/* <RouteProvider routes={routes}/> */}
      <Routes>
        {rotuerViews(
          routes({
            submittingStatus,
            user,
            setUser,
            health,
            onHealth,
            isloading,
            setLoading,
            isCompleted,
          })
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
