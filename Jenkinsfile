pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "rpdharanidhar/testing-nodeapp-jest"
        BRANCH_NAME = "dev"
        SONAR_LOGIN = "admin"
        SONAR_PASSWORD = "polar"
        SONAR_HOST_URL = 'http://168.138.184.191:9000/'
        FORTIFY_IMAGE = 'evernow/fortify-sca'
        FORTIFY_PROJECT_NAME = 'test-prj-03'
        FORTIFY_BUILD_ID = 'build-${env.BUILD_NUMBER}'
        TAG = "latest"
        CLAIR_SCANNER_VERSION = "latest"
        CLAIR_URL = "http://localhost:6060"
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/rpdharanidhar/Testing-NodeApp-Jest', branch: 'dev'
                // checkout scm for the dev branch
            }
        }

        stage('print the commit id') {
            steps {
                script {
                    // Print the commit ID
                    echo "Commit ID: ${env.GIT_COMMIT}"
                }
            }
        }

        stage('Install Dependencies for npm') {
            steps {
                script {
                    // Install npm dependencies
                    // sh 'which sudo'
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
                        withSonarQubeEnv("sonarqube-server") {
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

        stage('Scan by Trivy for the Docker image') {
            steps {
                script {
                    // Install Trivy
                    sh 'wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -'
                    sh 'echo "deb https://aquasecurity.github.io/trivy-repo/deb stable main" | sudo tee -a /etc/apt/sources.list.d/trivy.list'
                    sh 'sudo apt-get update -y'
                    sh 'sudo apt install trivy -y'

                    // Scan the Docker image built / from the docker registry
                    sh """
                        trivy image $DOCKER_IMAGE_NAME
                    """
                }
            }
        }

        stage('Install Dependencies for clair') {
            steps {
                script {
                    // Install dependencies
                    sh 'sudo apt install docker-compose -y'
                    sh 'sudo apt install docker'
                }
            }
        }

        stage('Scan with Clair') {
            steps {
                script {
                    // Pull Clair Scanner Docker image
                    docker.image("ovotech/clair-scanner:${CLAIR_SCANNER_VERSION}").pull()

                    // Run Clair Scanner
                    // Step 1: Build the Docker image
                    sh 'sudo docker-compose -f /home/ubuntu/Testing-NodeApp-Jest/clair/docker-compose.yaml up -d'

                    // Step 2: Verify the image exists
                    sh 'docker images'

                    // Step 3: Run Clair Scanner
                    // sh 'sudo docker run --rm --net=host -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/tmp objectiflibre/clair-scanner:latest --clair=http://localhost:6060 --ip=localhost rpdharanidhar/testing-nodeapp-jest:latest'
                    sh 'mkdir -p /tmp/jenkins-workspace'
                    sh 'sudo chmod 777 /tmp/jenkins-workspace'
                    sh 'docker-compose up -d'
                    // sh 'docker run --rm --net=host -v /var/run/docker.sock:/var/run/docker.sock -v /tmp/jenkins-workspace:/tmp objectiflibre/clair-scanner:latest --clair=http://localhost:6060 --ip=localhost rpdharanidhar/testing-nodeapp-jest:latest'
                    sh 'docker run --rm --net=host -v /var/run/docker.sock:/var/run/docker.sock -v /tmp/jenkins-workspace:/tmp ovotech/clair-scanner:latest --clair=http://localhost:7070 --ip=localhost rpdharanidhar/testing-nodeapp-jest:latest'
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerHubCredentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                            sudo docker build --build-arg -t ${DOCKER_IMAGE_NAME}:${TAG} .
                            sudo docker-compose -f docker-compose.yml up -d
                            sudo docker push ${DOCKER_IMAGE_NAME}
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
