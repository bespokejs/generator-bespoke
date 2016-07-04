/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('bespoke generator', function () {

  var baseFiles = [
    '.editorconfig',
    '.gitignore',
    'gulpfile.js',
    'package.json',
    'README.md',
    'src/images/bespoke-logo.jpg',
    'src/scripts/main.js',
    'src/styles/main.styl',
  ];

  function runGenerator(templatingLanguage) {
    return helpers.run(path.join(__dirname, '..', 'app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'title': 'foobar',
        'templatingLanguage': templatingLanguage,
        'highlight': false,
        'multimedia': false,
      })
      .toPromise();
  }

  it('should create expected files for Pug', function () {

    return runGenerator('Pug (formerly Jade)')
      .then(function () {
        assert.file(baseFiles.concat('src/index.pug'));
      });
  });

  it('should create expected files for AsciiDoc', function () {

    return runGenerator('AsciiDoc (with asciidoctor/asciidoctor-bespoke)')
      .then(function () {
        assert.file(baseFiles.concat('src/index.adoc'));
      });
  });

  it('should create expected files for HTML', function () {

    return runGenerator('HTML')
      .then(function () {
        assert.file(baseFiles.concat('src/index.html'));
      });
  });
});
