/**
 * Check if fn is a function.
 * @param {any} fn
 */
export function isFn(fn) {
  return typeof fn === 'function';
}

/**
 * Check if num is a number and not NaN.
 * @param {any} num
 */
export function isNum(num) {
  return typeof num === 'number' && !Number.isNaN(num)
}

/**
 * Check if v is an object and not null.
 * @param {any} v
 */
export function isObject(v) {
  return typeof v === 'object' && v !== null;
}

/**
 * Check if str is a string.
 * @param {any} str
 */
export function isString(str) {
  return typeof str === 'string';
}

