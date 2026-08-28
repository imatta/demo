pipeline { 
    agent any 
    stages { 
			stage('Test') { 
			steps {
				   echo "Executing Automated Test1..."
				   echo "Executing Automated Test2..."
				   echo "Executing Automated Test3..."
				   sh '''
				   		ls -l Hellow.sh
					  '''
			      }
			}
            stage('Build') { 
            steps { 
                    echo 'Building... Step#1' 
				    echo 'Building... Step#2'
					sh 'chmod +x ./Hello.sh'
                	sh './Hello.sh'
            } 
        } 
    } 
    post { 
	       success { 
                     echo "Success" 
			         echo "Copy the artifact to the deployment server!" 
	       } 
	      failure { 
            		echo "Failed" 
			  	    echo "Clean the borken build, notify the R&D Teams"
        } 
    } 
}
