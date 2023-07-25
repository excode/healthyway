const { i18n } = require("./next-i18next.config");
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  publicRuntimeConfig: {
    contextPath: process.env.NODE_ENV === "production" ? "" : "",
    uploadPath: process.env.NODE_ENV === "production" ? "" : "/api/upload",
  },
};

module.exports = nextConfig;
