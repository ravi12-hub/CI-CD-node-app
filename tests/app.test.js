'use strict';

const request = require('supertest');
const app = require('../src/app');

// ============================================================
// INTEGRATION TESTS - API Routes
// Tests the full HTTP layer using supertest (no real server)
// ============================================================

describe('GET / - Root route', () => {
  test('returns 200 with app info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('version');
    expect(res.body.stages).toEqual(['Lint', 'Test', 'Build']);
  });
});

describe('GET /health - Health check', () => {
  test('returns 200 with healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('GET /api/calc/add', () => {
  test('returns sum of two numbers', async () => {
    const res = await request(app).get('/api/calc/add?a=5&b=3');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(8);
    expect(res.body.operation).toBe('add');
  });

  test('returns 400 when params are missing', async () => {
    const res = await request(app).get('/api/calc/add?a=5');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/calc/subtract', () => {
  test('returns difference of two numbers', async () => {
    const res = await request(app).get('/api/calc/subtract?a=10&b=4');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(6);
  });
});

describe('GET /api/calc/multiply', () => {
  test('returns product of two numbers', async () => {
    const res = await request(app).get('/api/calc/multiply?a=4&b=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(20);
  });
});

describe('GET /api/calc/divide', () => {
  test('returns quotient of two numbers', async () => {
    const res = await request(app).get('/api/calc/divide?a=10&b=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('returns 400 on division by zero', async () => {
    const res = await request(app).get('/api/calc/divide?a=10&b=0');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/zero/i);
  });
});

describe('POST /api/string/capitalize', () => {
  test('capitalizes the given text', async () => {
    const res = await request(app)
      .post('/api/string/capitalize')
      .send({ text: 'hello world' });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe('Hello world');
  });

  test('returns 400 when text is missing', async () => {
    const res = await request(app)
      .post('/api/string/capitalize')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/string/reverse', () => {
  test('reverses the given text', async () => {
    const res = await request(app)
      .post('/api/string/reverse')
      .send({ text: 'DevOps' });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe('spOveD');
  });
});

describe('POST /api/string/palindrome', () => {
  test('detects a palindrome correctly', async () => {
    const res = await request(app)
      .post('/api/string/palindrome')
      .send({ text: 'racecar' });
    expect(res.statusCode).toBe(200);
    expect(res.body.isPalindrome).toBe(true);
  });

  test('detects a non-palindrome correctly', async () => {
    const res = await request(app)
      .post('/api/string/palindrome')
      .send({ text: 'jenkins' });
    expect(res.statusCode).toBe(200);
    expect(res.body.isPalindrome).toBe(false);
  });
});

describe('404 handler', () => {
  test('returns 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown/route');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });
});
