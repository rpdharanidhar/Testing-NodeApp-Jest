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
        SONARQUBE_TOKEN = "sqp_532b272a1fdb90a29ee9b41c701a897e00434a2d" 
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
                    bat 'npm install'
                    // bat 'npm audit fix'
                    // bat 'npm audit report'
                    bat 'npm install --save-dev jest supertest'
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                script {
                    // Run Mocha unit tests
                    bat 'npm run test:unit'
                }
            }
        }

        stage('Run Functional Tests') {
            steps {
                script {
                    // Run Mocha unit tests
                    bat '$ npm run test:functional'
                }
            }
        }

        stage('Run both Unit and Functional Tests') {
            steps {
                script {
                    // Run Mocha unit tests
                    bat 'npm run test'
                }
            }
        }

        stage('SonarQube-1Analysis') {
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

        stage('SonarQube-2analysis') {
            steps {
                script {
                    try {
                        bat "sonar-scanner \
                            -Dsonar.projectKey=Testing-NodeApp-Jest \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://localhost:9000 \
                            -Dsonar.token=sqp_532b272a1fdb90a29ee9b41c701a897e00434a2d"
                    }
                    catch (Exception e) {
                        echo "SonarQube stage has been failed in the 2nd try...!!! better luck next time !!!."
                    }
                }
            }
        }

        stage('SonarQube-3Analysis') {
            steps {
                script {
                    try {
                        bat 'sonar-scanner -Dsonar.projectKey=Testing-NodeApp-Jest -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.token=sqp_532b272a1fdb90a29ee9b41c701a897e00434a2d'
                    }
                    catch (Exception e) {
                        echo "SonarQube stage has been failed in the 3nd try...!!! better luck next time !!!."
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy the application
                    bat 'npm start'
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

        stage('Pubat Docker Image to Hub') {
            steps {
                bat "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} && docker-compose pubat rpdharanidhar/testing-nodeapp-jest"
            }
        }

        stage('Run the tests inside Docker container') {
            steps {
                script {
                    // Run tets inside the Docker container
                    bat 'docker build -t node-docker --target test .'
                }
            }
        }
    }


    post {
        always {
            script {
                // // Archive test results
                // junit 'test-results.xml'
                // // Archive coverage reports
                // cobertura 'coverage/cobertura-coverage.xml'
                echo "always block after post completion"
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
