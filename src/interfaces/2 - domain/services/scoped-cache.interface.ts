export interface IScopedCache {
    get<TResult>(key: string, getter: () => TResult): TResult;
    getAsync<TResult>(key: string, getter: () => PromiseLike<TResult>): PromiseLike<TResult>;
}