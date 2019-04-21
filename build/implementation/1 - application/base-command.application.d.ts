import { ICommand, ICommandBodyless } from "../../interfaces/1 - application/command-interface";
import { IRequest, IRequestBodyless } from "../../interfaces/2 - domain/models/request.interface";
import { IBaseService } from "../../interfaces/2 - domain/services/base-service.interface";
import { INotificationService } from "../../interfaces/2 - domain/services/notification-service.interface";
import { IRequestInfo } from "../../interfaces/2 - domain/models/request-info.interface";
import { IResponse } from "../../interfaces/2 - domain/models/response.interface";
export declare abstract class BaseCommandApplicationBase<TResult> {
    readonly notifications: INotificationService;
    readonly requestInfo: IRequestInfo;
    constructor(notifications: INotificationService, requestInfo: IRequestInfo);
    do(req: IRequestBodyless): PromiseLike<IResponse<TResult>>;
    success(x: TResult | null): IResponse<TResult | null>;
    prepareRequestInfo(req: IRequestBodyless): void;
    abstract proceed(req: IRequestBodyless): PromiseLike<TResult | null>;
}
export declare abstract class BaseCommandBodylessApplication<TQueryString, TResult> extends BaseCommandApplicationBase<TResult> implements ICommandBodyless<TResult> {
    readonly service: IBaseService<TQueryString, TResult>;
    constructor(notifications: INotificationService, requestInfo: IRequestInfo, service: IBaseService<TQueryString, TResult>);
    proceed(req: IRequestBodyless): PromiseLike<TResult | null>;
}
export declare abstract class BaseCommandApplication<TRequest, TResult> extends BaseCommandApplicationBase<TResult> implements ICommand<TRequest, TResult> {
    readonly service: IBaseService<TRequest, TResult>;
    constructor(notifications: INotificationService, requestInfo: IRequestInfo, service: IBaseService<TRequest, TResult>);
    proceed(req: IRequest<TRequest>): PromiseLike<TResult | null>;
}
