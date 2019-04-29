import "jasmine";
import "reflect-metadata";
import { Logger } from "../../../src/implementation/2 - domain/services/logger-service";

describe("Logger", () => {
    it("info: ok", () => {
        //Arrange
        const target = new Logger();
        spyOn(console, "log");

        //Act
        target.info("test");

        //Assert
        expect(console.log).toHaveBeenCalledTimes(1);
    });

    it("error: ok", () => {
        //Arrange
        const target = new Logger();
        spyOn(console, "log");

        //Act
        target.error("test");

        //Assert
        expect(console.log).toHaveBeenCalledTimes(1);
    });

    it("warning: ok", () => {
        //Arrange
        const target = new Logger();
        spyOn(console, "log");

        //Act
        target.warning("test");

        //Assert
        expect(console.log).toHaveBeenCalledTimes(1);
    });
})