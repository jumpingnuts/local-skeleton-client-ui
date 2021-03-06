// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-md5/angular-md5.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
//      'test/mock/**/*.js',
      'test/spec/*.test.js',
      'test/spec/**/*.test.js'
    ],
    
    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 9876,
        
    // cli runner port
    runnerPort: 9100,
    
    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // If browser does not capture in given timeout [ms], kill it
    //captureTimeout: 5000,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
