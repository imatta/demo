pipeline { 
    agent any

	environment {
		USER_NAME = 'shirish'		
		DEPLOY_PATH = '/home/${USER_NAME}/dist'
		REPO_URL = 'https://githib.com/imatta/demo.git'
	}
	
    stages { 
			stage('Test') { 
			steps {
				   echo "Auto Test 1: Checking if index.html exists or nopwfdt"
				   sh '''
				   		#ls -l Hello.sh
						#pwd
						#ls -lrt
						ls -l index.html	
					  '''
					echo "Shirish Executing Automated Test4..."
			      }
			}

		stage('Pre-Deploy') { 
			steps {
				   echo "Pre-Deploy#1 Site Config exists or not"
				   sh '''
				   		ls -l /etc/nginx/sites-available/${USER_NAME}	
					  '''
					echo "Shirish Executing Automated Test4..."
			      }
			}
		
            stage('Build') { 
            steps { 
                    echo 'Building... Step#1' 
				    echo 'Building... Step#2'
					#sh 'chmod +x ./Hello.sh'
				    sh 'chmod +x ./index.html'
				    sh 'sudo cp ./index.html /home/${USER_NAME}/app/dist'
				
                	#sh './Hello.sh'
            } 
	        } 
	    } 
	    post { 
		       success { 
	                     echo "Success" 
				   		sh '''
						sudo nginx -t
						sudo systemctl reload nginx	
						'''
				   
				   echo "Copy the artifact to the deployment server!" 
	       } 
	      failure { 
            		echo "Failed" 
			  	    echo "Clean the borken build, notify the R&D Teams"
        } 
    } 
}
