"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScopedCacheService {
    constructor() {
        this.cache = {};
    }
    get(key, getter) {
        const result = this.cache[key];
        if (result == undefined) {
            this.cache[key] = getter();
        }
        return result;
    }
    async getAsync(key, getter) {
        const result = this.cache[key];
        if (result == undefined) {
            this.cache[key] = await getter();
        }
        return result;
    }
}
exports.ScopedCacheService = ScopedCacheService;
