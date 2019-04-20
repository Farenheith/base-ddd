import "jasmine";
import "reflect-metadata";
import { Static } from "../../../src/implementation/2 - domain/services/static-service";

describe("Static", () => {
    it("get: ok (default, undefined)", () => {
        //Arrange
        const getter = jasmine.createSpyObj("getter", {
            get: "TEST"
        })

        //Act
        const cache = Static.get("INFO", () => getter.get());
        const cache2 = Static.get("INFO", () => getter.get());

        //Assert
        expect(cache).toBe("TEST");
        expect(cache2).toBe("TEST");
        expect(getter.get).toHaveBeenCalledTimes(1);
    });

    it("getAsync: ok (default, undefined)", async () => {
        //Arrange
        const getter = jasmine.createSpyObj("getter", {
            getAsync: Promise.resolve("TEST")
        })

        //Act
        const cache = await Static.getAsync("INFOASYNC", () => getter.getAsync());
        const cache2 = await Static.getAsync("INFOASYNC", () => getter.getAsync());

        //Assert
        expect(cache).toBe("TEST");
        expect(cache2).toBe("TEST");
        expect(getter.getAsync).toHaveBeenCalledTimes(1);
    });
})