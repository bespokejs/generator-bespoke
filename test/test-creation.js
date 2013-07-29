/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('bespoke generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('bespoke:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'package.json',
      'bower.json',
      'Gruntfile.js',
      '.gitignore',
      '.jshintrc',
      '.bowerrc',
      'src/index.jade',
      'src/scripts/main.js',
      'src/styles/main.styl'
    ];

    helpers.mockPrompt(this.app, {
      'title': 'Foo Bar',
      'bullets': 'Y',
      'hash': 'Y'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
