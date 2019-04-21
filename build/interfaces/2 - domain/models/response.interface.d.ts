import { INotification } from "./notification.interface";
export interface IResponse<TData> {
    statusCode: number;
    data?: TData;
    errors?: INotification[];
}
