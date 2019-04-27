import "jasmine";
import "reflect-metadata";
import { BaseAppContainer } from "../src/base-app-container";
import { BASE_TYPES } from "../src/base-types";
import { RequestInfoService } from "../src/implementation/2 - domain/services/request-info.service";
import { NotificationService } from "../src/implementation/2 - domain/services/notification.service";
import { ScopedCacheService } from "../src/implementation/2 - domain/services/scoped-cache.service";
import { LanguageService } from "../src/implementation/2 - domain/services/language.service";
import { Container } from "inversify";
import { ICommandBodyless } from "../src/interfaces/1 - application/command-interface";
import { ILogger } from "../src/interfaces/2 - domain/services/logger.interface";
import { symbol } from "joi";

class TestContainer extends BaseAppContainer<any> {
    registerDomainServices(): void {
    }
    registerApplications(): void {
    }
}

function recursive(obj: any, container: TestContainer) {
    for(const str in obj) {
        const item = BASE_TYPES[str];
        if (item instanceof symbol) {
            container.get<any>(item as any);
        } else {
            recursive(item, container);
        }
    }
}

describe("BaseAppContainer", () => {
    it("is all injections ok", () => {
        const settings:any = "SETTINGS";
        const container = new TestContainer(RequestInfoService, settings);

        recursive(BASE_TYPES, container);
    });

    it("constructor: ok", () => {
        //Arrange
        spyOn(TestContainer.prototype, "registerDomainServices");
        spyOn(TestContainer.prototype, "registerApplications");
        const mapping: any = {

        };
        let next: any = undefined;
        const mapper:any = {
            to(value: any) {
                mapping[next] = value;
            },
            toConstantValue(value: any) {
                this.to(value);
            }
        }
        spyOn(TestContainer.prototype, "bind").and.callFake((x: any):any => {
            next = x.toString();
            return mapper;
        });
        //Act
        const target = new TestContainer(RequestInfoService, "SETTINGS");

        //Assert
        expect(TestContainer.prototype.registerDomainServices).toHaveBeenCalledTimes(1);
        expect(TestContainer.prototype.registerApplications).toHaveBeenCalledTimes(1);
        expect(TestContainer.prototype.bind).toHaveBeenCalledTimes(5);
        expect(mapping[BASE_TYPES.domainModels.IRequestInfo.toString()]).toBe(RequestInfoService);
        expect(mapping[BASE_TYPES.domainModels.ISettings.toString()]).toBe("SETTINGS");
        expect(mapping[BASE_TYPES.domainServices.ILanguageService.toString()]).toBe(LanguageService);
        expect(mapping[BASE_TYPES.domainServices.INotificationService.toString()]).toBe(NotificationService);
        expect(mapping[BASE_TYPES.domainServices.IScopedCacheService.toString()]).toBe(ScopedCacheService);
    });

    it("adapter: redirect", async () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer({} as any, {} as any);
        const symbol = Symbol.for("teste");
        const spyApplication = jasmine.createSpyObj<ICommandBodyless<any>>("application", {
            do: Promise.resolve({
                statusCode: 300,
                data: "EXPECTED_RESULT"
            })
        });
        const spyLogger = jasmine.createSpyObj<ILogger>("logger", {
            info: undefined
        });
        const spyResponse = jasmine.createSpyObj("respoonse", {
            redirect: undefined
        });
        const spyChild: any = {
            get(x: any) { }
        };
        spyOn(spyChild, "get").and.callFake((x: any): any => {
            if (x == symbol) {
                return spyApplication;
            } else {
                return spyLogger;
            }
        });
        spyOn(target, "createChild").and.returnValue(spyChild);

        //Act
        await target.adapter(symbol, "REQUEST" as any, spyResponse);

        //Expect
        expect(spyLogger.info).toHaveBeenCalledTimes(1);
        expect(target.createChild).toHaveBeenCalledTimes(1);
        expect(spyChild.get).toHaveBeenCalledWith(BASE_TYPES.domainServices.ILogger);
        expect(spyChild.get).toHaveBeenCalledWith(symbol);
        expect(spyApplication.do).toHaveBeenCalledWith("REQUEST");
        expect(spyResponse.redirect).toHaveBeenCalledWith(300, "EXPECTED_RESULT");
    });

    it("adapter: ok", async () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer({} as any, {} as any);
        const symbol = Symbol.for("teste");
        const spyApplication = jasmine.createSpyObj<ICommandBodyless<any>>("application", {
            do: Promise.resolve({
                statusCode: 202,
                data: "EXPECTED_RESULT"
            })
        });
        const spyLogger = jasmine.createSpyObj<ILogger>("logger", {
            info: undefined
        });
        const spyResponse = jasmine.createSpyObj("respoonse", {
            status: undefined,
            send: undefined
        });
        const spyChild: any = {
            get(x: any) { }
        };
        spyOn(spyChild, "get").and.callFake((x: any): any => {
            if (x == symbol) {
                return spyApplication;
            } else {
                return spyLogger;
            }
        });
        spyOn(target, "createChild").and.returnValue(spyChild);

        //Act
        await target.adapter(symbol, "REQUEST" as any, spyResponse);

        //Assert
        expect(spyLogger.info).toHaveBeenCalledTimes(1);
        expect(target.createChild).toHaveBeenCalledTimes(1);
        expect(spyChild.get).toHaveBeenCalledWith(BASE_TYPES.domainServices.ILogger);
        expect(spyChild.get).toHaveBeenCalledWith(symbol);
        expect(spyApplication.do).toHaveBeenCalledWith("REQUEST");
        expect(spyResponse.status).toHaveBeenCalledWith(202);
        expect(spyResponse.send).toHaveBeenCalledWith({
            statusCode: 202,
            data: "EXPECTED_RESULT"
        });
    });

    it("adapter: error", async () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer({} as any, {} as any);
        const symbol = Symbol.for("teste");
        const spyApplication = {
            do() { }
        };
        spyOn(spyApplication, "do").and.throwError("ERROR");
        const spyLogger = jasmine.createSpyObj<ILogger>("logger", {
            error: undefined
        });
        const spyResponse = jasmine.createSpyObj("respoonse", {
            status: undefined,
            send: undefined
        });
        const spyChild: any = {
            get(x: any) { }
        };
        spyOn(spyChild, "get").and.callFake((x: any): any => {
            if (x == symbol) {
                return spyApplication;
            } else {
                return spyLogger;
            }
        });
        spyOn(target, "createChild").and.returnValue(spyChild);

        //Act
        await target.adapter(symbol, "REQUEST" as any, spyResponse);

        //Assert
        expect(spyLogger.error).toHaveBeenCalledTimes(1);
        expect(target.createChild).toHaveBeenCalledTimes(1);
        expect(spyChild.get).toHaveBeenCalledWith(BASE_TYPES.domainServices.ILogger);
        expect(spyChild.get).toHaveBeenCalledWith(symbol);
        expect(spyApplication.do).toHaveBeenCalledWith("REQUEST");
        expect(spyResponse.status).toHaveBeenCalledWith(503);
        expect(spyResponse.send).toHaveBeenCalledWith({
            statusCode: 503,
            errors: [
                {
                    code: "unexpectedError",
                    message: "Tente novamente mais tarde"
                }
            ]
        });
    });
});