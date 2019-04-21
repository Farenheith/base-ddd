import { ILanguageService } from "../../../interfaces/2 - domain/services/language-service.interface";
import { LanguageRootOptions } from "joi";
export declare class LanguageService implements ILanguageService {
    get(key?: string): LanguageRootOptions | undefined;
}
