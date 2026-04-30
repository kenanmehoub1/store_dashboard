// prisma.config.ts (في جذر المشروع، وليس داخل مجلد prisma)
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
