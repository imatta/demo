pipeline {
    agent any

    environment {
        USER_NAME = 'rohith'
        USER_PORT = '8002'
        SITE_URL = 'http://localhost:8002'
    }

    stages {

        stage('Test') {
            steps {
                echo "Auto-Test#1: Checking if index.html exists"
                sh '''
                    ls -l ./index.html
                '''
            }
        }

        stage('Build Image') {
            steps {
                echo "Building Podman image..."
                sh '''
                    podman build -t rohith-site .
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Deploying Podman container..."
                sh '''
                    podman stop rohith-site || true
                    podman rm rohith-site || true

                    podman run -d \
                        --name rohith-site \
                        -p ${USER_PORT}:80 \
                        rohith-site
                '''
            }
        }
    }

    post {

        success {
            echo "Success and checking site availability..."
            sh '''
                curl -I ${SITE_URL}
            '''
        }

        failure {
            echo "Deployment failed."
            echo "Check the Podman container and site."
        }
    }
}
