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
      '.bowerrc',
      '.editorconfig',
      '.gitignore',
      'bower.json',
      'gulpfile.js',
      'package.json',
      'README.md',
      'src/index.jade',
      'src/scripts/main.js',
      'src/styles/main.styl',
      'src/images'
    ];

    helpers.mockPrompt(this.app, {
      'title': 'Foo Bar',
      'bullets': 'Y',
      'backdrop': 'Y',
      'scale': 'Y',
      'hash': 'Y',
      'progress': 'Y',
      'prism': 'Y'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
