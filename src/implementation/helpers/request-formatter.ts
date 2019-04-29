import { IResponse } from "../../interfaces/2 - domain/models/response.interface";
import { OK, BAD_REQUEST, CREATED, SERVICE_UNAVAILABLE, NOT_FOUND } from "http-status-codes";
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

export function notFound(): IResponse<any> {
    return { statusCode: NOT_FOUND, errors: [
        {
            code: "notFound",
            message: "Não encontrado"
        }
    ] };
}

export function serviceUnavailable(): IResponse<any> {
    return { statusCode: SERVICE_UNAVAILABLE, errors: [
        {
            code: "unexpectedError",
            message: "Tente novamente mais tarde"
        }
    ] };
}