import { IRequestInfo } from "../../../interfaces/2 - domain/models/request-info.interface";
import { ILanguageService } from "../../../interfaces/2 - domain/services/language-service.interface";
import { LanguageRootOptions } from "joi";
import { IRequestBodyless } from "../../../interfaces/2 - domain/models/request.interface";
export declare class RequestInfoService implements IRequestInfo {
    readonly languageService: ILanguageService;
    constructor(languageService: ILanguageService);
    language: LanguageRootOptions | undefined;
    set(req: IRequestBodyless): void;
}
