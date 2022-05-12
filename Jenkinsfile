pipeline {
  agent any
    
  tools {nodejs "AnthonyNodeJS"}
    
  stages {
     
    stage('Build') {
      steps {
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