const createNextIntlPlugin = require("next-intl/plugin");
const createMDX = require("@next/mdx");

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({
  // 添加 MDX 选项（如果需要）
  options: {
    // 如果您想使用 remark 或 rehype 插件，可以在这里添加
  },
});

/** @type {require('next').NextConfig} */
const WEBSITE_CDN = process.env.NEXT_PUBLIC_CDN;
const nextConfig = {
  experimental: {
    cssChunking: true, // default
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // 生产环境移除 console
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: WEBSITE_CDN,
      },
    ],
  },
  // 启用 MDX 页面
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

// 使用 withMDX 和 withNextIntl 包装配置
module.exports = withNextIntl(withMDX(nextConfig));
