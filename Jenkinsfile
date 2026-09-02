pipeline { 
    agent any
	environment {
		USER_NAME = "isaac"
		USER_PORT = "8009"
        DEPLOY_PATH = "/home/${USER_NAME}/dist"
        REPO_URL = "https://github.com/imatta/demo.git"
		SITE_URL = "http://localhost:${USER_PORT}"
    }
    stages { 

			stage('Build') 
			{
            	steps {
             		    echo "Cloning repository from GitHub... ${REPO_URL} branch:${USER_NAME}"
                		git url: "${REPO_URL}", branch: "${USER_NAME}"
            		  }
			}
			stage('Test') { 
			steps {
				   echo "Auto-Test#1: Checking if index.html exists or not"
				   sh '''
				   		ls -l ./index.html
					  '''
			      }
			}
			stage('Pre-Deploy') { 
			steps {
				   echo "Pre-Deploy#1: Checking if site config exists or not"
				   sh '''
				   		ls -l /etc/nginx/sites-available/${USER_NAME}
					  '''
			      }
			}
            stage('Deploy') { 
            steps { 
                    sh 'chmod +x ./index.html'
                	sh 'sudo cp ./index.html /home/${USER_NAME}/app/dist/'
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
