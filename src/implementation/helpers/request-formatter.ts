import { IResponse } from "../../interfaces/2 - domain/models/response.interface";
import { OK, BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE } from "http-status-codes";
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

export function serviceUnavailable<TData>(): IResponse<TData> {
    return { statusCode: SERVICE_UNAVAILABLE, errors: [
        {
            code: "unexpectedError",
            message: "Tente novamente mais tarde"
        }
    ] };
}