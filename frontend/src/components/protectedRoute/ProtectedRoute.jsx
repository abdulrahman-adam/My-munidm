import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, hasRole } = useAppContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAuthorized = allowedRoles.some((role) => hasRole(role));
    if (!isAuthorized) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}