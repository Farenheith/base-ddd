import { IRequestInfo } from "../../../interfaces/2 - domain/models/request-info.interface";
import { ILanguageService } from "../../../interfaces/2 - domain/services/language-service.interface";
import { LanguageRootOptions } from "joi";
import { IRequestBodyless } from "../../../interfaces/2 - domain/models/request.interface";

export class RequestInfoService implements IRequestInfo {
    constructor(readonly languageService: ILanguageService) { }

    language: LanguageRootOptions | undefined;

    set(req: IRequestBodyless) {
        this.language = this.languageService.get(req.header("Accept-Language"));
    }
}