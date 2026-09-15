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
			stage('Test') { 
			steps {
				   echo "In this stage of pipeline we are executing automated test case cases..."
				   sh '''
				   		ls -l Hello.sh
					  '''
			      }
			}
            stage('Build') { 
            steps { 
                    sh 'podman ps -a'
                    // run as detached process, re-direct all logs
                    sh 'nohup podman run -d --name ${BRANCH_NAME}-web-container -p ${USER_PORT}:80 ${BRANCH_NAME}-web-container > /var/lib/jenkins/logs/${BRANCH_NAME}-web-container_run.log 2>&1 &'
                    sh 'podman ps -a'
            } 
        } 
    } 
    post { 
           success { 
                     echo "Success and Checking site availability..."
                          sh '''curl -I ${SITE_URL}'''     
                     sleep 300
           } 
          failure { 
                    echo "Failed please chec ${SITE_URL} and app/dist folder of the server" 
                      echo "Clean the borken build, notify the R&D Teams"
        } 
    } 
}
