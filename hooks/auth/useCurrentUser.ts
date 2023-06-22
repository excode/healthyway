import { useEffect, useState } from "react";


import { LoginData, LoginService, UserData } from "@services/Login";


export const useCurrentUser = () => {
  const [user, setUser] = useState<UserData>({email:''});
  /*
  useEffect(() => {
    const currentUser = getCookie("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser) as UserData);
    }
  }, []);

  const refetchUser = async (loginData:LoginData) => {
    const loginService = new LoginService()
    const userInfo = await loginService.login(loginData)
    const currentUser = getCookie("currentUser");
    
    if (userInfo && currentUser) {
      const newUser:UserData =JSON.parse(currentUser)  as UserData;
      setCookie("currentUser", JSON.stringify(currentUser));
      setUser(newUser);
    }
  };
  */
  return { user };
};
