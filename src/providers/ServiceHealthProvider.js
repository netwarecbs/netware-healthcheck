import axios from 'axios';
import BaseHealthProvider from './BaseHealthProvider';
import { GET } from '../constants/httpVerbs';
import { isNullOrWhiteSpace } from '../common';
import { OK } from '../constants/httpStatusCodes';

class ServiceHealthProvider extends BaseHealthProvider {
    constructor(label, url, method = GET) {
        if (isNullOrWhiteSpace(label)) {
            throw new TypeError('Label is required');
        }

        if (isNullOrWhiteSpace(url)) {
            throw new TypeError('URL is required');
        }
        super('service-health', 'Service health provider', ['service']);
        this._label = label;
        this._url = url;
        this._method = method;
    }

    get Label() {
        return this._label;
    }
    get URL() {
        return this._url;
    }
    get Method() {
        return this._method;
    }

    check() {
        return new Promise((resolve) => {
            axios({
                url: this.URL,
                method: this.Method
            }).then(({ data, status }) => {
                if ((status === OK) && (data.status.toUpperCase() === 'UP')) {
                    resolve({
                        alive: true,
                        healthy: true,
                        response: data
                    });
                } else {
                    resolve({
                        alive: true,
                        healthy: false,
                        response: data
                    });
                }
            }).catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    resolve({
                        alive: false,
                        healthy: false,
                        response: `Bad response. Status: ${error.response.status}`
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    resolve({
                        alive: false,
                        healthy: false,
                        response: 'No response.'
                    });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    resolve({
                        alive: false,
                        healthy: false,
                        response: error.message
                    });
                }
            });
        });
    }
}

export default ServiceHealthProvider;