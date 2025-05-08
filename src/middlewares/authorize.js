const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        isSuccess: false,
        statusCode: 403,
        message: "Access denied! You can't access this route!",
      });
    }
    next();
  };

module.exports = authorize;
