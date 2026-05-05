# CI/CD Learning App with Jenkins

A Node.js Express app built to teach you how to set up a real CI/CD pipeline with **Jenkins**, covering three core stages: **Lint → Test → Build**.

---

## 📁 Project Structure

```
cicd-node-app/
├── src/
│   ├── app.js                  # Express app (API routes)
│   └── utils/
│       ├── calculator.js       # Utility: math operations
│       └── stringHelper.js     # Utility: string operations
├── tests/
│   ├── calculator.test.js      # Unit tests for calculator
│   ├── stringHelper.test.js    # Unit tests for string helpers
│   └── app.test.js             # Integration tests for API
├── scripts/
│   └── build.js                # Build stage script
├── dist/                       # Created by npm run build
├── coverage/                   # Created by npm test
├── reports/                    # Created during CI
├── Jenkinsfile                 # Jenkins pipeline definition
├── Dockerfile                  # Multi-stage Docker build
├── .eslintrc.json              # Lint rules
└── package.json                # Scripts & dependencies
```

---

## 🚀 Quick Start (Local)

```bash
# Install dependencies
npm install

# Run the app
npm start
# → http://localhost:3000

# Run lint
npm run lint

# Run tests with coverage
npm test

# Run build
npm run build
```

---

## 🔧 CI/CD Pipeline Explained

### Stage 1 — LINT (`npm run lint`)

**Tool:** ESLint  
**Config:** `.eslintrc.json`

ESLint scans your code *before* running tests. It catches:
- Syntax errors
- Unused variables
- Inconsistent quotes or semicolons
- Bad patterns (`var` instead of `const`, `==` instead of `===`)

**Why it matters in CI/CD:**  
Lint runs first because it's the cheapest check. If a developer pushes a typo or style error, the pipeline fails in seconds — without wasting minutes running tests.

**Key lint rules configured:**
| Rule | Setting | Why |
|---|---|---|
| `no-unused-vars` | error | Dead code = confusion |
| `prefer-const` | error | Prevents accidental mutation |
| `semi` | error | Consistent style |
| `eqeqeq` | error | Prevents type-coercion bugs |
| `no-var` | error | Use `let`/`const` only |

---

### Stage 2 — TEST (`npm run test:ci`)

**Tool:** Jest + Supertest  
**Config:** `package.json → jest`

Two kinds of tests:

**Unit Tests** (`calculator.test.js`, `stringHelper.test.js`)  
Test individual functions in isolation. No HTTP, no database, no side effects.

```js
test('adds two positive numbers', () => {
  expect(add(2, 3)).toBe(5);
});
```

**Integration Tests** (`app.test.js`)  
Test the full HTTP layer using Supertest (no real server needed).

```js
test('returns sum of two numbers', async () => {
  const res = await request(app).get('/api/calc/add?a=5&b=3');
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(8);
});
```

**Coverage thresholds** (set in `package.json`):
- Lines: ≥ 70%
- Functions: ≥ 70%
- Branches: ≥ 60%

Pipeline fails if coverage drops below these. Jenkins publishes the HTML report.

---

### Stage 3 — BUILD (`npm run build`)

**Script:** `scripts/build.js`

The build stage:
1. Creates `dist/` directory
2. Copies `src/` into `dist/src/`
3. Writes a `build-manifest.json` with version, build time, Git commit, build number
4. Validates the built app can actually load (smoke check)

**Sample `build-manifest.json`:**
```json
{
  "name": "cicd-node-app",
  "version": "1.0.0",
  "buildTime": "2025-06-01T10:30:00.000Z",
  "nodeVersion": "v18.17.0",
  "environment": "production",
  "gitCommit": "abc1234",
  "buildNumber": "42"
}
```

---

## 🛠️ Jenkins Setup Guide

### Prerequisites
- Jenkins installed (Docker recommended: `docker run -p 8080:8080 jenkins/jenkins:lts`)
- Plugins needed:
  - **NodeJS Plugin** — for `tools { nodejs 'NodeJS-18' }`
  - **Pipeline** — for Jenkinsfile support
  - **HTML Publisher** — for coverage reports
  - **JUnit** — for test reports (built-in)
  - **AnsiColor** — for colored logs
  - **Warnings Next Generation** — for ESLint Checkstyle reports

### Step-by-step

1. **Push this project to GitHub**

2. **Configure NodeJS in Jenkins**  
   `Manage Jenkins → Global Tool Configuration → NodeJS → Add NodeJS`  
   Name it `NodeJS-18`, version `18.x`

3. **Create a Pipeline job**  
   `New Item → Pipeline → Pipeline script from SCM`  
   Set your GitHub repo URL and branch

4. **Run the pipeline**  
   Click `Build Now` — Jenkins will:
   - Pull your code
   - Run `npm ci`
   - Lint → Test → Build → Archive

### Reading the Pipeline UI

```
Checkout  →  Install  →  Lint  →  Test  →  Build  →  Archive
  ✅            ✅         ✅       ✅        ✅          ✅
```

If Lint fails, Jenkins stops and does NOT run Test or Build — saving time.

---

## 🐳 Docker Usage

```bash
# Build image (runs lint + test + build internally)
docker build -t cicd-node-app .

# Run container
docker run -p 3000:3000 cicd-node-app

# Test health endpoint
curl http://localhost:3000/health
```

---

## 📡 API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/` | App info |
| GET | `/health` | Health check (used by K8s/Docker) |
| GET | `/api/calc/add?a=5&b=3` | Addition |
| GET | `/api/calc/subtract?a=10&b=4` | Subtraction |
| GET | `/api/calc/multiply?a=4&b=5` | Multiplication |
| GET | `/api/calc/divide?a=10&b=2` | Division |
| POST | `/api/string/capitalize` | Capitalize text |
| POST | `/api/string/reverse` | Reverse text |
| POST | `/api/string/palindrome` | Check palindrome |

---

## 📚 Key Concepts Learned

| Concept | Where |
|---|---|
| ESLint rules & config | `.eslintrc.json` |
| Jest unit tests | `tests/calculator.test.js` |
| Jest integration tests | `tests/app.test.js` |
| Coverage thresholds | `package.json → jest` |
| Declarative Jenkinsfile | `Jenkinsfile` |
| Pipeline stages & post | `Jenkinsfile` |
| Multi-stage Docker | `Dockerfile` |
| Build manifests | `scripts/build.js` |
