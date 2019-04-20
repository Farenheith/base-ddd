import "jasmine";
import { BaseCommandApplicationBase, BaseCommandBodylessApplication, BaseCommandApplication } from "../../src/implementation/1 - application/base-command.application";
import { IRequestBodyless } from "../../src/interfaces/2 - domain/models/request.interface";
import { INotificationService } from "../../src/interfaces/2 - domain/services/notification-service.interface";
import * as https from "../../src/implementation/helpers/request-formatter";
import { RequestInfoService } from "../../src/implementation/2 - domain/services/request-info.service";
import { IBaseService } from "../../src/interfaces/2 - domain/services/base-service.interface";

class Command extends BaseCommandApplicationBase<any> {
    procceed(req: IRequestBodyless): PromiseLike<any> {
        throw new Error("Method not implemented.");
    }
}

describe("BaseCommandApplicationBase", () => {
    it("do: fail (notifications)", async () => {
        //arrange
        const notif = jasmine.createSpyObj<INotificationService>("notif", {
            hasNotification: true,
            getNotifications: "EXPECTED_NOTIFICATIONS" as any
        })
        const target = new Command(notif, "REQUEST" as any);
        spyOn(https, "badRequest").and.returnValue("EXPECTED_RESULT" as any);
        spyOn(target, "prepareRequestInfo");
        spyOn(target, "procceed").and.returnValue(Promise.resolve("PROCCEED"));

        //act
        const result = await target.do("BODY" as any);

        //assert
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(target.prepareRequestInfo).toHaveBeenCalledWith("BODY");
        expect(target.procceed).toHaveBeenCalledWith("BODY");
        expect(notif.hasNotification).toHaveBeenCalledTimes(1);
        expect(notif.getNotifications).toHaveBeenCalledTimes(1);
        expect(https.badRequest).toHaveBeenCalledWith("EXPECTED_NOTIFICATIONS");
    });

    it("do: ok", async () => {
        //arrange
        const notif = jasmine.createSpyObj<INotificationService>("notif", {
            hasNotification: false
        })
        const target = new Command(notif, "REQUEST" as any);
        spyOn(https, "ok").and.returnValue("EXPECTED_RESULT" as any);
        spyOn(target, "prepareRequestInfo");
        spyOn(target, "procceed").and.returnValue(Promise.resolve("PROCCEED"));

        //act
        const result = await target.do("BODY" as any);

        //assert
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(target.prepareRequestInfo).toHaveBeenCalledWith("BODY");
        expect(target.procceed).toHaveBeenCalledWith("BODY");
        expect(notif.hasNotification).toHaveBeenCalledTimes(1);
        expect(https.ok).toHaveBeenCalledWith("PROCCEED");
    });

    it("success: ok", () => {
        //Arrange
        const target = new Command({} as any, {} as any);
        spyOn(https, "ok").and.returnValue("EXPECTED_RESULT" as any);

        //Act
        const result = target.success("VALUE" as any);

        //Assert
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(https.ok).toHaveBeenCalledWith("VALUE");
    });

    it("prepareRequestInfo: ok", () => {
        //Arrange
        const requestInfo = new RequestInfoService({} as any); 
        spyOn(requestInfo, "set");
        const target = new Command({} as any, requestInfo);

        //Act
        target.prepareRequestInfo("VALUE" as any);

        //Assert
        expect(requestInfo.set).toHaveBeenCalledWith("VALUE");
    });
});

class Command2 extends BaseCommandBodylessApplication<any, any> { }

describe("BaseCommandBodylessApplication", () => {
    it("procceed: ok", async () => {
        //Arrange
        const service = jasmine.createSpyObj<IBaseService<any, any>>("service", {
            do: Promise.resolve("EXPECTED_RESULT")
        });
        const target = new Command2({} as any, {} as any, service);

        //Act
        const result = await target.procceed({ query: "QUERY" } as any);

        //Assert
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(service.do).toHaveBeenCalledWith("QUERY");
    });
});

class Command3 extends BaseCommandApplication<any, any> { }

describe("BaseCommandApplication", () => {
    it("procceed: ok", async () => {
        //Arrange
        const service = jasmine.createSpyObj<IBaseService<any, any>>("service", {
            do: Promise.resolve("EXPECTED_RESULT")
        });
        const target = new Command3({} as any, {} as any, service);

        //Act
        const result = await target.procceed({ data: "DATA" } as any);

        //Assert
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(service.do).toHaveBeenCalledWith("DATA");
    });
});