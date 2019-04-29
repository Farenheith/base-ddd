"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    info(message) {
        console.log(`[INFO][${new Date()}] ${message}`);
    }
    error(message) {
        console.log(`[ERROR][${new Date()}] ${message}`);
    }
    warning(message) {
        console.log(`[WARNING][${new Date()}] ${message}`);
    }
}
exports.Logger = Logger;
