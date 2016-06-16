'use strict';

var util = require('util');
var path = require('path');
var generators = require('yeoman-generator');
var chalk = require('chalk');
var sortedObject = require('sorted-object');
var _ = require('lodash');

var welcome = [
  "",
  chalk.cyan.bold("oooooooooo.                                          oooo                          o8o              "),
  chalk.cyan.bold("`888'   `Y8b                                         `888                          `\"'             "),
  chalk.cyan.bold(" 888     888  .ooooo.   .oooo.o oo.ooooo.   .ooooo.   888  oooo   .ooooo.         oooo  .oooo.o     "),
  chalk.cyan.bold(" 888oooo888' d88' `88b d88(  \"8  888' `88b d88' `88b  888 .8P'   d88' `88b        `888 d88(  \"8   "),
  chalk.cyan.bold(" 888    `88b 888ooo888 `\"Y88b.   888   888 888   888  888888.    888ooo888         888 `\"Y88b.    "),
  chalk.cyan.bold(" 888    .88P 888    .o o.  )88b  888   888 888   888  888 `88b.  888    .o .o.     888 o.  )88b     "),
  chalk.cyan.bold("o888bood8P'  `Y8bod8P' 8\"\"888P'  888bod8P' `Y8bod8P' o888o o888o `Y8bod8P' Y8P     888 8\"\"888P' "),
  chalk.cyan.bold("                                 888                                               888              "),
  chalk.cyan.bold("                                o888o                                          .o. 88P              "),
  chalk.cyan.bold("                                                                               `Y888P               "),
  "",
  chalk.green.bold("Thanks for choosing Bespoke.js for your presentation! :)   -@markdalgleish"),
  ""
].join('\n');

var mandatoryPlugins = [
  { name: 'nav', version: '^1.0.2' },
  { name: 'classes', version: '^1.0.0' },
  { name: 'scale', version: '^1.0.0' },
  { name: 'bullets', version: '^1.0.0', configValue: "'li, .bullet'" },
  { name: 'hash', version: '^1.0.0' },
  { name: 'extern', version: '^1.0.0', configValue: "bespoke" },
];

var optionalPlugins = [
  {
    name: 'multimedia',
    version: '^1.0.0',
    message: 'Would you like to use multimedia (audio, video, animated GIFs or SVGs)?',
    default: false
  },
];

var PUGJS = 'Pug (formerly jade)';
var ASCIIDOC = 'AsciiDoc (with asciidoctor/asciidoctor-bespoke)';

var questions = [
  {
    name: 'title',
    message: 'What is the title of your presentation?',
    default: 'Hello World'
  },
  {
    name: 'templatingLanguage',
    message: 'Which templating language would you like to use?',
    type: 'list',
    choices: [PUGJS, ASCIIDOC, 'HTML'],
    default: PUGJS
  },
  {
    type: 'confirm',
    name: 'syntax',
    message: 'Will your presentation include code samples?',
    default: true
  },
];

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);
    this.log(welcome);
  },

  prompting: function () {

    var prompts = []
      .concat(questions)
      .concat(optionalPlugins.map(function (plugin) {
        return {
          type: 'confirm',
          name: plugin.name,
          message: plugin.message,
          default: 'default' in plugin ? plugin['default'] : true
        };
      }));

    return this.prompt(prompts).then(function (answers) {

      this.selectedPlugins = []
        .concat(mandatoryPlugins)
        .concat(optionalPlugins.filter(function (plugin) {
          return answers[plugin.name];
        }));

      this.selectedPlugins.forEach(function (plugin) {
        plugin.varName = _.camelCase(plugin.name);
      });

      optionalPlugins.forEach(function (plugin) {
        var usePluginName = 'usePlugin' + _.upperFirst(_.camelCase(plugin.name));
        console.log(usePluginName);
        this[usePluginName] = answers[plugin.name];
      }.bind(this));

      this.usePug = (answers.templatingLanguage === PUGJS);
      this.useAsciiDoc = (answers.templatingLanguage === ASCIIDOC);
      this.useHtml = (answers.templatingLanguage === 'HTML');

      this.syntax = answers.syntax;
      this.title = answers.title;
      this.shortName = _.kebabCase(answers.title);

    }.bind(this));
  },

  configuring: function () {

    this.template('README.md', 'README.md');
    this.template('gulpfile.js', 'gulpfile.js');
    this.copy('_gitignore', '.gitignore');
    this.copy('_editorconfig', '.editorconfig');

    var packageSettings = {
      name: 'presentation-' + this.shortName,
      version: '0.0.0'
    };

    var devDependencies = {
      'bespoke': '^1.0.0',
      'browserify': '^13.0.1',
      'del': '^2.2.0',
      'gh-pages': '^0.11.0',
      'gulp': '^3.8.1',
      'gulp-autoprefixer': '^3.1.0',
      'gulp-connect': '^4.0.0',
      'gulp-csso': '^2.0.0',
      'gulp-plumber': '^1.1.0',
      'gulp-rename': '^1.2.0',
      'gulp-stylus': '^2.3.1',
      'gulp-uglify': '^1.5.3',
      'gulp-util': '^3.0.7',
      'insert-css': '^0.2.0',
      'normalizecss': '^3.0.0',
      'through': '^2.3.4',
      'vinyl-buffer': '^1.0.0',
      'vinyl-source-stream': '^1.1.0',
    }

    if (this.usePug) {
      devDependencies['gulp-pug'] = '^3.0.2';
    }

    if (this.useAsciiDoc) {
      devDependencies['gulp-exec'] = '^2.1.2';
    }

    this.selectedPlugins.forEach(function (plugin) {
      devDependencies['bespoke-' + plugin.name] = plugin.version;
    });


    if (this.syntax) {
      devDependencies['prismjs'] = '^1.4.1';
      devDependencies['prism-themes'] = 'PrismJS/prism-themes';
    }

    packageSettings.devDependencies = sortedObject(devDependencies);

    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
  },

  writing: function () {

    if (this.usePug) {
      this.template('src/index.pug', 'src/index.pug');
    }
    if (this.useAsciiDoc) {
      this.template('src/index.adoc', 'src/index.adoc');
      this.copy('Gemfile', 'Gemfile');
    }
    if (this.useHtml) {
      this.template('src/index.html', 'src/index.html');
    }

    this.copy('src/images/bespoke-logo.jpg', 'src/images/bespoke-logo.jpg');
    this.template('src/scripts/main.js', 'src/scripts/main.js');
    this.template('src/styles/main.styl', 'src/styles/main.styl');
  },

  install: function () {
    this.installDependencies({ bower: false });
  }
});
