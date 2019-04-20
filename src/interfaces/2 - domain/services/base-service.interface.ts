export interface IBaseService<TData, TResponse> {
    do(data: TData): PromiseLike<TResponse | null>;
}