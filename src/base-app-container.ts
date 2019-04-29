import "reflect-metadata";
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
import { IRequestBodyless, IRequest } from "./interfaces/2 - domain/models/request.interface";
import { ICommandBodyless, ICommand } from "./interfaces/1 - application/command-interface";
import { ILogger } from "./interfaces/2 - domain/services/logger.interface";
import { serviceUnavailable } from "./implementation/helpers/request-formatter";
import { Logger } from "./implementation/2 - domain/services/logger-service";
import { INotFoundApplication } from "./interfaces/1 - application/not-found-application.interface";
import { NotFoundApplication } from "./implementation/1 - application/not-found.application";
import { HttpMethodEnum } from "./implementation/2 - domain/enums/http-method.enum";

export abstract class BaseAppContainer<TSettings extends ISettings> extends Container {
    routes: { [route: string]: {[verb: string]: symbol } }  = { };

    constructor(readonly requestInfoType: typeof RequestInfoService,
            readonly settings: TSettings) {
        super({ defaultScope: BindingScopeEnum.Request,
                skipBaseClassChecks: true });
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
        this.registerLogger();

        //applications
        this.bind<INotFoundApplication>(BASE_TYPES.applications.INotFoundApplication).to(NotFoundApplication);
    }

    registerLogger() {
        this.bind<ILogger>(BASE_TYPES.domainServices.ILogger).to(Logger);
    }

    abstract registerDomainServices(): void;

    abstract registerApplications(): void;

    async adapter(symbol: symbol, req: IRequestBodyless, res: any) {
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

    registerCommand(verb: HttpMethodEnum, route: string,
            command: symbol) {
        let routeTreated = route.startsWith('/') ? route : `/${route}`;
        if (!routeTreated.endsWith('/')) {
            routeTreated = `${routeTreated}/`;
        }
        routeTreated = routeTreated.toLowerCase();
        this.routes[routeTreated] = { [verb]: command };
    }

    processCommand(req: IRequestBodyless | IRequest<any>, res: Response) {
        const queryStringStart = req.path.indexOf("?");
        let path = queryStringStart < 0 ? req.path : req.path.substring(0, queryStringStart);
        if (!path.startsWith('/')) {
            path = `/${path}`;
        }
        if (!path.endsWith('/')) {
            path = `${path}/`;
        }
        path = path.toLowerCase();
        let command: symbol | undefined = undefined; 
        do {
            const route = this.routes[path];
            if (route) {
                command = route[req.method];
            }
            path = path.substring(0, path.lastIndexOf('/', path.length - 2) + 1);
        } while (!command && path.length > 1);

        if (command) {
            this.adapter(command, req, res);
        } else {
            this.adapter(BASE_TYPES.applications.INotFoundApplication, req, res);
        }
    }
}