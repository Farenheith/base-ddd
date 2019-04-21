export declare const ArrayHelper: {
    forEachAsync<T>(array: T[], callback: (item: T, index: number, array: T[]) => PromiseLike<boolean | void>): Promise<void>;
    everyAsync<T>(array: T[], callback: (item: T, index: number, array: T[]) => PromiseLike<boolean>): Promise<boolean>;
    someAsync<T>(array: T[], callback: (item: T, index: number, array: T[]) => PromiseLike<boolean>): Promise<boolean>;
};
