import "jasmine";
import "reflect-metadata";
import { ScopedCacheService } from "../../../src/implementation/2 - domain/services/scoped-cache.service";

describe("ScopedCacheService", () => {
    it("get: ok (default, undefined)", () => {
        //Arrange
        const getter = jasmine.createSpyObj("getter", {
            get: "TEST"
        })
        const target = new ScopedCacheService();

        //Act
        const cache = target.get("INFO", () => getter.get());
        const cache2 = target.get("INFO", () => getter.get());

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
        const target = new ScopedCacheService();

        //Act
        const cache = await target.getAsync("INFOASYNC", () => getter.getAsync());
        const cache2 = await target.getAsync("INFOASYNC", () => getter.getAsync());

        //Assert
        expect(cache).toBe("TEST");
        expect(cache2).toBe("TEST");
        expect(getter.getAsync).toHaveBeenCalledTimes(1);
    });
})