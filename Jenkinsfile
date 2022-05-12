pipeline {
  agent any
    
  tools {nodejs "AnthonyNodeJS"}
    
  stages {
        
    stage('Git') {
      steps {
        git 'https://github.com/a2g/adventure-game-analyser.git'
      }
    }
     
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