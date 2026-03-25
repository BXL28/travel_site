import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
    route("api/create-trip", "routes/api/create-trip.ts"),

    layout("routes/admin/admin-layout.tsx", [
        index("routes/admin/dashboard.tsx"),
        route("trips", "routes/admin/trips.tsx"),
        route("travel/create", "routes/admin/create-trip.tsx"),
        route("trips/:tripId", "routes/admin/trip-detail.tsx"),
    ]),

    route("dashboard", "routes/redirect-dashboard.tsx"),
    route("sign-in", "routes/redirect-sign-in.tsx"),
    route("all-users", "routes/redirect-all-users.tsx"),
] satisfies RouteConfig;
