import { DEFAULT_OPTIONS } from './constants/application';

export function isArray(value) {
    return Array.isArray(value);
}

export function isBoolean(value) {
    return (typeof value === 'boolean');
}

export function isNumber(value) {
    return (typeof value === 'number');
}

export function isString(value) {
    return (typeof value === 'string');
}

// export function isDate(value) {
//     return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').isValid();
// }

export function isNullOrUndefined(value) {
    return (value === undefined) || (value === null);
}

export function isNullOrWhiteSpace(value) {
    if (isNullOrUndefined(value)) {
        return true;
    } else if (isString(value)) {
        return value.trim().length === 0;
    } else {
        return value.toString().trim().length === 0;
    }
}

export function getOptions(options) {
    const _options = Object.assign({}, options);
    if (!isNullOrUndefined(_options.log)) {
        _options.log = Object.assign({}, DEFAULT_OPTIONS.log, _options.log);
    }
    return Object.assign({}, DEFAULT_OPTIONS, _options);
}
