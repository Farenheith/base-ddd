import "jasmine";
import "reflect-metadata";
import { NotificationService } from "../../../src/implementation/2 - domain/services/notification.service";

describe("NotificationService", () => {
    it("add: ok", () => {
        //Arrange
        const target = new NotificationService();

        //Act
        target.add("message", "code", "field");

        //Assert
        expect(target.notifications).toContain({
            code: "code",
            message: "message",
            field: "field"
        });
    });

    it("hasNotification: ok (no notifications)", () => {
        //Arrange
        const target = new NotificationService();
        target.notifications.length = 0;

        //Act
        const result = target.hasNotification();

        //Assert
        expect(result).toBeFalsy();
    });

    it("hasNotification: ok (has notifications)", () => {
        //Arrange
        const target = new NotificationService();
        target.notifications.length = 1;

        //Act
        const result = target.hasNotification();

        //Assert
        expect(result).toBeTruthy();
    });

    it("hasNotification: ok (has notifications)", () => {
        //Arrange
        const target = new NotificationService();
        (target as any).notifications = "EXPECTED_RESULT" as any;

        //Act
        const result = target.getNotifications();

        //Assert
        expect(result).toBe("EXPECTED_RESULT" as any)
    });
})