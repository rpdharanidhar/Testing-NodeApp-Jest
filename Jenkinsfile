pipeline {
    agent any

    environment {

        DOCKER_IMAGE_NAME = "rpdharanidhar/testing-nodeapp-jest"
        SONAR_LOGIN = "admin"
        SONAR_PASSWORD = "polar"
        SONAR_HOST_URL = 'https://4ea9-129-150-40-74.ngrok-free.app/'
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
                        withSonarQubeEnv("SonarQube") {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=Testing-NodeApp-Jest \
                                    -Dsonar.sources=. \
                                    -Dsonar.host.url=${SONAR_HOST_URL} \
                                    -Dsonar.login=${SONAR_LOGIN} \
                                    -Dsonar.password=${SONAR_PASSWORD}
                            """
                        }
                    } catch (Exception e) {
                        echo "SonarQube stage failed: ${e.message}"
                        error("Stopping pipeline due to SonarQube Analysis failure.")
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerHubCredentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        docker build -t $DOCKER_IMAGE_NAME .
                        docker push $DOCKER_IMAGE_NAME
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
