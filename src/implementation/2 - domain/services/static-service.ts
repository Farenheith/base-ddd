const cache: any = {};

export const Static = {
    get<TData>(key: string, getter: () => TData): TData {
        const result = cache[key];

        if (result == undefined) {
            cache[key] = getter();
        }

        return result;
    },

    async getAsync<TData>(key: string, getter: () => PromiseLike<TData>): Promise<TData> {
        const result = cache[key];

        if (result == undefined) {
            cache[key] = await getter();
        }

        return result;
    }
}