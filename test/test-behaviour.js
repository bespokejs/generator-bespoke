/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var spawn = require('child_process').spawn;

function createErrorFromStdErr(errorOutput) {

  var errorDetails = errorOutput
    .split('\n')
    .filter(function (errorLine) {
      return errorLine.indexOf('npm ERR!') !== 0 && errorLine.trim() !== '';
    })
    .map(function (errorLine) {
      return '\t' + errorLine;
    });

  errorDetails.unshift('deck at http://localhost:8080 does not work as expected');

  return new Error(errorDetails.join('\n'));
}

// seems that using child_process.exec does not retrieve the whole stderr :-(
function spawnAndCollectStderr(cmd, args, opts, done) {

  var spawnedProcess = spawn(cmd, args, opts);

  var processErrors = '';
  spawnedProcess.stderr.on('data', function (errBuffer) {
    processErrors += errBuffer.toString();
  });

  spawnedProcess.on('close', function (code) {

    if (code !== 0) {
      return done(createErrorFromStdErr(processErrors));
    }

    return done(null);
  });
}

describe('bespoke generator', function () {

  before(function () {

    // npm install can be long
    this.timeout(60000);

    this.ctx = helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: false })
      .withPrompts({
        'title': 'Foobar Test Title',
        'templatingLanguage': 'Pug (formerly Jade)',
        'highlight': false,
        'multimedia': false,
      });

    return this.ctx.toPromise();
  });

  after(function () {
    this.timeout(20000);
    this.ctx.cleanTestDirectory();
  });

  it('should provide a "gulp serve" command with a basic working bespoke deck', function (done) {

    // gulp serve + phantom tests can be long
    this.timeout(20000);

    // start gulp serve (on tmp dir by default)
    var gulpServerProcess = spawn('./node_modules/.bin/gulp', ['serve']);

    // Wait for gulp serve to be ready (5 sec)
    setTimeout(function () {

      // start phantomjs tests
      var spawnOpts = { cwd: path.join(__dirname, '..') };
      spawnAndCollectStderr('npm', ['run', 'test-user'], spawnOpts, function (err) {

        // kill gulp serve when phantomjs tests are finished
        process.kill(gulpServerProcess.pid);

        return done(err);
      });
    }, 5000);
  });

  it('should provide a "gulp build" command with correct generated files', function (done) {

    // gulp build can be long
    this.timeout(20000);

    spawnAndCollectStderr('./node_modules/.bin/gulp', ['build'], {}, function (err) {

      assert.file([
        'dist/index.html',
        'dist/build/build.css',
        'dist/build/build.js',
        'dist/images/bespoke-logo.jpg'
      ]);

      return done(err);
    });
  });
});
