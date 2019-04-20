"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_info_service_1 = require("../2 - domain/services/request-info.service");
const request_formatter_1 = require("../helpers/request-formatter");
class BaseCommandApplicationBase {
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
}
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
