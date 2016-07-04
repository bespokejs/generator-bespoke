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
      });
  }

  it('should create expected files for Pug', function () {

    var ctx = runGenerator('Pug (formerly Jade)');
    return ctx.toPromise().then(function () {
      assert.file(baseFiles.concat('src/index.pug'));
      ctx.cleanTestDirectory();
    });
  });

  it('should create expected files for AsciiDoc', function () {

    var ctx = runGenerator('AsciiDoc (using Asciidoctor Bespoke)');
    return ctx.toPromise().then(function () {
      assert.file(baseFiles.concat('src/index.adoc'));
      ctx.cleanTestDirectory();
    });
  });

  it('should create expected files for HTML', function () {

    var ctx = runGenerator('HTML');
    return ctx.toPromise().then(function () {
      assert.file(baseFiles.concat('src/index.html'));
      ctx.cleanTestDirectory();
    });
  });
});
