pipeline {
    agent any
    environment {
        APP_NAME = "vue-3-payment-lib"
        IMAGE_BASE_NAME = "${CI_REGISTRY}/${APP_NAME}"
    }

    stages {
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
                    sh '''
                        npm i @vue/cli-plugin-unit-jest
                        npm i @vue3-jest
                        npm run test:unit
                        npm run test-coverage
                    '''
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
