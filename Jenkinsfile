pipeline { 
    agent any
    environment {
        BRANCH_NAME = "anuja"
        USER_PORT = "8004"
        DEPLOY_PATH = "/home/${USER_NAME}/app/dist"
        REPO_URL = "https://github.com/imatta/demo.git"
		IMAGE_NAME = "anuja-nginx"
        SITE_URL = "http://localhost:${USER_PORT}"
		CONTAINER_NAME = "anuja-nginx-container"
    }
	stages {

		stage('Test') {
			steps {
				echo 'Testing Nginx website files...'
				sh 'test -f html/index.html'
				sh 'test -f css/style.css'
				sh 'test -f scripts/script.js'
				echo 'All website files are present.'
			}
		}

		stage('Build') {
			steps {
				echo 'Building Nginx Docker image...'
				sh 'podman build -t ${IMAGE_NAME}:latest .'
			}
		}

		stage('Deploy') {
			steps {
				echo 'Deploying Nginx website...'
				sh 'podman rm -f ${CONTAINER_NAME} || true'
				sh 'podman run -d --name ${CONTAINER_NAME} -p ${USER_PORT}:80 ${IMAGE_NAME}:latest'
			}
		}
	}

	post {
		success {
			echo "Nginx website deployed successfully!"
			echo "Open: http://localhost:${USER_PORT}"
		}

		failure {
			echo "Nginx deployment failed. Check the console output."
		}
	}
}
