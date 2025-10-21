import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix for workspace root warning
  // Option A: Delete C:\Users\marke\package-lock.json (recommended)
  // Option B: Set outputFileTracingRoot (implemented below)
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    // Exclude .svg from default file loader
    const fileLoaderRule = config.module.rules.find(
      // @ts-ignore
      (rule) => rule.test && rule.test.test && rule.test.test(".svg")
    );
    if (fileLoaderRule) {
      // @ts-ignore
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Use SVGR for .svg imports in TS/JS
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });

    return config;
  },
};

export default nextConfig;
