'use strict';

/**
 * BUILD STAGE SCRIPT
 * ------------------
 * This simulates the Build stage in the Jenkins pipeline.
 * It validates the app, creates a dist/ bundle, and writes a build manifest.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'dist');
const SRC_DIR = path.join(__dirname, '..', 'src');
const pkg = require('../package.json');

console.log('\n========================================');
console.log('  BUILD STAGE - CI/CD Pipeline');
console.log('========================================\n');

// Step 1: Create dist directory
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}
console.log('[1/4] ✅ dist/ directory ready');

// Step 2: Copy src files to dist
const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

copyDir(SRC_DIR, path.join(BUILD_DIR, 'src'));
console.log('[2/4] ✅ Source files copied to dist/');

// Step 3: Write build manifest
const buildManifest = {
  name: pkg.name,
  version: pkg.version,
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  environment: process.env.NODE_ENV || 'production',
  gitCommit: process.env.GIT_COMMIT || 'local-build',
  buildNumber: process.env.BUILD_NUMBER || '0',
};

fs.writeFileSync(
  path.join(BUILD_DIR, 'build-manifest.json'),
  JSON.stringify(buildManifest, null, 2)
);
console.log('[3/4] ✅ Build manifest written');

// Step 4: Validate that the built app can be required
process.env.NODE_ENV = 'test'; // Prevent server from binding a port during validation
try {
  require(path.join(BUILD_DIR, 'src', 'app.js'));
  console.log('[4/4] ✅ Built app loads successfully\n');
} catch (err) {
  console.error('[4/4] ❌ Built app failed to load:', err.message);
  process.exit(1);
}

console.log('========================================');
console.log('  BUILD COMPLETE');
console.log(`  Version : ${buildManifest.version}`);
console.log(`  Time    : ${buildManifest.buildTime}`);
console.log(`  Node    : ${buildManifest.nodeVersion}`);
console.log('========================================\n');
