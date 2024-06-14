pipeline {
    agent any

    environment {
        NODEJS_HOME = '/usr/local/bin/node' // Update this path according to your Node.js installation
        PATH = "${env.NODEJS_HOME}:${env.PATH}"
        registry = "rpdharanidhar/testing-nodeapp-jest:latest"
        DOCKER_IMAGE = "rpdharanidhar/testing-nodeapp-jest:latest"
        KUBE_NAMESPACE = "jenkinsdemo-kube"
        DOCKER_PASSWORD = credentials('docker-password')
        DOCKER_USERNAME = credentials('docker-username')
        DOCKER_IMAGE_NAME = "rpdharanidhar/devops-task03"
        DOCKER_HUB_REPO = "rpdharanidhar"
        DOCKER_REGISTRY = "rpdharanidhar/devops-task01"
        SCANNER_HOME = tool 'sonarqube-scanner'
        SONAR_LOGIN = "admin"
        SONAR_PASSWORD = "polar"
        SONAR_TOKEN = "sqb_18c374423968093edca7d3b0814af51d80633230"    
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/rpdharanidhar/Testing-NodeApp-Jest', branch: 'main', credentialsId: 'git-credentials'
                // checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install npm dependencies
                    sh 'npm install'
                    sh 'npm audit -fix'
                    sh 'npm audit report'
                    sh 'npm install --save-dev jest supertest'
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                script {
                    // Run Mocha unit tests
                    sh 'npm run test:unit'
                }
            }
        }

        stage('Run Functional Tests') {
            steps {
                script {
                    // Run Mocha unit tests
                    sh '$ npm run test:functional'
                }
            }
        }

        stage('Run both Unit and Functional Tests') {
            steps {
                script {
                    // Run Mocha unit tests
                    sh 'npm run test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    try {
                        def scannerHome = tool 'sonarqube-scanner';
                        withSonarQubeEnv() {
                            bat "${scannerHome}/bin/sonar-scanner -Dsonar.login=${env.SONAR_LOGIN} -Dsonar.password=${env.SONAR_PASSWORD}"
                        }
                    } catch (Exception e) {
                        echo "SonarQube stage has been failed...!!! better luck next time !!!."
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy the application
                    sh 'npm start'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker-compose build"
            }
        }

        stage('Run Docker Container') {
            steps {
                bat "docker-compose -f docker-compose.dev.yml up --build"
            }
        }

        stage('Push Docker Image to Hub') {
            steps {
                bat "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} && docker-compose push rpdharanidhar/testing-nodeapp-jest"
            }
        }

        stage('Run the tests inside Docker container') {
            steps {
                script {
                    // Run tets inside the Docker container
                    sh 'docker build -t node-docker --target test .'
                }
            }
        }
    }


    post {
        always {
            script {
                // Archive test results
                junit 'test-results.xml'
                // Archive coverage reports
                cobertura 'coverage/cobertura-coverage.xml'
            }
        }
        success {
            echo 'Deployment and tests were successful!'
        }
        failure {
            echo 'There were test failures.'
        }
    }
}
