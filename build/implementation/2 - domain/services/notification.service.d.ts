import { INotificationService } from "../../../interfaces/2 - domain/services/notification-service.interface";
import { INotification } from "../../../interfaces/2 - domain/models/notification.interface";
export declare class NotificationService implements INotificationService {
    readonly notifications: INotification[];
    add(message: string, code: string, field?: string | undefined): void;
    hasNotification(): boolean;
    getNotifications(): INotification[];
}
