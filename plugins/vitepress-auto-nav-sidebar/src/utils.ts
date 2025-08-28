
/**
 * @brief 判断数组中是否存在某个元素，支持正则表达式
 * @param arr 数组
 * @param name 元素
 */
export const isSome = (arr: Array<string | RegExp>, name: string) => {
  return arr.some(item => item === name || (item instanceof RegExp && item.test(name)));
};
