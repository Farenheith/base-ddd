import "jasmine";
import "reflect-metadata";
import { BASE_TYPES } from "../src/base-types";

describe("BASE_TYPES", () => {
    it("symbols correctly defined", () => {
        const teste:any = BASE_TYPES;
        for (const group in teste) {
            for (const prop in teste[group]) {
                expect((teste[group] as any)[prop].toString()).toBe(`Symbol(${prop})`);
            }
        }
    });
});