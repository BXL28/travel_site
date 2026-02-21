import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// Replace the previous Sentry import with this:
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
    plugins: [
        sentryVitePlugin({
            org: "js-mastery-90g",
            project: "jsm-travel-agency",
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
        reactRouter(),
        tsconfigPaths(),
        tailwindcss(),
    ],
    optimizeDeps: {
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
        sourcemap: true,
    }
});