import { LanguageRootOptions } from "joi";
export interface ILanguageService {
    get(key?: string): LanguageRootOptions | undefined;
}
