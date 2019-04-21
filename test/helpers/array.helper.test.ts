import "jasmine";
import { ArrayHelper } from "../../src/implementation/helpers/array.helper";

describe("ArrayHelper", () => {
    it("forEachAsync: ok (break)", async () => {
        //Arrange
        const spy = jasmine.createSpyObj<{ callback: () => boolean }>("callback", {
            callback: true
        });

        //Act
        await ArrayHelper.forEachAsync([ "item", "item2" ], spy.callback);

        //Assert
        expect(spy.callback).toHaveBeenCalledTimes(1);
    });

    it("forEachAsync: ok (no break)", async () => {
        //Arrange
        const spy = jasmine.createSpyObj<{ callback: () => void }>("callback", {
            callback: undefined
        });

        //Act
        await ArrayHelper.forEachAsync([ "item", "item2" ], spy.callback);

        //Assert
        expect(spy.callback).toHaveBeenCalledTimes(2);
    });

    it("everyAsync: fail", async () => {
        //Arrange
        const spy = jasmine.createSpyObj<{ callback: () => boolean }>("callback", {
            callback: false
        });

        //Act
        const result = await ArrayHelper.everyAsync([ "item", "item2" ], spy.callback);

        //Assert
        expect(result).toBeFalsy();
        expect(spy.callback).toHaveBeenCalledTimes(1);
    });

    it("everyAsync: ok", async () => {
        //Arrange
        const spy = jasmine.createSpyObj<{ callback: () => boolean }>("callback", {
            callback: true
        });

        //Act
        const result = await ArrayHelper.everyAsync([ "item", "item2" ], spy.callback);

        //Assert
        expect(result).toBeTruthy();
        expect(spy.callback).toHaveBeenCalledTimes(2);
    });

    it("someAsync: fail", async () => {
        //Arrange
        const spy = jasmine.createSpyObj<{ callback: () => boolean }>("callback", {
            callback: false
        });


        //Act
        const result = await ArrayHelper.someAsync([ "item", "item2" ], spy.callback);

        //Assert
        expect(result).toBeFalsy();
        expect(spy.callback).toHaveBeenCalledTimes(2);
    });

    it("someAsync: ok", async () => {
        //Arrange
        const spy = jasmine.createSpyObj<{ callback: () => boolean }>("callback", {
            callback: true
        });

        //Act
        const result = await ArrayHelper.someAsync([ "item", "item2" ], spy.callback);

        //Assert
        expect(result).toBeTruthy();
        expect(spy.callback).toHaveBeenCalledTimes(1);
    });
});