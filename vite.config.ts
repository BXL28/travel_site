import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// Fix: Import from the main package if subpaths like /vite aren't found
import { sentryReactRouter } from "@sentry/react-router";

export default defineConfig((config) => {
    return {
        plugins: [
            // Provide BOTH arguments: (options, viteConfig)
            sentryReactRouter({
                org: "js-mastery-90g",
                project: "jsm-travel-agency",
                authToken: process.env.SENTRY_AUTH_TOKEN,
            }, config),
            reactRouter(),
            tsconfigPaths(),
            tailwindcss(),
        ],
        // ... rest of your config
        build: {
            sourcemap: true, // Required for Sentry to work
        }
    };
});