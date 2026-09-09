pipeline { 
    agent any
    environment {
        BRANCH_NAME = "isaac_dynamic"
        USER_NAME = "isaac"
        USER_PORT = "9007"
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
                        echo "delete old image..."
                        sh '''podman rm -f ${BRANCH_NAME}-web-container'''
                        sh '''podman build -t ${BRANCH_NAME}-web-container .'''
                      }
            }
            stage('Test') { 
            steps {
                   echo "Auto-Test#1: Checking if image to deploy exists or not"
                   sh '''ls -l .'''
                  }
            }
            stage('Pre-Deploy') { 
            steps {
                   echo "Check if the dist directory exists or not"
                   sh 'sudo mkdir -p ${DEPLOY_PATH}'
                   sh 'sudo ls -l ${DEPLOY_PATH}'
                   echo "Pre-Deploy#1: Checking if site config exists or not"
                   sh '''which podman'''
                  }
            }
            stage('Deploy') { 
            steps { 
                    echo "Stopping old containers if running before deploying..."
                    sh '''podman ps -a'''
                    sh '''podman stop --all'''
                    sh '''podman run -d --replace --name ${BRANCH_NAME}-web-container -p ${USER_PORT}:80 ${BRANCH_NAME}-static-site-image'''
            } 
        } 
    } 
    post { 
           success { 
                     echo "Success and Checking site availability..."
                          sh '''curl -I ${SITE_URL}'''
                          sh '''sudo podman ps -a'''
           } 
          failure { 
                    echo "Failed please chec ${SITE_URL} and app/dist folder of the server" 
                      echo "Clean the borken build, notify the R&D Teams"
        } 
    } 
}
