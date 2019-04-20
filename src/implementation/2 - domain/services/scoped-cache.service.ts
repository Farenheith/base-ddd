import { IScopedCache } from "../../../interfaces/2 - domain/services/scoped-cache.interface";

export class ScopedCacheService implements IScopedCache {
    private cache: any = {};

    get<TData>(key: string, getter: () => TData): TData {
        const result = this.cache[key];

        if (result == undefined) {
            this.cache[key] = getter();
        }

        return result;
    }

    async getAsync<TData>(key: string, getter: () => PromiseLike<TData>): Promise<TData> {
        const result = this.cache[key];

        if (result == undefined) {
            this.cache[key] = await getter();
        }

        return result;
    }
}