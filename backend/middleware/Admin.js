const logAdminActions = (req, res, next) => {
    console.log(`[ADMIN ROUTE] ${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
};

const AdminErrorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode);

    let customMessage;
    switch (statusCode) {
        case 400:
            customMessage = "Bad Request - The server could not understand the request.  in admin router";
            break;
        case 401:
            customMessage = "Unauthorized - Access is denied due to invalid credentials. in admin router";
            break;
        case 403:
            customMessage = "Forbidden - You don't have permission to access this resource. in admin router";
            break;
        case 404:
            customMessage = "Not Found - The requested resource could not be found. in admin router";
            break;
        default:
            customMessage = "Internal Server Error - An unexpected error occurred. in admin router";
            break;
    }

    res.json({ error: customMessage, details: err.message });
};

module.exports = { logAdminActions, AdminErrorMiddleware };