import { IResponse } from "../../interfaces/2 - domain/models/response.interface";
import { OK, BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { INotification } from "../../interfaces/2 - domain/models/notification.interface";

export function ok<TData>(data: TData): IResponse<TData> {
    return { statusCode: OK, data };
}

export function created<TData>(data: TData): IResponse<TData> {
    return { statusCode: CREATED, data };
}

export function badRequest(errors: INotification[]): IResponse<any> {
    return { statusCode: BAD_REQUEST, errors };
}

export function internalServerError<TData>(errors: INotification[]): IResponse<TData> {
    return { statusCode: INTERNAL_SERVER_ERROR, errors };
}