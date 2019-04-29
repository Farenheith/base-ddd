import { Container } from "inversify";
import { RequestInfoService } from "./implementation/2 - domain/services/request-info.service";
import { ISettings } from "./interfaces/2 - domain/models/settings.interface";
import { IRequestBodyless } from "./interfaces/2 - domain/models/request.interface";
import "reflect-metadata";
export declare abstract class BaseAppContainer<TSettings extends ISettings> extends Container {
    readonly requestInfoType: typeof RequestInfoService;
    readonly settings: TSettings;
    constructor(requestInfoType: typeof RequestInfoService, settings: TSettings);
    register(): void;
    registerDomain(): void;
    registerLogger(): void;
    abstract registerDomainServices(): void;
    abstract registerApplications(): void;
    adapter(symbol: symbol, req: IRequestBodyless, res: any): Promise<void>;
}
