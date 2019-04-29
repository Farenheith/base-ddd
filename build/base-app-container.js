"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const base_types_1 = require("./base-types");
const language_service_1 = require("./implementation/2 - domain/services/language.service");
const notification_service_1 = require("./implementation/2 - domain/services/notification.service");
const scoped_cache_service_1 = require("./implementation/2 - domain/services/scoped-cache.service");
const request_formatter_1 = require("./implementation/helpers/request-formatter");
const logger_service_1 = require("./implementation/2 - domain/services/logger-service");
const not_found_application_1 = require("./implementation/1 - application/not-found.application");
class BaseAppContainer extends inversify_1.Container {
    constructor(requestInfoType, settings) {
        super({ defaultScope: inversify_1.BindingScopeEnum.Request,
            skipBaseClassChecks: true });
        this.requestInfoType = requestInfoType;
        this.settings = settings;
        this.routes = {};
        this.register();
    }
    register() {
        this.registerDomain();
        this.registerDomainServices();
        this.registerApplications();
    }
    registerDomain() {
        //models
        this.bind(base_types_1.BASE_TYPES.domainModels.ISettings).toConstantValue(this.settings);
        this.bind(base_types_1.BASE_TYPES.domainModels.IRequestInfo).to(this.requestInfoType);
        //services
        this.bind(base_types_1.BASE_TYPES.domainServices.ILanguageService).to(language_service_1.LanguageService);
        this.bind(base_types_1.BASE_TYPES.domainServices.INotificationService).to(notification_service_1.NotificationService);
        this.bind(base_types_1.BASE_TYPES.domainServices.IScopedCacheService).to(scoped_cache_service_1.ScopedCacheService);
        this.registerLogger();
        //applications
        this.bind(base_types_1.BASE_TYPES.applications.INotFoundApplication).to(not_found_application_1.NotFoundApplication);
    }
    registerLogger() {
        this.bind(base_types_1.BASE_TYPES.domainServices.ILogger).to(logger_service_1.Logger);
    }
    async adapter(symbol, req, res) {
        const child = this.createChild();
        const application = child.get(symbol);
        const logger = child.get(base_types_1.BASE_TYPES.domainServices.ILogger);
        try {
            const x = await application.do(req);
            //if redirection
            if (x.statusCode >= 300 && x.statusCode <= 399) {
                res.redirect(x.statusCode, x.data);
            }
            else {
                res.status(x.statusCode);
                res.send(x);
            }
            logger.info(`${req.path} ack ${x.statusCode}`);
        }
        catch (error) {
            logger.error(`${req.path} err ${error.stack}`);
            const result = request_formatter_1.serviceUnavailable();
            res.status(result.statusCode);
            res.send(result);
        }
    }
    registerCommand(verb, route, command) {
        let routeTreated = route.startsWith('/') ? route : `/${route}`;
        if (!routeTreated.endsWith('/')) {
            routeTreated = `${routeTreated}/`;
        }
        routeTreated = routeTreated.toLowerCase();
        this.routes[routeTreated] = { [verb]: command };
    }
    processCommand(req, res) {
        let path = req.path.substring(0, req.path.indexOf("?") || req.path.length);
        if (!path.endsWith('/')) {
            path = `${path}/`;
        }
        let command = undefined;
        do {
            const route = this.routes[path];
            if (route) {
                command = route[req.method];
            }
            path = path.substring(0, path.lastIndexOf('/', path.length - 2) + 1);
        } while (!command && path.length > 1);
        if (command) {
            this.adapter(command, req, res);
        }
        else {
            this.adapter(base_types_1.BASE_TYPES.applications.INotFoundApplication, req, res);
        }
    }
}
exports.BaseAppContainer = BaseAppContainer;
