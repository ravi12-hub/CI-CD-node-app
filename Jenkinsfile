pipeline {
    agent any

    environment {
        NODE_ENV     = 'test'
        APP_NAME     = 'cicd-node-app'
        DOCKER_IMAGE = "ravisharma79/${APP_NAME}"
    }

    tools {
        nodejs 'NodeJS-18' 
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        ansiColor('xterm')
        // This allows multiple builds of this job to run at once if executors are available
        // To block concurrency, you would add: disableConcurrentBuilds()
    }

    stages {
        stage('Initialize') {
            steps {
                echo '📦 Preparing Environment...'
                checkout scm
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        // ── RUN LINT AND TEST IN PARALLEL ───────────────────────
        stage('Quality Checks') {
            parallel {
                stage('Lint') {
                    steps {
                        echo '🔍 Running ESLint...'
                        // Generates report but doesn't fail the build immediately
                        sh 'npx eslint src/**/*.js tests/**/*.js || true'
                    }
                }

                stage('Unit Tests') {
                    environment {
                        NODE_ENV = 'test'
                        JEST_JUNIT_OUTPUT_DIR = 'reports'
                        JEST_JUNIT_OUTPUT_NAME = 'jest-junit.xml'
                    }
                    steps {
                        echo '🧪 Running Jest Tests...'
                        sh 'mkdir -p reports'
                        sh 'npm run test:ci'
                    }
                    post {
                        always {
                            junit 'reports/jest-junit.xml'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building application...'
                sh 'npm run build'
            }
            post {
                success {
                    echo '✅ Build successful.'
                }
            }
        }

        /* 
        // Uncomment these when your Docker credentials are ready
        stage('Docker Operations') {
            steps {
                echo '🐳 Building and Pushing Image...'
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
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

        stage('Archive') {
            steps {
                echo '📦 Archiving Artifacts...'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            }
        }
    }

    post {
        success {
            echo """
            ============================================
            ✅ PIPELINE SUCCESS
            Build # : ${env.BUILD_NUMBER}
            ============================================
            """
        }
        failure {
            echo "❌ PIPELINE FAILED - Check logs for errors."
        }
        always {
            cleanWs() // Keeps the server clean
        }
    }
}