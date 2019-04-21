export const ArrayHelper = {
  async forEachAsync<T>(array: T[],
      callback: (item: T, index: number, array: T[]) => PromiseLike<void | true>) {
    for (let index = 0; index < array.length; index++) {
      const result = await callback(array[index], index, array);
      if (result == true) {
        break;
      }
    }
  },

  async everyAsync<T>(array: T[],
      callback: (item: T, index: number, array: T[]) => PromiseLike<boolean>) {
    for (let index = 0; index < array.length; index++) {
      if (!await callback(array[index], index, array)) {
        return false;
      }
    }
    return true;
  },

  async someAsync<T>(array: T[],
      callback: (item: T, index: number, array: T[]) => PromiseLike<boolean>) {
    for (let index = 0; index < array.length; index++) {
      if (await callback(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
}