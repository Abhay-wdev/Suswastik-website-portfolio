import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const userJSON = localStorage.getItem("user");

  if (!userJSON) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userJSON);
  const allowedRoles = ["admin", "seller", "manager"];

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 🔥 MUST return Outlet so AdminLayout can appear
  return <Outlet />;
}
