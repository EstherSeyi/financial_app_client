import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/",
    viewportWidth: 1280,
    viewportHeight: 768,
    specPattern: "**/*.cy.ts",
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on) {
      // implement node event listeners here
      on(
        "file:preprocessor",
        vitePreprocessor(path.resolve(__dirname, "./vite.config.ts"))
      );
    },
  },
});
