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
import { Logger } from "../src/implementation/2 - domain/services/logger-service";
import { NotFoundApplication } from "../src/implementation/1 - application/not-found.application";
import { HttpMethodEnum } from "../src/implementation/2 - domain/enums/http-method.enum";

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
    it("are all injections ok", () => {
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
        new TestContainer(RequestInfoService, "SETTINGS");

        //Assert
        expect(TestContainer.prototype.registerDomainServices).toHaveBeenCalledTimes(1);
        expect(TestContainer.prototype.registerApplications).toHaveBeenCalledTimes(1);
        expect(TestContainer.prototype.bind).toHaveBeenCalledTimes(7);
        expect(mapping[BASE_TYPES.domainModels.IRequestInfo.toString()]).toBe(RequestInfoService);
        expect(mapping[BASE_TYPES.domainModels.ISettings.toString()]).toBe("SETTINGS");
        expect(mapping[BASE_TYPES.domainServices.ILanguageService.toString()]).toBe(LanguageService);
        expect(mapping[BASE_TYPES.domainServices.INotificationService.toString()]).toBe(NotificationService);
        expect(mapping[BASE_TYPES.domainServices.IScopedCacheService.toString()]).toBe(ScopedCacheService);
        expect(mapping[BASE_TYPES.domainServices.ILogger.toString()]).toBe(Logger);
        expect(mapping[BASE_TYPES.applications.INotFoundApplication.toString()]).toBe(NotFoundApplication);
    });

    it("adapter: redirect", async () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer({} as any, {} as any);
        const symbol = Symbol.for("TEST");
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
        const symbol = Symbol.for("TEST");
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
        const symbol = Symbol.for("TEST");
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

    it("registerCommand: ok", () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer(RequestInfoService, {} as any);
        const symbol = Symbol.for("TEST");
        //Act
        target.registerCommand("TEST" as any, "ROTA" as any, symbol);

        //Assert
        expect(target.routes).toEqual({
            "/rota/": {
                TEST: symbol
            }
        });
        expect(target.register).toHaveBeenCalledTimes(1);
    });

    it("registerCommand: ok (with /)", () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer(RequestInfoService, {} as any);
        const symbol = Symbol.for("TEST");
        //Act
        target.registerCommand("TEST" as any, "/ROTA/" as any, symbol);

        //Assert
        expect(target.routes).toEqual({
            "/rota/": {
                TEST: symbol
            }
        });
        expect(target.register).toHaveBeenCalledTimes(1);
    });

    it("processCommand: ok", () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer(RequestInfoService, {} as any);
        spyOn(target, "adapter");
        const symbol = Symbol.for("TEST");
        target.routes = {
            "/test/subtest": {
                [HttpMethodEnum.GET]: symbol
            },
            "/test/": {
                [HttpMethodEnum.GET]: symbol
            }
        };
        const request: any = {
            path: "TEST",
            method: "GET"
        }
        const response: any = "RESPONSE"
        //Act
        target.processCommand(request, response);

        //Assert
        expect(target.register).toHaveBeenCalledTimes(1);
        expect(target.adapter).toHaveBeenCalledTimes(1);
        expect(target.adapter).toHaveBeenCalledWith(symbol, request, response);
    });

    it("processCommand: ok (with queryString)", () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer(RequestInfoService, {} as any);
        spyOn(target, "adapter");
        const symbol = Symbol.for("TEST");
        target.routes = {
            "/test/subtest": {
                [HttpMethodEnum.GET]: symbol
            },
            "/test/": {
                [HttpMethodEnum.GET]: symbol
            }
        };
        const request: any = {
            path: "TEST?teste=1",
            method: "GET"
        }
        const response: any = "RESPONSE"
        //Act
        target.processCommand(request, response);

        //Assert
        expect(target.register).toHaveBeenCalledTimes(1);
        expect(target.adapter).toHaveBeenCalledTimes(1);
        expect(target.adapter).toHaveBeenCalledWith(symbol, request, response);
    });

    it("processCommand: not found", () => {
        //Arrange
        spyOn(TestContainer.prototype, "register");
        const target = new TestContainer(RequestInfoService, {} as any);
        spyOn(target, "adapter");
        const symbol = Symbol.for("TEST");
        target.routes = {
            "/test/subtest": {
                [HttpMethodEnum.GET]: symbol
            },
            "/test/": {
                [HttpMethodEnum.GET]: symbol
            }
        };
        const request: any = {
            path: "/TEST/"
        }
        const response: any = "RESPONSE"
        //Act
        target.processCommand(request, response);

        //Assert
        expect(target.register).toHaveBeenCalledTimes(1);
        expect(target.adapter).toHaveBeenCalledTimes(1);
        expect(target.adapter).toHaveBeenCalledWith(BASE_TYPES.applications.INotFoundApplication, request, response);
    });
});