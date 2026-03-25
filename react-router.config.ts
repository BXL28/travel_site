import type { Config } from "@react-router/dev/config";
import { sentryOnBuildEnd } from "@sentry/react-router";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
    appDirectory: "app",
    presets: [vercelPreset()],
    ssr: true,
    // Avoid duplicate React after Vite dependency re-optimization (fixes
    // "Cannot read properties of null (reading 'useContext')" on first load)
    future: {
        unstable_optimizeDeps: true,
    },

    async buildEnd(args) {
        // Now that viteConfig is linked, this only needs 1 argument
        await sentryOnBuildEnd(args);
    },
} satisfies Config;