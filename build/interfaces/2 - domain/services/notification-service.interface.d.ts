import { INotification } from "../models/notification.interface";
export interface INotificationService {
    add(message: string, code: string, field?: string): void;
    hasNotification(): boolean;
    getNotifications(): INotification[];
}
