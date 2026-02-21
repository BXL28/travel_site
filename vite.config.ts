import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter } from "@sentry/react-router";

export default defineConfig((config) => {
    return {
        plugins: [
            sentryReactRouter({
                org: "js-mastery-90g",
                project: "jsm-travel-agency",
                authToken: process.env.SENTRY_AUTH_TOKEN,
            }, config),
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
            rollupOptions: {
                onwarn(warning, warn) {
                    // This silences the specific sourcemap warnings that crash Vercel
                    if (warning.code === 'SOURCEMAP_ERROR') return;
                    warn(warning);
                },
            },
        },
    };
});