pipeline { 
    agent any
	environment {
		USER_NAME = 'isaac'
        DEPLOY_PATH = '/home/${USER_NAME}/dist'
        REPO_URL = 'https://github.com/imatta/demo.git'
    }
    stages { 
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
            stage('Build') { 
            steps { 
                    sh 'chmod +x ./index.html'
                	sh 'cp ./index.html /home/${USER_NAME}/app/dist/'
            } 
        } 
    } 
    post { 
	       success { 
                     echo "Success" 
			         sh '''
					 		sudo nginx -t ​
					 		sudo systemctl reload nginx​
						'''
	       } 
	      failure { 
            		echo "Failed" 
			  	    echo "Clean the borken build, notify the R&D Teams"
        } 
    } 
}
