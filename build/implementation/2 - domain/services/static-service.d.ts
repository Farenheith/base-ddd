export declare const Static: {
    get<TData>(key: string, getter: () => TData): TData;
    getAsync<TData>(key: string, getter: () => PromiseLike<TData>): Promise<TData>;
};
