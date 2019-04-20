import "jasmine";
import "reflect-metadata";
import { BaseService } from "../../../src/implementation/2 - domain/services/base-service";
import { Static } from "../../../src/implementation/2 - domain/services/static-service";
import { INotificationService } from "../../../src/interfaces/2 - domain/services/notification-service.interface";
import * as joi from "joi";

class Service extends BaseService<any, any> {
    procceed(data: any): PromiseLike<any> {
        throw new Error("Method not implemented.");
    }
    getJoi(): { [x: string]: import("joi").Schema; } {
        throw new Error("Method not implemented.");
    }
}

describe("BaseService", () => {
    it("constructor: must call getJoi if doesn't have static cache", () => {
        //Arrange
        spyOn(Static, "get").and.callFake((a, f) => f());
        spyOn(Service.prototype, "getJoi").and.returnValue("JOI" as any);
        const target = new Service("TESTE", {} as any, {} as any);

        //Assert
        expect(target.schema).toBe("JOI" as any);
    });

    it("do: validate fail", async () => {
        //Arrange
        spyOn(Static, "get").and.returnValue("JOI");
        const target = new Service("TESTE", {} as any, {} as any);
        spyOn(target, "validate").and.returnValue(false);
        //Act
        const result = await target.do("VALUE");
        //Assert
        expect(result).toBeNull();
        expect(target.schema).toBe("JOI" as any);
        expect(target.validate).toHaveBeenCalledWith("VALUE", "JOI");
    });

    it("do: validate ok", async () => {
        //Arrange
        spyOn(Static, "get").and.returnValue("JOI");
        const target = new Service("TESTE", {} as any, {} as any);
        spyOn(target, "validate").and.returnValue(true);
        spyOn(target, "procceed").and.returnValue(Promise.resolve("EXPECTED_RESULT" as any));
        //Act
        const result = await target.do("VALUE");
        //Assert
        expect(result).toBe("EXPECTED_RESULT");
        expect(target.schema).toBe("JOI" as any);
        expect(target.validate).toHaveBeenCalledWith("VALUE", "JOI");
    });

    it("message: validate fail", async () => {
        //Arrange
        spyOn(Static, "get").and.returnValue("JOI");
        const notif = jasmine.createSpyObj<INotificationService>("notif", {
            add: undefined
        })
        const target = new Service("TESTE", notif, {} as any);
        //Act
        target.message("teste", "codigo", "campo");
        
        //Assert
        expect(target.schema).toBe("JOI" as any);
        expect(notif.add).toHaveBeenCalledWith("teste", "codigo", "campo");
    });

    it("hasNotification: ok", async () => {
        //Arrange
        spyOn(Static, "get").and.returnValue("JOI");
        const notif = jasmine.createSpyObj<INotificationService>("notif", {
            hasNotification: "EXPECTED_RESULT" as any
        })
        const target = new Service("TESTE", notif, {} as any);
        //Act
        const result = target.hasNotification();
        
        //Assert
        expect(target.schema).toBe("JOI" as any);
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(notif.hasNotification).toHaveBeenCalledTimes(1);
    });

    it("validate: joi fail", async () => {
        //Arrange
        spyOn(Static, "get").and.returnValue("JOI");
        spyOn(joi, "validate").and.returnValue({ error: {
            details: [
                {
                    message: "TESTE TESTE",
                    type: "teste",
                    context: {
                        key: "field"
                    }
                },
                {
                    message: "SEGUNDO ERRO",
                    type: "teste2",
                    context: {
                        key: "field2"
                    }
                }
            ]
        } });
        const target = new Service("TESTE", {} as any, {
            language: "LANGUAGE"
        } as any);
        spyOn(target, "message");
        spyOn(target, "hasNotification").and.returnValue("EXPECTED_RESULT" as any);
        //Act
        const result = target.validate("VALUE", "JOI" as any);
        
        //Assert
        expect(target.schema).toBe("JOI" as any);
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(joi.validate).toHaveBeenCalledWith("VALUE", "JOI", {
            language: "LANGUAGE"
        });
        expect(target.message).toHaveBeenCalledWith("TESTE TESTE", "teste", "field");
        expect(target.message).toHaveBeenCalledWith("SEGUNDO ERRO", "teste2", "field2");
    });
});