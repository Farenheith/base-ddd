import { IBaseService } from "../../../interfaces/2 - domain/services/base-service.interface";
import { INotificationService } from "../../../interfaces/2 - domain/services/notification-service.interface";
import { injectable } from "inversify";
import * as joi from "joi";
import { IRequestInfo } from "../../../interfaces/2 - domain/models/request-info.interface";
import { Static } from "./static-service";

@injectable()
export abstract class BaseService<TData, TResponse> implements IBaseService<TData, TResponse> {
    readonly schema: { [key in keyof TData]: joi.Schema  }

    constructor(readonly entityName: string,
        readonly notifications: INotificationService,
        readonly settings: IRequestInfo) {

        this.schema = Static.get(entityName, this.getJoi);
    }

    do(data: TData): PromiseLike<TResponse | null> {
        if (this.validate(data, this.schema)) {
            return this.proceed(data);
        }

        return Promise.resolve(null);
    }

    abstract proceed(data: TData): PromiseLike<TResponse>;

    validate(value: TData, schema: { [key in keyof TData]: joi.Schema  }): boolean {
        const validation = joi.validate(value, schema, {
            language: this.settings.language
        });

        if (validation.error) {
            validation.error.details.forEach(detail => {
                this.message(detail.message, detail.type, detail.context!.key as any);
            });
        }

        return this.hasNotification();
    }

    message(message: string, code: string, field?: keyof TResponse | string) {
        this.notifications.add(message, code, field as string | undefined);
    }

    hasNotification() {
        return this.notifications.hasNotification();
    }

    joi() {
        return joi;
    }

    abstract getJoi(): any;
}