pipeline { 
    agent any
    environment {
        BRANCH_NAME = "isaac_dynamic"
        USER_NAME = "isaac"
        USER_PORT = "9009"
        DEPLOY_PATH = "/home/${USER_NAME}/app/dist"
        REPO_URL = "https://github.com/imatta/demo.git"
        SITE_URL = "http://localhost:${USER_PORT}"
    }
    stages { 

            stage('Build') 
            {
                steps {
                        echo "Cloning repository from GitHub... ${REPO_URL} branch:${BRANCH_NAME}"
                        git url: "${REPO_URL}", branch: "${BRANCH_NAME}"
                        echo "Check if the image already exists..."
                        sh 'podman images ${BRANCH_NAME}-web-container'
                        echo "delete old image..."
                        sh 'podman rmi ${BRANCH_NAME}-web-container'
                        sh 'podman build -t ${BRANCH_NAME}-web-container .'
                      }
            }
            stage('Test') { 
            steps {
                   echo "Auto-Test#1: Checking if the image created is available to deploy"
                   sh 'podman images ${BRANCH_NAME}-web-container'
                  }
            }
            stage('Pre-Deploy') { 
            steps {
                   echo "Check if the dist directory exists or not"
                   sh 'sudo mkdir -p ${DEPLOY_PATH}'
                   sh 'sudo ls -l ${DEPLOY_PATH}'
                   echo "Pre-Deploy#1: Checking if podman is available"
                   sh '''which podman'''
                  }
            }
            stage('Deploy') { 
            steps { 
                    sh '''sudo podman ps -a'''
                    echo "Stopping and remove old container if is already running with same exact name"
                    sh 'podman stop $(podman ps -a -q --filter name=${BRANCH_NAME}-web-container) && podman rm $(podman ps -a -q --filter name=${BRANCH_NAME}-web-container)'
                    sh 'podman run -d --replace --name ${BRANCH_NAME}-web-container -p ${USER_PORT}:80 ${BRANCH_NAME}-web-container'
                    sh '''sudo podman ps -a'''
            } 
        } 
    } 
    post { 
           success { 
                     echo "Success and Checking site availability..."
                          sh '''curl -I ${SITE_URL}'''                          
           } 
          failure { 
                    echo "Failed please chec ${SITE_URL} and app/dist folder of the server" 
                      echo "Clean the borken build, notify the R&D Teams"
        } 
    } 
}
