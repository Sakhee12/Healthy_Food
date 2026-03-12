const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate and authorize based on roles
 * @param {...string} allowedRoles - List of roles permitted to access the route
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // Development bypass (Optional: remove in production)
        if (token === "dev_token_bypass") {
            req.user = { id: 1, role: "superadmin" };
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // If no roles specified, just authenticate (allow any logged in user)
            if (allowedRoles.length === 0) {
                return next();
            }

            // Check if user's role is in the allowed list
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: `Access denied. Role '${req.user.role}' is not authorized for this action.`
                });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: "Token is not valid" });
        }
    };
};

/**
 * Middleware to optionally authenticate (decode token if present)
 */
const authenticateOptional = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return next();
    }

    // Development bypass
    if (token === "dev_token_bypass") {
        req.user = { id: 1, role: "superadmin" };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // If token is invalid, we still proceed but without req.user
        next();
    }
};

module.exports = { authorizeRoles, authenticateOptional };
