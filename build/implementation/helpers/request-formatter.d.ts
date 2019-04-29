import { IResponse } from "../../interfaces/2 - domain/models/response.interface";
import { INotification } from "../../interfaces/2 - domain/models/notification.interface";
export declare function ok<TData>(data: TData): IResponse<TData>;
export declare function created<TData>(data: TData): IResponse<TData>;
export declare function badRequest(errors: INotification[]): IResponse<any>;
export declare function notFound(): IResponse<any>;
export declare function serviceUnavailable(): IResponse<any>;
