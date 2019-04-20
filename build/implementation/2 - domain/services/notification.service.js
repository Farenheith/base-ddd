"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotificationService {
    constructor() {
        this.notifications = new Array();
    }
    add(message, code, field) {
        this.notifications.push({ message, code, field });
    }
    hasNotification() {
        return this.notifications.length > 0;
    }
    getNotifications() {
        return this.notifications;
    }
}
exports.NotificationService = NotificationService;
