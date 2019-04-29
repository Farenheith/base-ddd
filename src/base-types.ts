export const BASE_TYPES = {
    applications: {
        INotFoundApplication: Symbol.for("INotFoundApplication")
    },
    domainModels: {
        ISettings: Symbol.for("ISettings"),
        IRequestInfo: Symbol.for("IRequestInfo")
    },
    domainServices: {
        ILanguageService: Symbol.for("ILanguageService"),
        IScopedCacheService: Symbol.for("IScopedCacheService"),
        INotificationService: Symbol.for("INotificationService"),
        ILogger: Symbol.for("ILogger")
    }
}