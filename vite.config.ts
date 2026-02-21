import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {sentryReactRouter, type SentryReactRouterBuildOptions} from "@sentry/react-router";

const sentryConfig: SentryReactRouterBuildOptions = {
    org: "js-mastery-90g",
    project: "jsm-travel-agency",
    // An auth token is required for uploading source maps.
    authToken: "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"
    // ...
};

export default defineConfig({
    plugins: [reactRouter(), tsconfigPaths()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Put all Syncfusion packages into one 'vendor' chunk
                    'syncfusion': [
                        '@syncfusion/ej2-react-grids',
                        '@syncfusion/ej2-react-buttons',
                        '@syncfusion/ej2-react-navigations',
                        '@syncfusion/ej2-react-charts',
                        '@syncfusion/ej2-react-dropdowns'
                    ],
                },
            },
        },
    },
});
