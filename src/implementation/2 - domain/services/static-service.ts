const cache: any = {};

export const Static = {
    get<TData>(key: string, getter: () => TData): TData {
        let result = cache[key];

        if (result == undefined) {
            cache[key] = result = getter();
        }

        return result;
    },

    async getAsync<TData>(key: string, getter: () => PromiseLike<TData>): Promise<TData> {
        let result = cache[key];

        if (result == undefined) {
            cache[key] = result = await getter();
        }

        return result;
    }
}