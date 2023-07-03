type Config = {
  serverURI: string;
  fixedLayout: boolean;
  hideLogoOnMobile: boolean;
  multiLanguageSupport: false;
  jwt_secret: string;
};

export default {
  serverURI: "https://dev.ikra.my",
  // serverURI: "http://localhost:8082",
  title: "Meal Delivery & Subscription",
  fixedLayout: false,
  hideLogoOnMobile: false,
  multiLanguageSupport: false,
  jwt_secret: "654321",
};
