import { ICommand, ICommandBodyless } from "../../interfaces/1 - application/command-interface";
import { IRequest, IRequestBodyless } from "../../interfaces/2 - domain/models/request.interface";
import { IBaseService } from "../../interfaces/2 - domain/services/base-service.interface";

import { INotificationService } from "../../interfaces/2 - domain/services/notification-service.interface";
import { IRequestInfo } from "../../interfaces/2 - domain/models/request-info.interface";
import { RequestInfoService } from "../2 - domain/services/request-info.service";
import { IResponse } from "../../interfaces/2 - domain/models/response.interface";
import { badRequest, ok } from "../helpers/request-formatter";
import { injectable } from "inversify";

@injectable()
export abstract class BaseCommandApplicationBase<TResult> {
    constructor(readonly notifications: INotificationService,
        readonly requestInfo: IRequestInfo) { }

    do(req: IRequestBodyless): PromiseLike<IResponse<TResult>> {
        this.prepareRequestInfo(req);

        return this.proceed(req).then(x => {
            if (this.notifications.hasNotification()) {
                return badRequest(this.notifications.getNotifications());
            } else {
                return this.success(x);
            }
        });
    }

    success(x: TResult | null): IResponse<TResult | null> {
        return ok(x);
    }

    prepareRequestInfo(req: IRequestBodyless) {
        if (this.requestInfo instanceof RequestInfoService) {
            this.requestInfo.set(req);
        }
    }

    abstract proceed(req: IRequestBodyless): PromiseLike<TResult | null>;
}

export abstract class BaseCommandBodylessApplication<TQueryString, TResult>
        extends BaseCommandApplicationBase<TResult>
        implements ICommandBodyless<TResult> {

    constructor(notifications: INotificationService, requestInfo: IRequestInfo,
            readonly service: IBaseService<TQueryString, TResult>) {
        super(notifications, requestInfo);
    }

    proceed(req: IRequestBodyless): PromiseLike<TResult | null> {
        return this.service.do(req.query as any);
    }
}

export abstract class BaseCommandApplication<TRequest, TResult>
        extends BaseCommandApplicationBase<TResult>
        implements ICommand<TRequest, TResult> {

    constructor(notifications: INotificationService, requestInfo: IRequestInfo,
            readonly service: IBaseService<TRequest, TResult>) {
        super(notifications, requestInfo);
    }

    proceed(req: IRequest<TRequest>): PromiseLike<TResult | null> {
        return this.service.do(req.data);
    }
}