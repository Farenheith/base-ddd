"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayHelper = {
    async forEachAsync(array, callback) {
        for (let index = 0; index < array.length; index++) {
            const result = await callback(array[index], index, array);
            if (result == true) {
                break;
            }
        }
    },
    async everyAsync(array, callback) {
        for (let index = 0; index < array.length; index++) {
            if (!await callback(array[index], index, array)) {
                return false;
            }
        }
        return true;
    },
    async someAsync(array, callback) {
        for (let index = 0; index < array.length; index++) {
            if (await callback(array[index], index, array)) {
                return true;
            }
        }
        return false;
    }
};
