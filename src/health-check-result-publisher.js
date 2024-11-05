export default function HealthCheckResultPublisher(options) {
    return function (req, res) {
        const result = Object.assign(
            req._healthCheckResult,
            {
                name: options.name,
                version: options.version
            }
        );

        if (options.usage === true) {
            Object.assign(result, {
                uptime: process.uptime(),
                usage: {
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage()
                }
            });
        }

        if (req._healthCheckResult.results && (req._healthCheckResult.results.length > 0)) {
            Object.assign(result, {
                results: undefined,
                subSystems: req._healthCheckResult.results.reduce(
                    (result, { label, response }) => Object.assign(result, { [label]: response }), {}
                )
            });
        }

        res.json(result);
    };
}