"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const base_types_1 = require("./base-types");
const request_info_service_1 = require("./implementation/2 - domain/services/request-info.service");
const language_service_1 = require("./implementation/2 - domain/services/language.service");
const notification_service_1 = require("./implementation/2 - domain/services/notification.service");
class AppContainer extends inversify_1.Container {
    constructor(requestInfoType = request_info_service_1.RequestInfoService, settings) {
        super({ defaultScope: inversify_1.BindingScopeEnum.Request });
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
        this.bind(base_types_1.BASE_TYPES.domain.models.ISettings).toConstantValue(this.settings);
        this.bind(base_types_1.BASE_TYPES.domain.models.IRequestInfo).to(this.requestInfoType);
        //services
        this.bind(base_types_1.BASE_TYPES.domain.services.ILanguageService).to(language_service_1.LanguageService);
        this.bind(base_types_1.BASE_TYPES.domain.services.INotificationService).to(notification_service_1.NotificationService);
    }
}
exports.AppContainer = AppContainer;
