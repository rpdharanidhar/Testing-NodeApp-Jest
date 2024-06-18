pipeline {
    agent any

    environment {

        DOCKER_IMAGE_NAME = "rpdharanidhar/testing-nodeapp-jest"
        SONAR_LOGIN = "admin"
        SONAR_PASSWORD = "polar"
        SONAR_HOST_URL = 'https://2afb-129-150-40-74.ngrok-free.app/'
        FORTIFY_IMAGE = 'fortify-sca:latest'
        FORTIFY_PROJECT_NAME = 'test-prj-03'
        FORTIFY_BUILD_ID = 'build-${env.BUILD_NUMBER}'
        TAG = "latest"
        CLAIR_SCANNER_VERSION = "v12"
        CLAIR_URL = "http://localhost:6060"
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/rpdharanidhar/Testing-NodeApp-Jest', branch: 'main', credentialsId: 'git-credentials'
                // checkout scm
            }
        }

        stage('Install Dependencies for npm') {
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

        stage('Scan') {
            steps {
                script {
                    // Install Trivy
                    sh 'wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -'
                    sh 'echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list'
                    sh 'sudo apt-get update -y'
                    sh 'sudo apt install trivy -y'

                    // Scan the Docker image built / from the docker registry
                    sh """
                        trivy image $DOCKER_IMAGE_NAME
                    """
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

        stage('Fortify SCA - Translate') {
            steps {
                script {
                    docker.image(env.FORTIFY_IMAGE).inside {
                        sh """
                            sourceanalyzer -b ${env.FORTIFY_BUILD_ID} -clean
                            sourceanalyzer -b ${env.FORTIFY_BUILD_ID} Dockerfile
                        """
                    }
                }
            }
        }
        
        stage('Fortify SCA - Scan') {
            steps {
                script {
                    docker.image(env.FORTIFY_IMAGE).inside {
                        sh """
                        sourceanalyzer -b ${env.FORTIFY_BUILD_ID} -scan -f ${env.FORTIFY_PROJECT_NAME}.fpr
                        """
                    }
                }
            }
        }
        
        // stage('Publish Results') {
        //     steps {
        //         script {
        //             // Assuming Fortify SSC (Software Security Center) is set up to receive the results
        //             sh """
        //             fortifyclient -url https://your-ssc-server/ssc -authtoken your_auth_token \
        //             -uploadFPR -file ${env.FORTIFY_PROJECT_NAME}.fpr -project "${env.FORTIFY_PROJECT_NAME}" -version "${env.BUILD_ID}"
        //             """
        //         }
        //     }
        // }

        stage('Install Dependencies for clair') {
            steps {
                script {
                    // Install dependencies
                    sh 'sudo apt install docker-compose -y'
                    sh 'sudo snap install docker'
                }
            }
        }

        stage('Scan with Clair') {
            steps {
                script {
                    // Pull Clair Scanner Docker image
                    docker.image("arminc/clair-scanner:${CLAIR_SCANNER_VERSION}").pull()

                    // Run Clair Scanner
                    sh """
                    docker run --rm --net=host \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        -v pwd:/tmp arminc/clair-scanner:${CLAIR_SCANNER_VERSION} \
                        --clair=${CLAIR_URL} \
                        --ip=localhost ${IMAGE_NAME}:${TAG}
                    """
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
