
import { isFn, isNum, isObject, isString } from './type-check';

describe('type-check utils', () => {
  describe('isFn', () => {
    it('should return true for functions', () => {
      expect(isFn(() => {})).toBe(true);
      expect(isFn(function() {})).toBe(true);
      expect(isFn(Array.isArray)).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFn({})).toBe(false);
      expect(isFn([])).toBe(false);
      expect(isFn(42)).toBe(false);
      expect(isFn('function')).toBe(false);
      expect(isFn(null)).toBe(false);
      expect(isFn(undefined)).toBe(false);
    });
  });

  describe('isNum', () => {
    it('should return true for numbers', () => {
      expect(isNum(42)).toBe(true);
      expect(isNum(0)).toBe(true);
      expect(isNum(-1)).toBe(true);
      expect(isNum(3.14)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isNum(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNum('42')).toBe(false);
      expect(isNum({})).toBe(false);
      expect(isNum([])).toBe(false);
      expect(isNum(null)).toBe(false);
      expect(isNum(undefined)).toBe(false);
      expect(isNum(() => {})).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Object())).toBe(true);
    });

    it('should return true for arrays', () => {
      expect(isObject([])).toBe(true);
      expect(isObject([1, 2, 3])).toBe(true);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isObject(42)).toBe(false);
      expect(isObject('object')).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(() => {})).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString(String('world'))).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(42)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(() => {})).toBe(false);
    });
  });
});