'use strict';

/**
 * String utility functions
 * Used in unit tests to demonstrate testing of pure functions
 */

const capitalize = (str) => {
  if (typeof str !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  if (str.length === 0) { return ''; }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const reverseString = (str) => {
  if (typeof str !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  return str.split('').reverse().join('');
};

const isPalindrome = (str) => {
  if (typeof str !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
};

const truncate = (str, maxLength) => {
  if (typeof str !== 'string') {
    throw new TypeError('First argument must be a string');
  }
  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new TypeError('maxLength must be a non-negative number');
  }
  if (str.length <= maxLength) { return str; }
  return str.slice(0, maxLength) + '...';
};

const countWords = (str) => {
  if (typeof str !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  const trimmed = str.trim();
  if (trimmed === '') { return 0; }
  return trimmed.split(/\s+/).length;
};

const toSlug = (str) => {
  if (typeof str !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

module.exports = { capitalize, reverseString, isPalindrome, truncate, countWords, toSlug };
