export const BASE_TYPES = {
    domainModels: {
        ISettings: Symbol.for("ISettings"),
        IRequestInfo: Symbol.for("IRequestInfo")
    },
    domainServices: {
        ILanguageService: Symbol.for("ILanguageService"),
        IScopedCacheService: Symbol.for("IScopedCacheService"),
        INotificationService: Symbol.for("INotificationService"),
    }
}