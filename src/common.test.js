/* eslint-disable no-magic-numbers */
import { isArray } from './common';

describe('Common utility', () => {
    test('isArray function should check if the value is an array', () => {
        expect(isArray([1, 2, 3])).toBe(true);
        expect(isArray({ 1: 1, 2: 2 })).toBe(false);
    });
});