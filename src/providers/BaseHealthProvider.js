import { isArray, isNullOrWhiteSpace } from '../common';

class BaseHealthProvider {
    constructor(id, name, tags) {
        if (
            isNullOrWhiteSpace(id) ||
            isNullOrWhiteSpace(name) ||
            !isArray(tags)
        ) {
            throw new TypeError('Invalid arguments!');
        }

        this._id = id;
        this._name = name;
        this._tags = tags;
    }

    get Id() {
        return this._id;
    }

    get Name() {
        return this._name;
    }

    get Tags() {
        return this._tags;
    }

    check() {
        throw new Error(`Health check routine not implemented for ${this.Name}.`);
    }
}

export default BaseHealthProvider;