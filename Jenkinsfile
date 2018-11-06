pipeline {
  // Execute the pipeline on the master, stages will still be executed on the agents
  agent none

  options {
    timestamps() // Enable timestamps in the build log
    disableConcurrentBuilds() // The pipeline should run only once at a time
    preserveStashes(buildCount: 5)
  }

  // Environment variables for all stages
  environment {
    AWS_DEFAULT_REGION="eu-west-1"
    SERVICE_NAME="showcar-ui"
    COMMIT_HASH=getInvokedBuildNumber()
  }

  stages {

    // TODO - replace Travis
    stage('Build') {
      when {
        beforeAgent true
        branch 'refactoring-jenkins'
      }

      agent { node { label 'build-node' } }

      steps {
        sh './deploy/build.sh'
        stash includes: 'dist/*', name: 'build-dist'
        stash includes: 'docs/*', name: 'docs-dist'
        stash includes: 'package.json', name: 'package.json'
      }

    }

    stage('DeployDev') {
      when {
        beforeAgent true
        branch 'refactoring-jenkins'
      }

      environment {
        BRANCH='develop'
      }

      agent { node { label 'deploy-as24dev' } }

      steps {
        unstash 'build-dist'
        echo 'deploy development'
        //sh './deploy/deploy.sh'
        //slackSend channel: 'as24_acq_cxp_fizz', color: '#FFFF00', message: ":question: ${env.JOB_NAME} [${env.BUILD_NUMBER}] deploy to production waiting for approval. (<${env.BUILD_URL}|Open>)"
        //input message: "Approve build to be propagated to production?"
      }
    }

//  TODO - replace BrowserStack / Rakefile
//  stage('IntegrationTests') {
//  }

    stage('DeployProd') {
      when {
        beforeAgent true
        branch 'refactoring-jenkins'
      }

      environment {
         BRANCH='master'
      }

      agent { node { label 'deploy-as24dev' } }
      steps {
        unstash 'build-dist'
        echo 'deploy production'

        //sh './deploy/deploy.sh'
      }
    }

    stage('Publish') {
      when {
        beforeAgent true
        branch 'refactoring-jenkins'
      }

      environment {
         BRANCH='master'
      }

      agent { node { label 'build-node' } }
      steps {
        unstash 'build-dist'
        unstash 'package.json'
        echo 'publish release'
        sh './deploy/publish.sh'
      }
    }
  }

  post {
    failure {
      slackSend channel: 'as24_acq_cxp_fizz', color: '#FF0000', message: ":bomb: ${env.JOB_NAME} [${env.BUILD_NUMBER}] failed. (<${env.BUILD_URL}|Open>)"
    }
    aborted {
      slackSend channel: 'as24_acq_cxp_fizz', color: '#FFFF00', message: ":-1: ${env.JOB_NAME} [${env.BUILD_NUMBER}] aborted. (<${env.BUILD_URL}|Open>)"
    }
    success {
      slackSend channel: 'as24_acq_cxp_fizz', color: '#00FF00', message: ":+1: ${env.JOB_NAME} [${env.BUILD_NUMBER}] ShowCar UI was released. For the details go to: <https://github.com/AutoScout24/showcar-ui|showcar-ui>. (<${env.BUILD_URL}|Open>)"
    }
  }
}
