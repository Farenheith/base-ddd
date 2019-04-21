"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = {};
exports.Static = {
    get(key, getter) {
        let result = cache[key];
        if (result == undefined) {
            cache[key] = result = getter();
        }
        return result;
    },
    async getAsync(key, getter) {
        let result = cache[key];
        if (result == undefined) {
            cache[key] = result = await getter();
        }
        return result;
    }
};
