import type { Config } from "@react-router/dev/config";
import { sentryOnBuildEnd } from "@sentry/react-router";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
    // Explicitly define the app directory to fix the "Could not find root route" error
    appDirectory: "app",

    presets: [vercelPreset()],

    ssr: true,

    async buildEnd(args) {
        await sentryOnBuildEnd(args);
    },
} satisfies Config;