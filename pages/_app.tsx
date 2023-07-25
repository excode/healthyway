// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "font-awesome/css/font-awesome.css";
import { LangProvider } from "hooks/lan";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import { CookiesProvider } from "react-cookie";
import { LayoutProvider } from "../layout/context/layoutcontext";
import Layout from "../layout/layout";
import "../styles/demo/Demos.scss";
import "../styles/layout/layout.scss";
import type { Page } from "../types/types";
type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  if (Component.getLayout) {
    return (
      <CookiesProvider>
        <LayoutProvider>
          {Component.getLayout(<Component {...pageProps} />)}
        </LayoutProvider>
      </CookiesProvider>
    );
  } else {
    return (
      <CookiesProvider>
        <LayoutProvider>
          <LangProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LangProvider>
        </LayoutProvider>
      </CookiesProvider>
    );
  }
}
export default appWithTranslation(MyApp);
