/* eslint-disable @next/next/no-img-element */
import { GetLoginResponse } from "@lib/httpRequest";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AppMenuItem } from "../types/types";
import AppMenuitem from "./AppMenuitem";
import chefMenusEN from "./chef-menuItems";
import chefMenusAR from "./chef-menuItemsAR";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import kitchenMenusEN from "./kitchen-menuItems";
import kitchenMenusAR from "./kitchen-menuItemsAR";
import adminMenusAR from "./menuItemsAR";
import adminMenusEN from "./menuItemsEN";

import { UserData } from "@services/Login";
import { LangContext } from "hooks/lan";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [menus, setMenus] = useState<AppMenuItem>(adminMenusAR);
  const { textFormat } = useContext(LangContext);
  const homeMenu =
    textFormat === "rtl"
      ? {
          label: "بيت",
          items: [
            { label: "لوحة معلومات", icon: "pi pi-fw pi-home", to: "/secure" },
          ],
        }
      : {
          label: "Home",
          items: [
            { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/secure" },
          ],
        };
  var model: AppMenuItem[] = [
    // {
    //   label: "Home",
    //   items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/secure" }],
    // },
    homeMenu,
    ...[menus],
  ];

  // const [textFormat, setTextFormat] = useState<string>("ar");
  // useEffect(() => {
  //   // setCookie("lang", selectedLang);
  //   cookies.lang?.name === "ar" ? setTextFormat("rtl") : setTextFormat("ltr");
  // }, []);

  useEffect(() => {
    const data: GetLoginResponse = cookies.user;
    let token: string = data.accessToken || "";
    const decoded: UserData = jwt_decode<JwtPayload>(token) as UserData;
    if (decoded.permissionLevel == 0) {
      textFormat === "rtl" ? setMenus(adminMenusAR) : setMenus(adminMenusEN);
    } else if (decoded.permissionLevel == 1) {
      textFormat === "rtl"
        ? setMenus(kitchenMenusAR)
        : setMenus(kitchenMenusEN);
      // setMenus(kitchenMenus);
    } else if (decoded.permissionLevel == 2) {
      textFormat === "rtl" ? setMenus(chefMenusAR) : setMenus(chefMenusEN);
      // setMenus(chefMenusEN);
    }
  }, [textFormat]);

  return (
    <MenuProvider>
      <ul dir={textFormat} className="layout-menu ">
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
