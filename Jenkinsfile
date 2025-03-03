pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'react-skeleton'
        CONTAINER_NAME = 'react-skeleton'
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t react-skeleton .'
                }
            }
        }
        
       stage('Docker Run') {
            steps {
                sh 'docker compose down || true'  // Bring down existing containers if any
                sh 'docker compose up -d'  // Start in detached mode
            }
        }
    }
    
}
