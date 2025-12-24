const cache = new Map();

export const cacheMiddleware = (duration = 60) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') return next();

        const key = req.originalUrl;
        const cached = cache.get(key);

        if (cached && Date.now() < cached.expiry) {
            console.log(`  Cache HIT: ${key}`);
            return res.json(cached.data);
        }

        // Override res.json to cache the response
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            cache.set(key, {
                data,
                expiry: Date.now() + (duration * 1000)
            });
            console.log(`  Cache SET: ${key} (expires in ${duration}s)`);
            return originalJson(data);
        };

        next();
    };
};

// Clear cache when posts are modified
export const clearCache = (pattern = null) => {
    if (pattern) {
        for (const key of cache.keys()) {
            if (key.includes(pattern)) {
                cache.delete(key);
            }
        }
    } else {
        cache.clear();
    }
    console.log('  Cache cleared');
};
