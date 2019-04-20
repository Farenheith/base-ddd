import { ILanguageService } from "../../../interfaces/2 - domain/services/language-service.interface";
import { LanguageRootOptions } from "joi";

export class LanguageService implements ILanguageService {
    get(key?: string): LanguageRootOptions | undefined {
        return undefined;
    }
}