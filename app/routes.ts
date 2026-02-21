import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
    // 1. Landing Page (The "/" path)
    index("routes/root/landing-page.tsx"),

    // 2. Sign In (Flat path)
    route("sign-in", "routes/root/sign-in.tsx"),

    // 3. API Route
    route("api/create-trip", "routes/api/create-trip.ts"),

    // 4. Admin Section
    layout("routes/admin/admin-layout.tsx", [
        // REMOVE leading slashes here so they become /dashboard, /trips, etc.
        route("dashboard", "routes/admin/dashboard.tsx"),
        route("all-users", "routes/admin/all-users.tsx"),
        route("trips", "routes/admin/trips.tsx"),
        route("travel/create", "routes/admin/create-trip.tsx"),
        route("trips/:tripId", "routes/admin/trip-detail.tsx"),
    ]),
] satisfies RouteConfig;