import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  basename: process.env.ENV === "prod" ? "/front-end-cording-test-1/" : "/",
} satisfies Config;
