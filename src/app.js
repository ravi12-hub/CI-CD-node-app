'use strict';

const express = require('express');
const { add, subtract, multiply, divide } = require('./utils/calculator');
const { capitalize, reverseString, isPalindrome } = require('./utils/stringHelper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'CI/CD Learning App is running!',
    version: '1.0.0',
    stages: ['Lint', 'Test', 'Build'],
  });
});

// Health check - used in Jenkins pipeline
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Calculator API routes
app.get('/api/calc/add', (req, res) => {
  const { a, b } = req.query;
  if (a === undefined || b === undefined) {
    return res.status(400).json({ error: 'Query params a and b are required' });
  }
  const result = add(Number(a), Number(b));
  return res.json({ operation: 'add', a: Number(a), b: Number(b), result });
});

app.get('/api/calc/subtract', (req, res) => {
  const { a, b } = req.query;
  if (a === undefined || b === undefined) {
    return res.status(400).json({ error: 'Query params a and b are required' });
  }
  const result = subtract(Number(a), Number(b));
  return res.json({ operation: 'subtract', a: Number(a), b: Number(b), result });
});

app.get('/api/calc/multiply', (req, res) => {
  const { a, b } = req.query;
  if (a === undefined || b === undefined) {
    return res.status(400).json({ error: 'Query params a and b are required' });
  }
  const result = multiply(Number(a), Number(b));
  return res.json({ operation: 'multiply', a: Number(a), b: Number(b), result });
});

app.get('/api/calc/divide', (req, res) => {
  const { a, b } = req.query;
  if (a === undefined || b === undefined) {
    return res.status(400).json({ error: 'Query params a and b are required' });
  }
  if (Number(b) === 0) {
    return res.status(400).json({ error: 'Division by zero is not allowed' });
  }
  const result = divide(Number(a), Number(b));
  return res.json({ operation: 'divide', a: Number(a), b: Number(b), result });
});

// String helper API routes
app.post('/api/string/capitalize', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Body field "text" is required' });
  }
  return res.json({ original: text, result: capitalize(text) });
});

app.post('/api/string/reverse', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Body field "text" is required' });
  }
  return res.json({ original: text, result: reverseString(text) });
});

app.post('/api/string/palindrome', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Body field "text" is required' });
  }
  return res.json({ original: text, isPalindrome: isPalindrome(text) });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
