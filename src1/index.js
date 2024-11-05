/* eslint-disable sort-imports */
import BaseHealthProvider from './providers/BaseHealthProvider';
import HealthCheckHandler from './health-check-handler';
import HealthCheckLogger from './health-check-logger';
import HealthCheckResultPublisher from './health-check-result-publisher';
import NoCacheMiddleware from './middleware/middleware-no-cache';
import MongoDBNativeHealthProvider from './providers/MongoDBNativeHealthProvider';
import ServiceHealthProvider from './providers/ServiceHealthProvider';
import RedisCacheHealthProvider from './providers/RedisCacheHealthProvider';
import { getOptions } from './common';

export default function (options, providers) {
    if (providers &&
        Array.isArray(providers) &&
        !providers.every(provider => provider instanceof BaseHealthProvider)) {
        throw new TypeError('Invalid provider');
    }
    const _options = getOptions(options);
    return [
        NoCacheMiddleware(_options),
        HealthCheckHandler(_options, providers),
        HealthCheckLogger(_options),
        HealthCheckResultPublisher(_options)
    ];
}
export {
    BaseHealthProvider,
    MongoDBNativeHealthProvider,
    RedisCacheHealthProvider,
    ServiceHealthProvider
};
