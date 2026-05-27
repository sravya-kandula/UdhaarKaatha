// ROLE AUTHORIZATION MIDDLEWARE

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // check role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};
