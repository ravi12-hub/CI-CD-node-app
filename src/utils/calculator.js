'use strict';

/**
 * Calculator utility functions
 * These are the functions we write unit tests for in the TEST stage
 */

const add = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a + b;
};

const subtract = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a - b;
};

const multiply = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a * b;
};

const divide = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
};

const power = (base, exponent) => {
  if (typeof base !== 'number' || typeof exponent !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return Math.pow(base, exponent);
};

const percentage = (value, total) => {
  if (typeof value !== 'number' || typeof total !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  if (total === 0) {
    throw new Error('Total cannot be zero');
  }
  return (value / total) * 100;
};

module.exports = { add, subtract, multiply, divide, power, percentage };
