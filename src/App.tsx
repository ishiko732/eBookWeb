import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loading } from "./components/Loading";
import { info } from "./api/auth";
import {
  defaultSnackBarAnchorOrigin,
  defaultSnackBarNumber,
  route,
  routes,
} from "./config/config";
import { delete_token } from "./config/token";
import { SnackbarProvider } from "notistack";
import { useTranslation } from "react-i18next";
import { UserContext } from "./UserContext";
import { User } from "./api/models";
import { ReadProvider } from "./ReadContext";
import { SwipeableDrawerProvider } from "./components/PositionSwipeableDrawer";
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

  const list_data = localStorage.getItem("list_data");
  const [mainOpen, setMainOpen] = React.useState<boolean>(
    list_data ? JSON.parse(list_data).mainOpen : true
  );
  const { t, i18n } = useTranslation();
  document.title = t("webTitle");
  const handleCurrentUserInfo = async () => {
    let user: User | null = null;
    setLoading(true);
    await info()
      .then((res) => {
        user = res.data;
        setUser(res.data);
      })
      .catch((err) => {
        delete_token();
      });
    setLoading(false);
    return user;
  };

  const value = {
    user,
    setUser,
    t,
    i18n,
    handleCurrentUserInfo,
    isloading,
    setLoading,
  };

  return (
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={defaultSnackBarNumber}
        anchorOrigin={defaultSnackBarAnchorOrigin}
      >
        <UserContext.Provider value={value}>
          <ReadProvider>
            <SwipeableDrawerProvider>
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
            </SwipeableDrawerProvider>
          </ReadProvider>
        </UserContext.Provider>
      </SnackbarProvider>
    </BrowserRouter>
  );
};
export default App;
