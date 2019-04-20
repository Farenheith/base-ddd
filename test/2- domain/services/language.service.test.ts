import "jasmine";
import "reflect-metadata";
import { LanguageService } from "../../../src/implementation/2 - domain/services/language.service";

describe("LanguageService", () => {
    it("get: ok (default, undefined)", () => {
        //Arrange
        const target = new LanguageService();

        //Act
        const result = target.get();

        //Assert
        expect(result).toBeUndefined();
    });

    it("get: ok (pt-Br, undefined)", () => {
        //Arrange
        const target = new LanguageService();

        //Act
        const result = target.get("pt-Br");

        //Assert
        expect(result).toBeUndefined();
    })
})