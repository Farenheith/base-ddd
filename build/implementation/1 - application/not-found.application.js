"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_formatter_1 = require("../helpers/request-formatter");
class NotFoundApplication {
    do(req) {
        return Promise.resolve(request_formatter_1.notFound());
    }
}
exports.NotFoundApplication = NotFoundApplication;
