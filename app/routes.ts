import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
  
  // Protected Routes wrapped in ProtectedRoute layout
  layout("components/ProtectedRoute.tsx", [
    route("/upload", "routes/upload.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/resume/:id", "routes/resume.$id.tsx"),
  ]),
] satisfies RouteConfig;
