import { DOWN, UP } from './constants/healthStatuses';

export default function HealthCheckHandler(options, providers) {
    const { timeout } = options;

    return function (req, res, next) {
        if (providers) {
            Promise.all(
                providers.map(
                    provider => Promise.race([
                        provider.check(),
                        new Promise(resolve => setTimeout(resolve, timeout, {
                            alive: false,
                            healthy: false,
                            response: 'Timeout'
                        }))
                    ]).then(response => ({ label: provider.Label, response }))
                )
            ).then((responses) => {
                const isHealthy = responses.every(({ response }) => response.alive && response.healthy);
                req._healthCheckResult = {
                    status: UP,
                    healthy: isHealthy,
                    results: responses
                };
                next();
            }).catch(error => {
                req._healthCheckResult = {
                    status: DOWN,
                    healthy: false,
                    response: error.message
                };
                next();
            });
        } else {
            req._healthCheckResult = {
                status: UP
            };
            next();
        }
    };
}