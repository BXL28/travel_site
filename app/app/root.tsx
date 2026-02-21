import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import BackgroundSlideshow from "./BackgroundSlideshow";
import type { Route } from "./+types/root";
import "./app.css";
import * as Sentry from "@sentry/react-router";
export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,opsz,wght@0,14,100;0,14,200;0,14,300;0,14,400;0,14,500;0,14,600;0,14,700;0,14,800;0,14,900;1,14,100;1,14,200;1,14,300;1,14,400;1,14,500;1,14,600;1,14,700;1,14,800;1,14,900&display=swap",
    },
];


import {registerLicense} from "@syncfusion/ej2-base"
registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY)

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">

        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
        </head>
        <body>
        {/* Ensure BackgroundSlideshow is rendered outside children */}
        <div className="fixed inset-0 -z-10">

        </div>
        {children}
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}

export default function App() {
    return (



            <main className="relative z-10">
                <Outlet />
            </main>
    );
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
      Sentry.captureException(error);
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}