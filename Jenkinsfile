//  JENKINSFILE - CI/CD Pipeline
//  Stages: Checkout → Install → Lint → Test → Build → Archive


pipeline {

    // Run on any available agent (or specify 'agent { label "linux" }')
    agent any

    // ── Environment variables 
    //     environment {
        NODE_ENV     = 'test'
        APP_NAME     = 'cicd-node-app'
        DOCKER_IMAGE = "ravisharma79/${APP_NAME}"
    }

    // ── Tool versions (must match what's configured in Jenkins) ──
    tools {
        nodejs 'NodeJS-18'   // Configure this in: Manage Jenkins → Global Tool Configuration
    }

    // ── Pipeline options ───────────────────────────────────
    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()           // Prefix every log line with a timestamp
        ansiColor('xterm')     // Colored output (requires AnsiColor plugin)
    }

    // ── Trigger: poll SCM every minute OR on GitHub webhook ──
    triggers {
        pollSCM('* * * * *')
    }

    stages {

        // ── STAGE 0: Checkout ────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📦 Checking out source code...'
                checkout scm   // Pulls code from the SCM configured in the Jenkins job
                sh 'echo "Branch: $GIT_BRANCH | Commit: $GIT_COMMIT"'
            }
        }

        // ── STAGE 1: Install Dependencies ────────────────────────
        stage('Install') {
            steps {
                echo '📥 Installing Node.js dependencies...'
                sh 'node --version'
                sh 'npm --version'
                // 'ci' is stricter than 'install' — uses package-lock.json exactly
                sh 'npm ci'
            }
        }

        // ── STAGE 2: LINT ────────────────────────────────────────
        // Checks code style, syntax errors, and bad patterns.
        // Fails the pipeline early before wasting time on tests.
        stage('Lint') {
            steps {
                echo '🔍 Running ESLint...'
                // --format checkstyle produces XML Jenkins can read
                sh '''
                    npx eslint src/**/*.js tests/**/*.js \
                        --format checkstyle \
                        --output-file reports/eslint-checkstyle.xml || true

                    # Also run human-readable output in the log
                    npx eslint src/**/*.js tests/**/*.js
                '''
            }
            post {
                always {
                    // Publish lint report to Jenkins (requires Checkstyle plugin)
                    recordIssues(
                        tools: [checkStyle(pattern: 'reports/eslint-checkstyle.xml')],
                        qualityGates: [[threshold: 1, type: 'TOTAL_ERROR', unstable: false]]
                    )
                }
                failure {
                    echo '❌ Lint failed! Fix ESLint errors before proceeding.'
                }
                success {
                    echo '✅ Lint passed — code style is clean.'
                }
            }
        }

        // ── STAGE 3: TEST ────────────────────────────────────────
        // Runs unit tests + integration tests with coverage.
        // Pipeline fails if coverage drops below thresholds in package.json.
        stage('Test') {
            environment {
                NODE_ENV = 'test'
                JEST_JUNIT_OUTPUT_DIR = 'reports'
                JEST_JUNIT_OUTPUT_NAME = 'jest-junit.xml'
            }
            steps {
                echo '🧪 Running Jest tests with coverage...'
                sh 'mkdir -p reports'
                sh 'npm run test:ci'
            }
            post {
                always {
                    // Publish JUnit test results (built-in Jenkins feature)
                    junit 'reports/jest-junit.xml'

                    // Publish HTML coverage report (requires HTML Publisher plugin)
                    publishHTML(target: [
                        allowMissing         : false,
                        alwaysLinkToLastBuild: true,
                        keepAll              : true,
                        reportDir            : 'coverage/lcov-report',
                        reportFiles          : 'index.html',
                        reportName           : 'Coverage Report'
                    ])
                }
                failure {
                    echo '❌ Tests failed! Check the test report above.'
                }
                success {
                    echo '✅ All tests passed with sufficient coverage.'
                }
            }
        }

        // ── STAGE 4: BUILD ───────────────────────────────────────
        // Bundles the app into dist/, writes a build manifest.
        // Only runs after Lint + Test both pass.
        stage('Build') {
            steps {
                echo '🔨 Building application...'
                sh 'npm run build'
                sh 'cat dist/build-manifest.json'
            }
            post {
                success {
                    echo '✅ Build complete — dist/ is ready.'
                }
                failure {
                    echo '❌ Build failed!'
                }
            }
        }

        // ── STAGE 5: DOCKER BUILD (Optional) ────────────────────
        // Uncomment when Docker is available on your Jenkins agent
        /*
        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }
        */

        // ── STAGE 6: Archive Artifacts ───────────────────────────
        stage('Archive') {
            steps {
                echo '📦 Archiving build artifacts...'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
                archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
            }
        }

    } // end stages

    // ── Post-pipeline notifications ───────────────────────
    post {
        success {
            echo """
            ============================================
            ✅ PIPELINE SUCCESS
            App     : ${env.APP_NAME}
            Build # : ${env.BUILD_NUMBER}
            Branch  : ${env.GIT_BRANCH}
            ============================================
            """
        }
        failure {
            echo """
            ============================================
            ❌ PIPELINE FAILED
            Build # : ${env.BUILD_NUMBER}
            Branch  : ${env.GIT_BRANCH}
            Check the stage logs above for details.
            ============================================
            """
        }
        always {
            // Clean workspace after each build to save disk space
            cleanWs()
        }
    }

} // end pipeline
