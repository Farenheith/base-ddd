import { INotificationService } from "../../../interfaces/2 - domain/services/notification-service.interface";
import { INotification } from "../../../interfaces/2 - domain/models/notification.interface";
import { injectable } from "inversify";

@injectable()
export class NotificationService implements INotificationService {
    readonly notifications = new Array<INotification>();

    add(message: string, code: string, field?: string | undefined): void {
        this.notifications.push({ message, code, field });
    }
    
    hasNotification(): boolean {
        return this.notifications.length > 0;
    }

    getNotifications(): INotification[] {
        return this.notifications;
    }


}