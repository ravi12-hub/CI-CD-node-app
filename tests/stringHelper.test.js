'use strict';

const {
  capitalize,
  reverseString,
  isPalindrome,
  truncate,
  countWords,
  toSlug,
} = require('../src/utils/stringHelper');

// ============================================================
// UNIT TESTS - String Helpers
// ============================================================

describe('StringHelper - capitalize()', () => {
  test('capitalizes first letter and lowercases rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
  });

  test('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  test('handles single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  test('throws TypeError for non-string input', () => {
    expect(() => capitalize(123)).toThrow(TypeError);
  });
});

describe('StringHelper - reverseString()', () => {
  test('reverses a simple string', () => {
    expect(reverseString('hello')).toBe('olleh');
  });

  test('handles palindrome (same forward and backward)', () => {
    expect(reverseString('racecar')).toBe('racecar');
  });

  test('handles empty string', () => {
    expect(reverseString('')).toBe('');
  });

  test('throws TypeError for non-string input', () => {
    expect(() => reverseString(42)).toThrow(TypeError);
  });
});

describe('StringHelper - isPalindrome()', () => {
  test('detects simple palindrome', () => {
    expect(isPalindrome('racecar')).toBe(true);
    expect(isPalindrome('madam')).toBe(true);
  });

  test('detects non-palindrome', () => {
    expect(isPalindrome('hello')).toBe(false);
  });

  test('is case-insensitive', () => {
    expect(isPalindrome('RaceCar')).toBe(true);
  });

  test('ignores spaces and punctuation', () => {
    expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
  });

  test('throws TypeError for non-string input', () => {
    expect(() => isPalindrome(true)).toThrow(TypeError);
  });
});

describe('StringHelper - truncate()', () => {
  test('truncates long string with ellipsis', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  test('does not truncate if within limit', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  test('handles exact length match', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  test('throws TypeError for invalid args', () => {
    expect(() => truncate(123, 5)).toThrow(TypeError);
    expect(() => truncate('hello', -1)).toThrow(TypeError);
  });
});

describe('StringHelper - countWords()', () => {
  test('counts words in a sentence', () => {
    expect(countWords('Hello World')).toBe(2);
    expect(countWords('one two three four')).toBe(4);
  });

  test('returns 0 for empty or whitespace string', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  test('handles multiple spaces between words', () => {
    expect(countWords('hello   world')).toBe(2);
  });

  test('throws TypeError for non-string input', () => {
    expect(() => countWords(null)).toThrow(TypeError);
  });
});

describe('StringHelper - toSlug()', () => {
  test('converts string to URL slug', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
  });

  test('removes special characters', () => {
    expect(toSlug('Hello, World!')).toBe('hello-world');
  });

  test('collapses multiple hyphens', () => {
    expect(toSlug('hello---world')).toBe('hello-world');
  });

  test('throws TypeError for non-string input', () => {
    expect(() => toSlug(42)).toThrow(TypeError);
  });
});
