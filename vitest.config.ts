import { defineConfig } from "vitest/config";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./app/setUpTests.ts",
    globals: true,
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
