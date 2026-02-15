<<<<<<< HEAD
import { defineConfig } from "vitest/config";

export default defineConfig({
=======
import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
>>>>>>> b4c7c5c (feat: integrate AddTodo with localStorage on main page (#10))
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
