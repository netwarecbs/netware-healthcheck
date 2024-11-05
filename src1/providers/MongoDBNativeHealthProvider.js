import BaseHealthProvider from './BaseHealthProvider';
import { isNullOrWhiteSpace } from '../common';
import mongodb from 'mongodb';

class MongoDBNativeHealthProvider extends BaseHealthProvider {
    constructor(label, config) {
        if (isNullOrWhiteSpace(label)) {
            throw new TypeError('Label is required');
        }

        if (isNullOrWhiteSpace(config)) {
            throw new TypeError('Configuration is required');
        }
        super('mongodb-health', 'MongoDB health provider', ['database']);
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
            const mongoClient = new mongodb.MongoClient(this.Config.uri, this.Config.options);

            mongoClient.connect(function (error, client) { //eslint-disable-line no-unused-vars
                mongoClient.close();
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

export default MongoDBNativeHealthProvider;
