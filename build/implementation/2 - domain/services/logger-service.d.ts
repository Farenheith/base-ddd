import { ILogger } from "../../../interfaces/2 - domain/services/logger.interface";
export declare class Logger implements ILogger {
    info(message: string): void;
    error(message: string): void;
    warning(message: string): void;
}
