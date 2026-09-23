pipeline { 
    agent any 
    stages { 
			stage('Test') { 
			steps {
				   echo "Auto Test 1: Checking if index.html exists or not"
				   sh '''
				   		#ls -l Hello.sh
						#pwd
						#ls -lrt
						ls -l index.html	
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
				    #sh 'cp ./index.html /home/shirish/app/dist/'
				
                	#sh './Hello.sh'
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
