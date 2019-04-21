import { IBaseService } from "../../../interfaces/2 - domain/services/base-service.interface";
import { INotificationService } from "../../../interfaces/2 - domain/services/notification-service.interface";
import * as joi from "joi";
import { IRequestInfo } from "../../../interfaces/2 - domain/models/request-info.interface";
export declare abstract class BaseService<TData, TResponse> implements IBaseService<TData, TResponse> {
    readonly entityName: string;
    readonly notifications: INotificationService;
    readonly settings: IRequestInfo;
    readonly schema: {
        [key in keyof TData]: joi.Schema;
    };
    constructor(entityName: string, notifications: INotificationService, settings: IRequestInfo);
    do(data: TData): PromiseLike<TResponse | null>;
    abstract proceed(data: TData): PromiseLike<TResponse>;
    validate(value: TData, schema: {
        [key in keyof TData]: joi.Schema;
    }): boolean;
    message(message: string, code: string, field: keyof TResponse): void;
    hasNotification(): boolean;
    abstract getJoi(): {
        [key in keyof TData]: joi.Schema;
    };
}
