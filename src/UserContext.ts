import { i18n, TFunction } from "i18next";
import { createContext, useContext } from "react";
import { User } from "./api/models";
export interface ProviderContext {
  user: User;
  setUser:React.Dispatch<React.SetStateAction<User|null>>;
  t:TFunction<"translation", undefined, "translation">;
  i18n:i18n;
  isloading:boolean;
  setLoading:React.Dispatch<React.SetStateAction<boolean>>;
  handleCurrentUserInfo:() => Promise<User|null>;
}

// @ts-ignore
export const UserContext = createContext<ProviderContext>();

export function useUserContext() {
  return useContext(UserContext);
}
