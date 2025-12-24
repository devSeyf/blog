export const requestLogger = (req, res, next) => {
    const start = performance.now();

    // Log incoming request
    console.log(`  ${req.method} ${req.url}`);

    // Capture response
    const originalSend = res.send;
    const originalJson = res.json;

    const logResponse = (data) => {
        const duration = performance.now() - start;
        const size = typeof data === 'string' ? data.length : JSON.stringify(data).length;

        console.log(`  ${req.method} ${req.url} - ${res.statusCode} - ${Math.round(duration)}ms - ${(size / 1024).toFixed(2)}KB`);

        // Warn if slow
        if (duration > 500) {
            console.warn(`⚠️  SLOW REQUEST: ${req.method} ${req.url} took ${Math.round(duration)}ms`);
        }
    };

    res.send = function (data) {
        logResponse(data);
        return originalSend.call(this, data);
    };

    res.json = function (data) {
        logResponse(data);
        return originalJson.call(this, data);
    };

    next();
};
