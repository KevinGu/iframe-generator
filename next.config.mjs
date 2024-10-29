import createNextIntlPlugin from "next-intl/plugin";
import createMDX from '@next/mdx';

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({
  // 添加 MDX 选项（如果需要）
  options: {
    // 如果您想使用 remark 或 rehype 插件，可以在这里添加
  },
});

/** @type {import('next').NextConfig} */
const WEBSITE_CDN = process.env.NEXT_PUBLIC_CDN;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: WEBSITE_CDN,
      },
    ],
  },
  // 启用 MDX 页面
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

// 使用 withMDX 和 withNextIntl 包装配置
export default withNextIntl(withMDX(nextConfig));
