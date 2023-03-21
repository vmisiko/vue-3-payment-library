pipeline {
    agent any
    environment {
        APP_NAME = "vue-3-payment-lib"
    }
    stages {
        stage ('Download lcov converter') {
            steps {
                sh "curl -O https://raw.githubusercontent.com/eriwen/lcov-to-cobertura-xml/master/lcov_cobertura/lcov_cobertura.py"
            }
        }
        stage('Run tests') {
            steps {
                sh "npm run test-coverage"
            }
        }
        // stage('Code Coverage : Cobertura') {
        //     steps {
        //         cobertura coberturaReportFile: '**/coverage.xml'
        //     }
        // }
    }
}

