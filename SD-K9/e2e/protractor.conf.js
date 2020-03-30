// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    // 'browserName': 'chrome',
    browserName: '',
    appPackage: 'io.ionic.starter',
    appActivity: 'MainActivity',
    platformName: 'Android',
    deviceName: 'Samsung Galaxy J3 (2016)',
    autoAcceptAlerts: 'true',
    autoWebview: 'true',
    acceptInsecureCerts: 'true',
    chromeOptions: {
      binary: process.env.CHROME_BIN,
      args: ['--no-sandbox']
      }
  },
  // directConnect: true,
  baseUrl: 'http://localhost:4200',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  seleniumAddress: 'http://0.0.0.0:4723/wd/hub',
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
