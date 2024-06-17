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
        SONAR_TOKEN = "sqp_532b272a1fdb90a29ee9b41c701a897e00434a2d"
        SONARQUBE_URL = 'http://localhost:9000' // Update this with your SonarQube server URL
        SONARQUBE_TOKEN = "sqp_1a4010a9ff6dd7277e28bfefa94173653a1aaf17" 
        PSQL_HOST = 'psql-db'
        POSTGRES_USER = 'admin'
        POSTGRES_PASSWORD = 'polar'
        POSTGRES_DB = 'test-db'
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
                    sh 'sudo apt install npm -y'
                    sh 'npm install'
                    sh 'npm audit report'
                    sh 'npm audit fix'
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
                    // Run funtional tests
                    sh 'npm run test:functional'
                }
            }
        }

        stage('Run both Unit and Functional Tests') {
            steps {
                script {
                    // Run Mocha unit and functional tests
                    sh 'npm run test'
                }
            }
        }

        stage('SonarQube-Analysis') {
            steps {
                script {
                    try {
                        def scannerHome = tool 'sonarqube-scanner';
                        withSonarQubeEnv() {
                            // sh "${scannerHome}/bin/sonar-scanner -Dsonar.login=${env.SONAR_LOGIN} -Dsonar.password=${env.SONAR_PASSWORD}"
                            sh "sonar-scanner \
                                -Dsonar.projectKey=Testing-NodeApp-Jest \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=http://localhost:9000 \
                                -Dsonar.token=sqp_532b272a1fdb90a29ee9b41c701a897e00434a2d"
                        }
                    }
                    catch (Exception e) {
                        echo "SonarQube stage has been failed in the try...!!! better luck next time !!!."
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    try {
                        timeout(time: 1, unit: 'HOURS') {
                            waitForQualityGate abortPipeline: true
                        }
                    } catch (Exception e) {
                        echo "Quality Gate check failed: ${e.message}"
                        error("Stopping pipeline due to Quality Gate failure.")
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerHubCredentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                        echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                        docker-compose -f docker-compose.dev.yml build
                        docker-compose -f docker-compose.dev.yml push testing-nodeapp-jest
                        docker push rpdharanidhar/testing-nodeapp-jest:latest
                        """
                    }
                }
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
                echo "Pipeline completed."
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
