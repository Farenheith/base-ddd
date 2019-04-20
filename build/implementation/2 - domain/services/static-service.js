"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = {};
exports.Static = {
    get(key, getter) {
        const result = cache[key];
        if (result == undefined) {
            cache[key] = getter();
        }
        return result;
    },
    async getAsync(key, getter) {
        const result = cache[key];
        if (result == undefined) {
            cache[key] = await getter();
        }
        return result;
    }
};
