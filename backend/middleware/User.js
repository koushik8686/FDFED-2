const loguserActions = (req, res, next) => {
    console.log(`[USER ROUTE] ${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
};

const userErrorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode);

    let customMessage;
    switch (statusCode) {
        case 404:
            customMessage = "Not Found - The requested resource could not be found. in user router";
            break;
        default:
            customMessage = "Internal Server Error - An unexpected error occurred. in user router";
            break;
    }

    res.json({ error: customMessage, details: err.message });
};

module.exports = { loguserActions, userErrorMiddleware };