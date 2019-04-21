import { Container, BindingScopeEnum } from "inversify";
import { ILanguageService } from "./interfaces/2 - domain/services/language-service.interface";
import { BASE_TYPES } from "./base-types";
import { IRequestInfo } from "./interfaces/2 - domain/models/request-info.interface";
import { RequestInfoService } from "./implementation/2 - domain/services/request-info.service";
import { INotificationService } from "./interfaces/2 - domain/services/notification-service.interface";
import { LanguageService } from "./implementation/2 - domain/services/language.service";
import { NotificationService } from "./implementation/2 - domain/services/notification.service";
import { ISettings } from "./interfaces/2 - domain/models/settings.interface";
import { IScopedCache } from "./interfaces/2 - domain/services/scoped-cache.interface";
import { ScopedCacheService } from "./implementation/2 - domain/services/scoped-cache.service";
import { IRequestBodyless } from "./interfaces/2 - domain/models/request.interface";
import { ICommandBodyless } from "./interfaces/1 - application/command-interface";
import { IResponse } from "./interfaces/2 - domain/models/response.interface";
import { ILogger } from "./interfaces/2 - domain/services/logger.interface";
import { serviceUnavailable } from "./implementation/helpers/request-formatter";

export abstract class BaseAppContainer<TSettings extends ISettings> extends Container {

    constructor(readonly requestInfoType: typeof RequestInfoService,
            readonly settings: TSettings) {
        super({ defaultScope: BindingScopeEnum.Request });
        this.register();
    }

    register() {
        this.registerDomain();
        this.registerDomainServices();

        this.registerApplications();
    }

    registerDomain() {
        //models
        this.bind<TSettings>(BASE_TYPES.domainModels.ISettings).toConstantValue(this.settings);
        this.bind<IRequestInfo>(BASE_TYPES.domainModels.IRequestInfo).to(this.requestInfoType);

        //services
        this.bind<ILanguageService>(BASE_TYPES.domainServices.ILanguageService).to(LanguageService);
        this.bind<INotificationService>(BASE_TYPES.domainServices.INotificationService).to(NotificationService);
        this.bind<IScopedCache>(BASE_TYPES.domainServices.IScopedCacheService).to(ScopedCacheService);
    }

    abstract registerDomainServices(): void;

    abstract registerApplications(): void;

    async adapter(
            symbol: symbol, req: IRequestBodyless, res: any) {
        const child = this.createChild();
        const application = child.get(symbol) as ICommandBodyless<any>;
        const logger = child.get<ILogger>(BASE_TYPES.domainServices.ILogger);

        try {
            const x = await application.do(req);
            //if redirection
            if (x.statusCode >= 300 && x.statusCode <= 399) {
                res.redirect(x.statusCode, x.data);
            } else {
                res.status(x.statusCode);
                res.send(x);
            }
            logger.info(`${req.path} ack ${x.statusCode}`);
        } catch (error) {
            logger.error(`${req.path} err ${error.stack}`);
            const result = serviceUnavailable();
            res.status(result.statusCode);
            res.send(result);
        }
    }
}