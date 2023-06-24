/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState} from "react";
import { AppMenuItem } from "../types/types";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import adminMenus from "./menuItems";
import chefMenus from "./chef-menuItems";
import kitchenMenus from "./kitchen-menuItems";
import { GetLoginResponse } from "@lib/httpRequest";
import { useCookies } from 'react-cookie';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { UserData } from "@services/Login";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [cookies, setCookie,removeCookie] = useCookies(['user']);
  const [menus, setMenus] = useState<AppMenuItem>(adminMenus);
  var model: AppMenuItem[] = [
    {
      label: "Home",
      items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/secure" }],
    },
    ...[menus],
  ];

  useEffect(() => {
        
    const data:GetLoginResponse =  cookies.user
    let token:string = data.accessToken||''
    const decoded:UserData = jwt_decode<JwtPayload>(token) as UserData;
    if(decoded.permissionLevel==0){
      setMenus(adminMenus)
    }else if(decoded.permissionLevel==1){
      setMenus(kitchenMenus)
    }else if(decoded.permissionLevel==2){
      setMenus(chefMenus)
    }
}, []);

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
