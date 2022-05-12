pipeline {
  agent any
    
  tools {nodejs "AnthonyNodeJS"}
    
  stages {
     
    stage('Build') {
      steps {
        sh 'nvm install 16'
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
}