"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
function ok(data) {
    return { statusCode: http_status_codes_1.OK, data };
}
exports.ok = ok;
function created(data) {
    return { statusCode: http_status_codes_1.CREATED, data };
}
exports.created = created;
function badRequest(errors) {
    return { statusCode: http_status_codes_1.BAD_REQUEST, errors };
}
exports.badRequest = badRequest;
function notFound() {
    return { statusCode: http_status_codes_1.NOT_FOUND, errors: [
            {
                code: "notFound",
                message: "Não encontrado"
            }
        ] };
}
exports.notFound = notFound;
function serviceUnavailable() {
    return { statusCode: http_status_codes_1.SERVICE_UNAVAILABLE, errors: [
            {
                code: "unexpectedError",
                message: "Tente novamente mais tarde"
            }
        ] };
}
exports.serviceUnavailable = serviceUnavailable;
