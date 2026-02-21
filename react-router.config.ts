import type { Config } from "@react-router/dev/config";
import { sentryOnBuildEnd } from "@sentry/react-router";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
    appDirectory: "app",
    presets: [vercelPreset()],
    ssr: true,

    async buildEnd(args) {
        // Now that viteConfig is linked, this only needs 1 argument
        await sentryOnBuildEnd(args);
    },
} satisfies Config;