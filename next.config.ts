import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

// Load frontend environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.frontend") });

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SEMANTIC_SCHOLAR_API_KEY: process.env.SEMANTIC_SCHOLAR_API_KEY,
  },
};

export default nextConfig;
