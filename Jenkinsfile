pipeline {
    agent any

    environment {
        BRANCH_NAME = "rohith_dynamic"
        USER_NAME = "rohith"
        USER_PORT = "9002"

        DEPLOY_PATH = "/home/${USER_NAME}/app/dist"

        REPO_URL = "https://github.com/imatta/demo.git"

        SITE_URL = "http://localhost:${USER_PORT}"
    }

    stages {

        stage('Dry-Run') {
            steps {
                echo "Checking Podman..."
                sh '''
                    podman info
                '''
            }
        }


        stage('Build') {
            steps {

                echo "Cloning repository from GitHub..."
                echo "Repository: ${REPO_URL}"
                echo "Branch: ${BRANCH_NAME}"

                git url: "${REPO_URL}", branch: "${BRANCH_NAME}"


                echo "Checking if image already exists..."

                sh '''
                    podman images ${BRANCH_NAME}-web-container
                '''


                echo "Stopping and removing existing container if it exists..."

                sh '''
                    ids=$(podman ps -a -q --filter name=${BRANCH_NAME}-web-container)

                    if [ -n "$ids" ]; then
                        echo "Existing container found"

                        podman stop $ids || true
                        podman rm $ids || true
                    else
                        echo "No existing container found for ${BRANCH_NAME}-web-container"
                    fi
                '''


                echo "Deleting old image if it exists..."

                sh '''
                    podman rmi -f ${BRANCH_NAME}-web-container || true
                '''


                echo "Building new image with latest code..."

                sh '''
                    podman build -t ${BRANCH_NAME}-web-container .
                '''
            }
        }


        stage('Test') {
            steps {

                echo "Checking if the new image was created..."

                sh '''
                    podman images ${BRANCH_NAME}-web-container
                '''
            }
        }


        stage('Pre-Deploy') {
            steps {

                echo "Checking deployment directory..."

                sh '''
                    sudo mkdir -p ${DEPLOY_PATH}
                    sudo ls -l ${DEPLOY_PATH}
                '''


                echo "Checking Podman..."

                sh '''
                    podman info
                '''


                echo "Checking server resources..."

                sh '''
                    sudo df -h
                    free -h
                '''
            }
        }


        stage('Deploy') {
            steps {

                echo "Deploying Rohith Dynamic Website..."

                sh '''
                    podman ps -a
                '''


                sh '''
                    podman run -d \
                    --name ${BRANCH_NAME}-web-container \
                    -p ${USER_PORT}:80 \
                    ${BRANCH_NAME}-web-container
                '''


                echo "Checking running containers..."

                sh '''
                    podman ps -a
                '''
            }
        }
    }


    post {

        success {

            echo "Deployment Successful!"

            echo "Checking website availability at ${SITE_URL}"

            sh '''
                curl -I ${SITE_URL}
            '''
        }


        failure {

            echo "Deployment Failed!"

            echo "Please check ${SITE_URL}"

            echo "Check Jenkins console logs and Podman container logs."
        }
    }
}
