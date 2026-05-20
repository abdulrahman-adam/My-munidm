
// Middleware dynamique pour tous les rôles.


export const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} not allowed`,
      });
    }

    next();
  };
};