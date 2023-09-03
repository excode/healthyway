/* eslint-disable @next/next/no-img-element */

import { GetLoginResponse } from "@lib/httpRequest";
import { UserData } from "@services/Login";
import { LangContext } from "hooks/lan";
import jwt_decode, { JwtPayload } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { AppTopbarRef } from "../types/types";
import { LayoutContext } from "./context/layoutcontext";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { i18n } = useTranslation();
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState<UserData>({ email: "" });
  const [selectedLang, setSelectedLang] = useState("ar");
  const { textFormat, setTextFormat } = useContext(LangContext);
  // const [textFormat, setTextFormat] = useState<string>("");
  // const lang = [{ name: "en" }, { name: "ar" }];
  const lang = ["ar", "en"];
  const changeLocale = (newLocale: string) => {
    router?.push(router.pathname, router.asPath, {
      locale: newLocale,
    });

    // console.log(i18n?.language);
    setSelectedLang(newLocale);
  };

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const role = ["Admin", "Kitchen", "Chef", "Customer"];

  // useEffect(() => {
  //   setCookie("lang", selectedLang);
  // }, []);

  useEffect(() => {
    const data: GetLoginResponse = cookies.user;
    let token: string = data?.accessToken || "";
    const decoded: UserData = jwt_decode<JwtPayload>(token) as UserData;
    setUserData(decoded);
    selectedLang === "ar" ? setTextFormat("rtl") : setTextFormat("ltr");
  }, [selectedLang]);

  const onPress = () => {
    removeCookie("user");
    router.push("/auth/login");
    // (router as any).push("/auth/login");
  };

  // console.log(userData);
  return (
    // <div dir={textFormat} className="layout-topbar flex align-items-center ">
    <div className="layout-topbar grid  ">
      <div className="flex md:col-9 lg:col-10">
        <Link href="/" className="layout-topbar-logo">
          <img
            src={`/layout/images/logo.png`}
            //   src={`/layout/images/logo-${
            //     layoutConfig.colorScheme !== "light" ? "white" : "dark"
            //   }.svg`}
            width={110}
            height="50px"
            alt="logo"
          />
          {/* <span>{config.title}</span> */}
        </Link>

        <button
          dir={textFormat}
          // dir={textFormat}
          ref={menubuttonRef}
          type="button"
          className="p-link layout-menu-button layout-topbar-button"
          onClick={onMenuToggle}
        >
          <i className="pi pi-bars" />
        </button>
      </div>

      <button
        dir={textFormat}
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        dir={textFormat}
        ref={topbarmenuRef}
        className={classNames(
          "layout-topbar-menu ",
          // `md:col-3 lg:col-2 flex justify-content-evenly`,
          {
            "layout-topbar-menu-mobile-active":
              layoutState.profileSidebarVisible,
          }
        )}
      >
        <div className="p-link layout-topbar-button flex gap-3 mx-2">
          <div className="">
            {userData.permissionLevel === 0 && (
              <img src="/layout/images/superAdmin.png" width={30} height={30} />
            )}
            {userData.permissionLevel === 1 && (
              <img src="/layout/images/kitchen.png" width={30} height={30} />
            )}
            {userData.permissionLevel === 2 && (
              <img src="/layout/images/chef.png" width={30} height={30} />
            )}
          </div>
          <div className="">
            <p className="mb-0">{userData.firstName}</p>
            <p>
              {userData.permissionLevel !== undefined &&
                role[userData.permissionLevel]}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onPress}
          className="p-link layout-topbar-button mr-4"
        >
          <i className="pi pi-sign-out"></i>
          {/* <span>Sign out</span> */}
        </button>
        {/* <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button> */}
        <Dropdown
          value={selectedLang}
          // onChange={(e) => setSelectedLang(e.value) }
          onChange={(e) => changeLocale(e.value)}
          options={lang}
          // optionLabel="name"
          //placeholder="Select a Country"
          // valueTemplate={selectedCountryTemplate}
          // itemTemplate={countryOptionTemplate}
          className="w-full md:w-7rem"
          // panelFooterTemplate={panelFooterTemplate}
        />
        <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
