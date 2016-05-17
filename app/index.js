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
  { name: 'keys', version: '^1.0.0' },
  { name: 'touch', version: '^1.0.0' },
  { name: 'scale', version: '^1.0.0' },
  { name: 'bullets', version: '^1.0.0', configValue: "'li, .bullet'" },
  { name: 'hash', version: '^1.0.0' },
  { name: 'extern', version: '^1.0.0', configValue: "bespoke" },
];

var optionalPlugins = [];

var questions = [
  {
    name: 'title',
    message: 'What is the title of your presentation?',
    default: 'Hello World'
  },
  {
    type: 'confirm',
    name: 'useTheme',
    message: 'Would you like to use a pre-made theme?',
    default: true
  },
  {
    type: 'confirm',
    name: 'syntax',
    message: 'Will your presentation include code samples?',
    default: true
  }
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

      var themePlugin = { name: 'classes', version: '^1.0.0' };
      if (answers.useTheme) {
        themePlugin = { name: 'theme-cube', version: '^2.0.0' };
      }

      this.selectedPlugins = []
        .concat(themePlugin)
        .concat(mandatoryPlugins)
        .concat(optionalPlugins.filter(function (plugin) {
          return answers[plugin.name];
        }));

      this.selectedPlugins.forEach(function (plugin) {
        plugin.varName = _.camelCase(plugin.name);
      });

      optionalPlugins.forEach(function (plugin) {
        var usePluginName = 'usePlugin' + _.upperFirst(_.camelCase(plugin.name));
        this[usePluginName] = answers[plugin.name];
      }.bind(this));

      this.syntax = answers.syntax;
      this.title = answers.title;
      this.useTheme = answers.useTheme;
      this.shortName = _.kebabCase(answers.title);

    }.bind(this));
  },

  configuring: function () {

    this.template('README.md', 'README.md');
    this.copy('gulpfile.js', 'gulpfile.js');
    this.copy('_gitignore', '.gitignore');
    this.copy('_editorconfig', '.editorconfig');

    var packageSettings = {
      name: 'presentation-' + this.shortName,
      version: '0.0.0'
    };

    var devDependencies = {
      'bespoke': '^1.1.0',
      'del': '^2.2.1',
      'gh-pages': '^0.11.0',
      'gulp': '^3.9.1',
      'gulp-autoprefixer': '^3.1.0',
      'gulp-browserify': '^0.5.0',
      'gulp-connect': '^4.1.0',
      'gulp-csso': '^2.0.0',
      'gulp-plumber': '^1.1.0',
      'gulp-pug': '^3.0.3',
      'gulp-rename': '^1.2.2',
      'gulp-stylus': '^2.5.0',
      'gulp-uglify': '^1.5.4',
      'gulp-util': '^3.0.7',
      'insert-css': '^0.2.0',
      'through': '^2.3.8'
    };

    this.selectedPlugins.forEach(function (plugin) {
      devDependencies['bespoke-' + plugin.name] = plugin.version;
    });

    if (!this.useTheme) {
      devDependencies['normalizecss'] = '^3.0.0';
    }

    if (this.syntax) {
      devDependencies['prismjs'] = '^1.4.1';
      devDependencies['prism-themes'] = 'PrismJS/prism-themes';
    }

    packageSettings.devDependencies = sortedObject(devDependencies);

    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
  },

  writing: function () {
    this.template('src/index.pug', 'src/index.pug');
    this.copy('src/images/bespoke-logo.jpg', 'src/images/bespoke-logo.jpg');
    this.template('src/scripts/main.js', 'src/scripts/main.js');
    this.template('src/styles/main.styl', 'src/styles/main.styl');
  },

  install: function () {
    this.installDependencies({ bower: false });
  }
});
