import { IScopedCache } from "../../../interfaces/2 - domain/services/scoped-cache.interface";
export declare class ScopedCacheService implements IScopedCache {
    private cache;
    get<TData>(key: string, getter: () => TData): TData;
    getAsync<TData>(key: string, getter: () => PromiseLike<TData>): Promise<TData>;
}
