import "jasmine";
import "reflect-metadata";
import { BaseCommandApplicationBase } from "../../src/implementation/1 - application/base-command.application";
import { IRequestBodyless } from "../../src/interfaces/2 - domain/models/request.interface";
import { INotificationService } from "../../src/interfaces/2 - domain/services/notification-service.interface";
import * as https from "../../src/implementation/helpers/request-formatter";
import { BaseAppContainer } from '../../src/base-app-container';
import { RequestInfoService } from "../../src/implementation/2 - domain/services/request-info.service";
import { BASE_TYPES } from "../../src/base-types";
import { NotFoundApplication } from "../../src/implementation/1 - application/not-found.application";
import * as RequestFormatter from "../../src/implementation/helpers/request-formatter";

class TestContainer extends BaseAppContainer<any> {
    registerDomainServices(): void {
    }
    registerApplications(): void {
    }
}

describe("NotFoundApplication", () => {
    it("constructor: ok", () => {
        //Arrange
        const container = new TestContainer(RequestInfoService, {} as any);

        //Act
        const result = container.get(BASE_TYPES.applications.INotFoundApplication);

        //Assert
        expect(result instanceof NotFoundApplication).toBeTruthy();
    });

    it("do: ok", async () => {
        //arrange
        spyOn(RequestFormatter, "notFound").and.returnValue("EXPECTED_RESULT" as any);
        const target = new NotFoundApplication();

        //Act
        const result = await target.do({} as any);

        //Assert
        expect(result).toBe("EXPECTED_RESULT" as any);
        expect(RequestFormatter.notFound).toHaveBeenCalledTimes(1);
    });
});