pipeline {
    agent any
    environment {
        USER_NAME = 'anuja'
        USER_PORT = '9005'
        DEPLOY_PATH = "/home/${USER_NAME}/app/dist"
        REPO_URL = 'https://github.com/imatta/demo.git'
        SITE_URL = 'http://localhost:9005'
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
                sh 'podman build -t anuja-site:latest .'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Nginx website...'
                sh 'sudo loginctl enable-linger jenkins'
                sh 'podman stop anuja-site || true'
                sh 'podman rm anuja-site || true'
                sh 'podman run -d --name anuja-site -p 9005:80 anuja-site:latest'
            }
        }
    }
    post {
        success {
            echo "Success and Checking site availability..."
            sh '''curl -I ${SITE_URL}'''
        }
        failure {
            echo "Nginx deployment failed. Check the console output."
        }
    }
}
