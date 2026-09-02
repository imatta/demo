pipeline { 
    agent any
	environment {
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
					    echo "Cleaning old images and build..."
						sh '''podman system prune -a --volumes -f'''
						sh '''podman rm -f my-web-container'''
             		    echo "Cloning repository from GitHub... ${REPO_URL} branch:${USER_NAME}"
                		git url: "${REPO_URL}", branch: "${USER_NAME}"
						sh '''podman build -t isaac-static-site-image .'''
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
				   echo "Pre-Deploy#1: Checking if site config exists or not"
				   sh '''which podman'''
			      }
			}
            stage('Deploy') { 
            steps { 
                    sh '''podman run -d --name my-web-container -p 8009:8009 isaac-static-site-image'''
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
