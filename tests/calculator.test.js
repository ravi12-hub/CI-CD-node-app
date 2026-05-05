'use strict';

const { add, subtract, multiply, divide, power, percentage } = require('../src/utils/calculator');

// ============================================================
// UNIT TESTS - Calculator
// These run in the TEST stage of the Jenkins pipeline
// ============================================================

describe('Calculator - add()', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-5, 3)).toBe(-2);
  });

  test('adds two negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });

  test('adds floats correctly', () => {
    expect(add(1.5, 2.5)).toBeCloseTo(4.0);
  });

  test('throws TypeError for non-number inputs', () => {
    expect(() => add('2', 3)).toThrow(TypeError);
    expect(() => add(2, null)).toThrow(TypeError);
  });
});

describe('Calculator - subtract()', () => {
  test('subtracts two numbers', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test('subtracting larger from smaller gives negative', () => {
    expect(subtract(3, 7)).toBe(-4);
  });

  test('throws TypeError for non-number inputs', () => {
    expect(() => subtract('5', 2)).toThrow(TypeError);
  });
});

describe('Calculator - multiply()', () => {
  test('multiplies two positive numbers', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  test('multiplying by zero returns zero', () => {
    expect(multiply(999, 0)).toBe(0);
  });

  test('multiplying two negatives gives positive', () => {
    expect(multiply(-3, -4)).toBe(12);
  });

  test('throws TypeError for non-number inputs', () => {
    expect(() => multiply('a', 2)).toThrow(TypeError);
  });
});

describe('Calculator - divide()', () => {
  test('divides two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('divides returning a float', () => {
    expect(divide(7, 2)).toBeCloseTo(3.5);
  });

  test('throws Error on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero is not allowed');
  });

  test('throws TypeError for non-number inputs', () => {
    expect(() => divide('10', 2)).toThrow(TypeError);
  });
});

describe('Calculator - power()', () => {
  test('calculates power correctly', () => {
    expect(power(2, 10)).toBe(1024);
  });

  test('power of zero is 1', () => {
    expect(power(5, 0)).toBe(1);
  });

  test('throws TypeError for non-number inputs', () => {
    expect(() => power('2', 3)).toThrow(TypeError);
  });
});

describe('Calculator - percentage()', () => {
  test('calculates percentage correctly', () => {
    expect(percentage(25, 200)).toBe(12.5);
  });

  test('throws Error when total is zero', () => {
    expect(() => percentage(10, 0)).toThrow('Total cannot be zero');
  });

  test('throws TypeError for non-number inputs', () => {
    expect(() => percentage('10', 100)).toThrow(TypeError);
  });
});
