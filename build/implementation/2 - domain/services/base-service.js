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
const inversify_1 = require("inversify");
const joi = require("joi");
const static_service_1 = require("./static-service");
let BaseService = class BaseService {
    constructor(entityName, notifications, settings) {
        this.entityName = entityName;
        this.notifications = notifications;
        this.settings = settings;
        this.schema = static_service_1.Static.get(entityName, this.getJoi);
    }
    do(data) {
        if (this.validate(data, this.schema)) {
            return this.proceed(data);
        }
        return Promise.resolve(null);
    }
    validate(value, schema) {
        if (schema) {
            const validation = joi.validate(value, schema, {
                language: this.settings.language
            });
            if (validation.error) {
                validation.error.details.forEach(detail => {
                    this.message(detail.message, detail.type, detail.context.key);
                });
            }
        }
        return this.hasNotification();
    }
    message(message, code, field) {
        this.notifications.add(message, code, field);
    }
    hasNotification() {
        return this.notifications.hasNotification();
    }
    joi() {
        return joi;
    }
};
BaseService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [String, Object, Object])
], BaseService);
exports.BaseService = BaseService;
