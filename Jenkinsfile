pipeline {
    agent any

    environment {
        USER_NAME = 'anuja'
        USER_PORT = '9005'
        SITE_URL = 'http://localhost:9005'
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
                    podman build -t anuja-site .
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Deploying Podman container..."
                sh '''
                    podman stop anuja-site || true
                    podman rm anuja-site || true

                    podman run -d \
                        --name anuja-site \
                        -p ${USER_PORT}:80 \
                        anuja-site
                '''
                sh 'whoami'
                sh 'podman ps -a'
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
