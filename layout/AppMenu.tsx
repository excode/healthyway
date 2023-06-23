/* eslint-disable @next/next/no-img-element */
import { useContext } from "react";
import { AppMenuItem } from "../types/types";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import menus from "./menuItems";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  var model: AppMenuItem[] = [
    {
      label: "Home",
      items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/secure" }],
    },
    ...[menus],
  ];
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
