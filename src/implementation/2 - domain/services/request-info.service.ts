import { IRequestInfo } from "../../../interfaces/2 - domain/models/request-info.interface";
import { ILanguageService } from "../../../interfaces/2 - domain/services/language-service.interface";
import { LanguageRootOptions } from "joi";
import { IRequestBodyless } from "../../../interfaces/2 - domain/models/request.interface";
import { injectable, inject } from "inversify";
import { BASE_TYPES } from "../../../base-types";

@injectable()
export class RequestInfoService implements IRequestInfo {
    constructor(@inject(BASE_TYPES.domainServices.ILanguageService) readonly languageService: ILanguageService) { }

    language: LanguageRootOptions | undefined;

    set(req: IRequestBodyless) {
        this.language = this.languageService.get(req.header("Accept-Language"));
    }
}