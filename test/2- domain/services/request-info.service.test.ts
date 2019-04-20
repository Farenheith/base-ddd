import "jasmine";
import "reflect-metadata";
import { RequestInfoService } from "../../../src/implementation/2 - domain/services/request-info.service";
import { ILanguageService } from "../../../src/interfaces/2 - domain/services/language-service.interface";
import { IRequestBodyless } from "../../../src/interfaces/2 - domain/models/request.interface";

describe("RequestInfoService", () => {
    it("get: ok (default, undefined)", () => {
        //Arrange
        const languageService = jasmine.createSpyObj<ILanguageService>("languageService", {
            get: "EXPECTED_LANGUAGE" as any
        });
        const request = jasmine.createSpyObj<IRequestBodyless>("request", {
            header: "LANGUAGE"
        })
        const target = new RequestInfoService(languageService);

        //Act
        target.set(request);

        //Assert
        expect(request.header).toHaveBeenCalledWith("Accept-Language");
        expect(languageService.get).toHaveBeenCalledWith("LANGUAGE");
        expect(target.language).toBe("EXPECTED_LANGUAGE" as any);
    });
})