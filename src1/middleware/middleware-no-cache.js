export default function NoCacheMiddleware() {
    return function (req, res, next) {
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': '0',
            'Pragma': 'no-cache'
        });
        next();
    };
}
