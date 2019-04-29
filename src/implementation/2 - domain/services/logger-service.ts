import { ILogger } from "../../../interfaces/2 - domain/services/logger.interface";

export class Logger implements ILogger {
    info(message: string): void {
        console.log(`[INFO][${new Date()}] ${message}`);
    }
    error(message: string): void {
        console.log(`[ERROR][${new Date()}] ${message}`);
    }
    warning(message: string): void {
        console.log(`[WARNING][${new Date()}] ${message}`);
    }


}