"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_info_service_1 = require("../2 - domain/services/request-info.service");
const request_formatter_1 = require("../helpers/request-formatter");
const inversify_1 = require("inversify");
let BaseCommandApplicationBase = class BaseCommandApplicationBase {
    constructor(notifications, requestInfo) {
        this.notifications = notifications;
        this.requestInfo = requestInfo;
    }
    do(req) {
        this.prepareRequestInfo(req);
        return this.procceed(req).then(x => {
            if (this.notifications.hasNotification()) {
                return request_formatter_1.badRequest(this.notifications.getNotifications());
            }
            else {
                return this.success(x);
            }
        });
    }
    success(x) {
        return request_formatter_1.ok(x);
    }
    prepareRequestInfo(req) {
        if (this.requestInfo instanceof request_info_service_1.RequestInfoService) {
            this.requestInfo.set(req);
        }
    }
};
BaseCommandApplicationBase = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Object, Object])
], BaseCommandApplicationBase);
exports.BaseCommandApplicationBase = BaseCommandApplicationBase;
class BaseCommandBodylessApplication extends BaseCommandApplicationBase {
    constructor(notifications, requestInfo, service) {
        super(notifications, requestInfo);
        this.service = service;
    }
    procceed(req) {
        return this.service.do(req.query);
    }
}
exports.BaseCommandBodylessApplication = BaseCommandBodylessApplication;
class BaseCommandApplication extends BaseCommandApplicationBase {
    constructor(notifications, requestInfo, service) {
        super(notifications, requestInfo);
        this.service = service;
    }
    procceed(req) {
        return this.service.do(req.data);
    }
}
exports.BaseCommandApplication = BaseCommandApplication;
