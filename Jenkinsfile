pipeline { 
    agent any
    environment {
        BRANCH_NAME = "likhitha_dynamic"
        USER_NAME = "likhitha"
        USER_PORT = "9001"
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
                        
                        echo "Stopping and removing existing container if is already running with same exact name"
                        //sh 'podman stop $(podman ps -a -q --filter name=${BRANCH_NAME}-web-container) && podman rm $(podman ps -a -q --filter name=${BRANCH_NAME}-web-container)'
                        sh'''
                        ids=$(podman ps -a -q --filter name=${BRANCH_NAME}-web-container)
                        if [ -n "$ids" ]; then
                                podman stop $ids && podman rm $ids
                        else
                                echo "No matching containers found for '${BRANCH_NAME}-web-container'."
                        fi
                        '''
                        echo "Deleting old image if already exists"    
                        sh 'podman rmi -f ${BRANCH_NAME}-web-container'
                        
                        echo "Building new image, with new code checked out from GitHub"
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
                   sh 'which podman'
                   echo "Checking resources..."
                   sh 'sudo df -h && free -h'
                  }
            }
           stage('Deploy') { 
    steps { 
        sh 'podman ps -a'
        sh 'podman run -d --replace --name ${BRANCH_NAME}-web-container -p ${USER_PORT}:80 ${BRANCH_NAME}-web-container nginx -g "daemon off;"'
        sh 'podman ps -a'
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
