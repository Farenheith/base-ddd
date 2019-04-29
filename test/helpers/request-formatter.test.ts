import "jasmine";
import "reflect-metadata";
import * as RequestFormatter from "../../src/implementation/helpers/request-formatter";

describe("request-formatter", () => {
    it("ok: ok", () => {
        const result = RequestFormatter.ok("DATA");

        expect(result).toEqual({
            statusCode: 200,
            data: "DATA"
        });
    });

    it("badRequest: ok", () => {
        const result = RequestFormatter.badRequest("ERRORS" as any);

        expect(result).toEqual({
            statusCode: 400,
            errors: "ERRORS" as any
        });
    });

    it("created: ok", () => {
        const result = RequestFormatter.created("DATA" as any);

        expect(result).toEqual({
            statusCode: 201,
            data: "DATA"
        });
    });

    it("notFound: ok", () => {
        const result = RequestFormatter.notFound();

        expect(result).toEqual({
            statusCode: 404,
            errors: [
                {
                    code: "notFound",
                    message: "Não encontrado"
                }
            ]
        });
    });

    it("serviceUnavailable: ok", () => {
        const result = RequestFormatter.serviceUnavailable();

        expect(result).toEqual({
            statusCode: 503,
            errors: [
                {
                    code: "unexpectedError",
                    message: "Tente novamente mais tarde"
                }
            ]
        });
    });
});