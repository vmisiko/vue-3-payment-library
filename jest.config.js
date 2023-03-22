module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: ["/node_modules/(?!vue-birth-datepicker)"],
  moduleFileExtensions: ['js', 'json', 'node', 'vue'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [ "text", 'cobertura','html'],
  reporters: ["default",
        ["jest-junit", {usePathForSuiteName: true, outputDirectory: 'coverage'}]
      ],
  testResultsProcessor: "jest-junit"
}
