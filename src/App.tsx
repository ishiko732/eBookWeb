import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loading } from "./components/Loading";
import { info, health as healthApi } from "./api/auth";
import { route, routes } from "./config/config";

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
