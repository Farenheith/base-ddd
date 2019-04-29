"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const base_types_1 = require("./base-types");
const language_service_1 = require("./implementation/2 - domain/services/language.service");
const notification_service_1 = require("./implementation/2 - domain/services/notification.service");
const scoped_cache_service_1 = require("./implementation/2 - domain/services/scoped-cache.service");
const request_formatter_1 = require("./implementation/helpers/request-formatter");
require("reflect-metadata");
const logger_service_1 = require("./implementation/2 - domain/services/logger-service");
class BaseAppContainer extends inversify_1.Container {
    constructor(requestInfoType, settings) {
        super({ defaultScope: inversify_1.BindingScopeEnum.Request,
            skipBaseClassChecks: true });
        this.requestInfoType = requestInfoType;
        this.settings = settings;
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
}
exports.BaseAppContainer = BaseAppContainer;
