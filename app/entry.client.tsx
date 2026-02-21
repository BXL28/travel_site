import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { registerLicense } from '@syncfusion/ej2-base'; // Import this

// 1. Register the license using your Environment Variable
const syncKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY;

if (syncKey) {
    registerLicense(syncKey);
} else {
    console.warn("Syncfusion license key is missing! Check your .env.local file.");
}

Sentry.init({
    dsn: "https://1d2535740ba31b0a4611fc5545f056c0@o4509839524495360.ingest.us.sentry.io/4509862048694272",
    sendDefaultPii: true,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <HydratedRouter />
        </StrictMode>
    );
});