// import { Navigate } from "react-router-dom";
// import { useAppContext } from "../../context/AppContext";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const { user, hasRole } = useAppContext();

//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   if (allowedRoles && allowedRoles.length > 0) {
//     const isAuthorized = allowedRoles.some((role) => hasRole(role));
//     if (!isAuthorized) {
//       return <Navigate to="/" replace />;
//     }
//   }

//   return children;
// }


import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, hasRole, loading } = useAppContext();

  // ⛔ WAIT UNTIL AUTH IS READY
  if (loading) return null; // or a spinner

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles?.length) {
    const isAuthorized = allowedRoles.some((role) => hasRole(role));

    if (!isAuthorized) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}