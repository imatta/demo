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
                echo "Auto-Test#1: Checking if required files exist"
                sh '''
                    ls -l ./index.html
                    ls -l ./style.css
                    ls -l ./Dockerfile
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
                sh 'chmod -R +x .'
                sh 'sudo mkdir -p ${DEPLOY_PATH}'
                sh 'sudo cp -r ./* ${DEPLOY_PATH}/'
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
