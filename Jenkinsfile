pipeline {
    agent any
    environment {
        APP_NAME = "vue-3-payment-lib"
        IMAGE_BASE_NAME = "${CI_REGISTRY}/${APP_NAME}"
    }

    stages {
        stage('Lint Test') {
            agent {
                docker {
                    image 'node:14-alpine'
                    args '--user root'
                }
            }
            steps {

                sh '''
                    id
                    npm run lint
                '''

            }
        }
        stage('Unit Test') {
            agent { 
                docker {
                    image 'node:14-alpine'
                    args '--user root'
                }
            } 
            steps {
                cache(maxCacheSize: 900, caches: [
                ]) {
                    sh 'npm run test:coverage'
                }    
            }
            post {
                always {
                  publishHTML target: [
                    allowMissing         : false,
                    alwaysLinkToLastBuild: false,
                    keepAll             : true,
                    reportDir            : 'coverage/lcov-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Coverage Report - HTML'
                  ]
                  publishCoverage adapters: [cobertura(path: 'coverage/**.xml', mergeToOneReport: true)]
                  catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    junit "test-results/**.xml"  
                }
              }
           }
        }           
    }
}
