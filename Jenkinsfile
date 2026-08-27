pipeline { 

    agent any 

    stages { 

        stage('Build') { 

            steps { 

                echo 'Building...' 

	             // all your software / app configuration  

              //and deployment steps here,  

              //step-by-step or stage by stage 

            } 

        } 

    } 

    post { 

        success { 

            echo "success" 

        } 

        failure { 

            echo "failed" 

        } 

    } 

} 
