"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestInfoService {
    constructor(languageService) {
        this.languageService = languageService;
    }
    set(req) {
        this.language = this.languageService.get(req.header("Accept-Language"));
    }
}
exports.RequestInfoService = RequestInfoService;
