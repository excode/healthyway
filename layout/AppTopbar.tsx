/* eslint-disable @next/next/no-img-element */

import config from "@config/index";
import { GetLoginResponse } from "@lib/httpRequest";
import { UserData } from "@services/Login";
import jwt_decode, { JwtPayload } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
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
import { AppTopbarRef } from "../types/types";
import { LayoutContext } from "./context/layoutcontext";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState<UserData>({ email: "" });

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));
  useEffect(() => {
    const data: GetLoginResponse = cookies.user;
    let token: string = data?.accessToken || "";
    const decoded: UserData = jwt_decode<JwtPayload>(token) as UserData;
    setUserData(decoded);
  }, []);
  const onPress = () => {
    removeCookie("user");
    router.push("/auth/login");
  };

  console.log(userData);
  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img
          src={`/layout/images/logo.png`}
          //   src={`/layout/images/logo-${
          //     layoutConfig.colorScheme !== "light" ? "white" : "dark"
          //   }.svg`}
          width="50px"
          height={"50px"}
          alt="logo"
        />
        <span>{config.title}</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <span className="p-link layout-topbar-button flex gap-2 mr-2">
          {userData.permissionLevel === 0 && (
            <img src="/layout/images/superAdmin.png" width={30} height={30} />
          )}
          {userData.permissionLevel === 1 && (
            <img src="/layout/images/kitchen.png" width={30} height={30} />
          )}
          {userData.permissionLevel === 2 && (
            <img src="/layout/images/chef.png" width={30} height={30} />
          )}
          {userData.firstName} {userData.lastName}
        </span>
        <button
          type="button"
          onClick={onPress}
          className="p-link layout-topbar-button"
        >
          <i className="pi pi-sign-out"></i>
          <span>Sign out</span>
        </button>
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
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
