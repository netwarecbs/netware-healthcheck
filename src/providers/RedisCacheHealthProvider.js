import BaseHealthProvider from './BaseHealthProvider';
import { isNullOrWhiteSpace } from '../common';
import RedisStatus from 'redis-status';

class RedisCacheHealthProvider extends BaseHealthProvider {
    constructor(label, config) {
        if (isNullOrWhiteSpace(label)) {
            throw new TypeError('Label is required');
        }

        if (isNullOrWhiteSpace(config)) {
            throw new TypeError('Configuration is required');
        }
        super('redis health', 'Redis Cache health provider', ['cache', 'paas']);
        this._label = label;
        this._config = config;
    }

    get Label() {
        return this._label;
    }
    get Config() {
        return this._config;
    }

    check() {
        return new Promise((resolve) => {
            const redisStatus = RedisStatus(this.Config);
            redisStatus.checkStatus(function (error) {
                if (error) {
                    resolve({
                        alive: true,
                        healthy: false,
                        response: error
                    });
                } else {
                    resolve({
                        alive: true,
                        healthy: true
                    });
                }
            });
        });
    }
}

export default RedisCacheHealthProvider;