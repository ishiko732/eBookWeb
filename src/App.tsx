import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loading } from "./components/Loading";
import { info, health as healthApi } from "./api/auth";
import {
  defaultSnackBarAnchorOrigin,
  defaultSnackBarNumber,
  route,
  routes,
} from "./config/config";
import { delete_token } from "./config/token";
import { SnackbarProvider } from "notistack";
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
  // const [health, setHealth] = React.useState<any>(false);
  const [isloading, setLoading] = React.useState(false);
  const onHealth = React.useRef(false);
  const submittingStatus = React.useRef(false);
  // const first = React.useRef(true);
  React.useEffect(() => {
    console.log("user 请求更新:" + JSON.stringify(user));
    if (submittingStatus.current) {
      submittingStatus.current = false;
      setLoading(true);
      info()
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          delete_token();
          setLoading(false);
        });
    }
  }, [user]);

  // React.useEffect(() => {
  //   if (first.current) {
  //     first.current = false;
  //     // console.log("Health 请求更新:" + health);
  //     setInterval(() => {
  //       if (onHealth.current) {
  //         healthApi()
  //           .then((res) => {
  //             console.log(res.data);
  //             if ("OK" === res.data) {
  //               if (health === false) {
  //                 setHealth(true);
  //               }
  //             }
  //           })
  //           .catch((err) => {
  //             setHealth(false);
  //           });
  //       }
  //     }, 60000);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const list_data = localStorage.getItem("list_data");
  const [mainOpen, setMainOpen] = React.useState<boolean>(
    list_data ? JSON.parse(list_data).mainOpen : true
  );

  return (
    <SnackbarProvider
      maxSnack={defaultSnackBarNumber}
      anchorOrigin={defaultSnackBarAnchorOrigin}
    >
      <BrowserRouter>
        <Routes>
          {rotuerViews(
            routes({
              submittingStatus,
              user,
              setUser,
              // health,
              // setHealth,
              onHealth,
              isloading,
              setLoading,
              mainOpen,
              setMainOpen,
            })
          )}
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
};
export default App;
