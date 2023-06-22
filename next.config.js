/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '' : '/api/upload'
    },
};

module.exports = nextConfig;
