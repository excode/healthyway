/* eslint-disable @next/next/no-img-element */
import { GetLoginResponse } from "@lib/httpRequest";
import { UserData } from "@services/Login";
import { LangContext } from "hooks/lan";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AppMenuItem } from "../types/types";
import AppMenuitem from "./AppMenuitem";
// import chefMenus from "./chef-menuItems";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
// import kitchenMenus from "./kitchen-menuItems";
// import adminMenuss from "./menuItems";

const AppMenu = () => {
  // console.log({ adminMenuss });
  // console.log("hello");
  const { t } = useTranslation();
  const adminMenus = {
    label: `${t("ADMIN_DASHBOARD")}`,
    items: [
      {
        label: `${t("FEEDBACK")}`,
        icon: "pi pi-fw pi-comments",
        to: "/secure/feedback",
      },
      {
        label: `${t("NOTIFICATION")}`,
        icon: "pi pi-fw pi-bell",
        to: "/secure/notification",
      },
      {
        label: `${t("CUSTOMER")}`,
        icon: "pi pi-fw pi-id-card",
        to: "/secure/customer",
      },
      {
        label: `${t("SUBSCRIPTION")}`,
        icon: "pi pi-fw pi-dollar",
        to: "/secure/subscription",
      },
      {
        label: `${t("PROMOTIONS")}`,
        icon: "pi pi-fw pi-percentage",
        to: "/secure/promotions",
      },
      {
        label: `${t("PROMOTIONS_GALLERY")}`,
        icon: "pi pi-fw pi-images",
        to: "/secure/promotions/dataview",
      },
      {
        label: `${t("CUSTOMER_SUPPORT_TICKET")}`,
        icon: "pi pi-fw pi-ticket",
        to: "/secure/customerSupport",
      },
      {
        label: `${t("KITCHEN")}`,
        icon: "pi pi-fw pi-bookmark",
        to: "/secure/kitchen",
      },
      {
        label: `${t("MEALS")}`,
        icon: "pi pi-fw pi-filter",
        to: "/secure/mealItem",
      },
      {
        label: `${t("MEALS_GALLERY")}`,
        icon: " pi pi-fw pi-images",
        to: "/secure/mealItem/dataview",
      },

      {
        label: `${t("INGREDIENT")}`,
        icon: "pi pi-fw pi-align-center",
        to: "/secure/ingredient",
      },
      {
        label: `${t("INGREDIENT_GALLERY")}`,
        icon: "pi pi-fw pi-images",
        to: "/secure/ingredient/dataview",
      },
      {
        label: `${t("MEAL_GROUP_NAME")}`,
        icon: "pi pi-fw pi-clone",
        to: "/secure/mealGroup",
      },
      {
        label: `${t("MEAL_GROUP_NAME_GALLERY")}`,
        icon: "pi pi-fw pi-images",
        to: "/secure/mealGroup/dataview",
      },

      {
        label: `${t("USER_TABLE")}`,
        icon: "pi pi-fw pi-users",
        to: "/secure/users",
      },
    ],
  };

  const { layoutConfig } = useContext(LayoutContext);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [menus, setMenus] = useState<AppMenuItem[]>([
    {
      label: "Home",
      items: [
        { label: `${t("DASHBOARD")}`, icon: "pi pi-fw pi-home", to: "/secure" },
      ],
    },
  ]);
  // console.log("🚀 ~ file: AppMenu.tsx:104 ~ AppMenu ~ menus:", menus);

  // let model: AppMenuItem[] = [
  //   {
  //     label: "Home",
  //     items: [
  //       { label: `${t("DASHBOARD")}`, icon: "pi pi-fw pi-home", to: "/secure" },
  //     ],
  //   },
  //   ...[menus],
  // ];

  let adminModel: AppMenuItem[] = [
    {
      label: "Home",
      items: [
        { label: `${t("DASHBOARD")}`, icon: "pi pi-fw pi-home", to: "/secure" },
        {
          label: `${t("FEEDBACK")}`,
          icon: "pi pi-fw pi-comments",
          to: "/secure/feedback",
        },
        {
          label: `${t("NOTIFICATION")}`,
          icon: "pi pi-fw pi-bell",
          to: "/secure/notification",
        },
        {
          label: `${t("CUSTOMER")}`,
          icon: "pi pi-fw pi-id-card",
          to: "/secure/customer",
        },
        {
          label: `${t("SUBSCRIPTION")}`,
          icon: "pi pi-fw pi-dollar",
          to: "/secure/subscription",
        },
        {
          label: `${t("PROMOTIONS")}`,
          icon: "pi pi-fw pi-percentage",
          to: "/secure/promotions",
        },
        {
          label: `${t("PROMOTIONS_GALLERY")}`,
          icon: "pi pi-fw pi-images",
          to: "/secure/promotions/dataview",
        },
        {
          label: `${t("CUSTOMER_SUPPORT_TICKET")}`,
          icon: "pi pi-fw pi-ticket",
          to: "/secure/customerSupport",
        },
        {
          label: `${t("KITCHEN")}`,
          icon: "pi pi-fw pi-bookmark",
          to: "/secure/kitchen",
        },
        {
          label: `${t("MEALS")}`,
          icon: "pi pi-fw pi-filter",
          to: "/secure/mealItem",
        },
        {
          label: `${t("MEALS_GALLERY")}`,
          icon: " pi pi-fw pi-images",
          to: "/secure/mealItem/dataview",
        },

        {
          label: `${t("INGREDIENT")}`,
          icon: "pi pi-fw pi-align-center",
          to: "/secure/ingredient",
        },
        {
          label: `${t("INGREDIENT_GALLERY")}`,
          icon: "pi pi-fw pi-images",
          to: "/secure/ingredient/dataview",
        },
        {
          label: `${t("MEAL_GROUP_NAME")}`,
          icon: "pi pi-fw pi-clone",
          to: "/secure/mealGroup",
        },
        {
          label: `${t("MEAL_GROUP_NAME_GALLERY")}`,
          icon: "pi pi-fw pi-images",
          to: "/secure/mealGroup/dataview",
        },

        {
          label: `${t("USER_TABLE")}`,
          icon: "pi pi-fw pi-users",
          to: "/secure/users",
        },
      ],
    },
    // ...[menus],
  ];

  const { textFormat } = useContext(LangContext);
  useEffect(() => {
    const data: GetLoginResponse = cookies.user;
    let token: string = data.accessToken || "";
    const decoded: UserData = jwt_decode<JwtPayload>(token) as UserData;
    if (decoded.permissionLevel == 0) {
      setMenus(adminModel);
    } else if (decoded.permissionLevel == 1) {
      // setMenus(kitchenMenus);
    } else if (decoded.permissionLevel == 2) {
      // setMenus(chefMenus);
    }
  }, []);

  return (
    <MenuProvider>
      <ul dir={textFormat} className="layout-menu ">
        {adminModel.map((item, i) => {
          return !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={i} />
          ) : (
            // <AppMenuitem item={item} root={true} index={i} key={item.label} />
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
