import "jasmine";
import "reflect-metadata";
import { BaseAppContainer } from "../src/base-app-container";
import { BASE_TYPES } from "../src/base-types";
import { RequestInfoService } from "../src/implementation/2 - domain/services/request-info.service";
import { NotificationService } from "../src/implementation/2 - domain/services/notification.service";
import { ScopedCacheService } from "../src/implementation/2 - domain/services/scoped-cache.service";
import { LanguageService } from "../src/implementation/2 - domain/services/language.service";

class TestContainer extends BaseAppContainer<any> {
    registerDomainServices(): void {
        throw new Error("Method not implemented.");
    }
    registerApplications(): void {
        throw new Error("Method not implemented.");
    }
}

describe("BaseAppContainer", () => {
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
    })
})