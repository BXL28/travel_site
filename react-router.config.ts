import type { Config } from "@react-router/dev/config";
import { sentryOnBuildEnd } from "@sentry/react-router";
import { vercelPreset } from "@vercel/react-router/vite"; // Add this import

export default {
    // 1. Add the Vercel Preset here
    presets: [vercelPreset()],

    ssr: true,

    async buildEnd(args) {
        // 2. Keep your Sentry logic
        await sentryOnBuildEnd(args);
    },
} satisfies Config;