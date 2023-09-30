type Config = {
  serverURI: string;
  title: string;
  fixedLayout: boolean;
  hideLogoOnMobile: boolean;
  multiLanguageSupport: boolean;
  jwt_secret: string;
};

const config: Config = {
  serverURI: "https://dev.ikra.my",
  // serverURI: "http://localhost:8080",
  title: "Meal Delivery & Subscription",
  fixedLayout: false,
  hideLogoOnMobile: false,
  multiLanguageSupport: false,
  jwt_secret: "654321",
};

export default config;
