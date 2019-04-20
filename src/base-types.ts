export const BASE_TYPES = {
    domain: {
        models: {
            ISettings: Symbol.for("ISettings"),
            IRequestInfo: Symbol.for("IRequestInfo")
        },
        services: {
            ILanguageService: Symbol.for("ILanguageService"),
            IScopedCacheService: Symbol.for("IScopedCacheService"),
            INotificationService: Symbol.for("INotificationService"),
        }
    }
}