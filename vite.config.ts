import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter } from "@sentry/react-router";

export default defineConfig({
    plugins: [
        // Sentry must be at the top
        sentryReactRouter({
            org: "js-mastery-90g",
            project: "jsm-travel-agency",
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
        reactRouter(),
        tsconfigPaths(),
        tailwindcss(),
    ],
    optimizeDeps: {
        // Prevents "Named export not found" by pre-bundling CJS modules
        include: [
            '@syncfusion/ej2-base',
            '@syncfusion/ej2-react-buttons',
            '@syncfusion/ej2-react-grids',
            'appwrite'
        ],
    },
    ssr: {
        noExternal: [/@syncfusion/, 'appwrite'],
    },
    build: {
        sourcemap: true, // Required for Sentry
    }
});