import { IScopedCache } from "../../../interfaces/2 - domain/services/scoped-cache.interface";
import { injectable } from "inversify";

@injectable()
export class ScopedCacheService implements IScopedCache {
    private cache: any = {};

    get<TData>(key: string, getter: () => TData): TData {
        let result = this.cache[key];

        if (result == undefined) {
            this.cache[key] = result = getter();
        }

        return result;
    }

    async getAsync<TData>(key: string, getter: () => PromiseLike<TData>): Promise<TData> {
        let result = this.cache[key];

        if (result == undefined) {
            this.cache[key] = result = await getter();
        }

        return result;
    }
}