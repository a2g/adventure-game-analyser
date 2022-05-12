pipeline {
  agent any
    
  tools {nodejs "AnthonyNodeJS"}
    
  stages {
     
    stage('Build') {
      steps {
        sh 'node -v'
        sh 'npm install'
        sh 'npm run build'
      }
    }  
          
    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }
  }
  post {
    always {
      junit '**/reports/junit/*.xml'
    }
  } 
}